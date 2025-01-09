import { recordService } from './services/recordService.js';

export class TransactionManager {
    static init() {
        try {
            return new TransactionManager();
        } catch (error) {
            console.error('Error initializing TransactionManager:', error);
        }
    }

    constructor() {
        try {
            this.initializeButtons();
            this.initializeModal();
            this.initializeFilter();
            this.loadExistingRecords();
        } catch (error) {
            console.error('Error in TransactionManager constructor:', error);
            throw error;
        }
    }

    async loadExistingRecords() {
        try {
            if (!authManager.currentUser) {
                console.error('No authenticated user');
                return;
            }

            // Load accounts and their records
            const accountsResponse = await accountService.getAccountsByOwner(authManager.currentUser.id);
            const accounts = accountsResponse.data;
            
            // Calculate balances and get records for each account
            const accountBalances = new Map();
            const allRecords = [];
            
            for (const account of accounts) {
                // Get records where account is creditor or debitor
                const [creditorRecords, debitorRecords] = await Promise.all([
                    recordService.getRecordsByCreditorId(account.Id),
                    recordService.getRecordsByDebitorId(account.Id)
                ]);
                
                // Calculate balance
                let balance = 0;
                const accountRecords = [...creditorRecords.data, ...debitorRecords.data];
                
                accountRecords.forEach(record => {
                    if (record.CreditorId === account.Id) {
                        balance -= record.Amount;
                    } else if (record.DebitorId === account.Id) {
                        balance += record.Amount;
                    }
                });
                
                accountBalances.set(account.Id, {
                    name: account.Name,
                    number: account.AccountNumber,
                    balance: balance,
                    records: accountRecords
                });
                
                allRecords.push(...accountRecords);
            }

            // Sort records by date
            allRecords.sort((a, b) => new Date(b.Date) - new Date(a.Date));

            // Update UI
            this.displayAccounts(accountBalances);
            this.displayRecords(allRecords);
        } catch (error) {
            console.error('Error loading records:', error);
        }
    }

    displayAccounts(accountBalances) {
        const accountGrid = document.getElementById('account-grid');
        if (!accountGrid) return;

        // Group accounts by category
        const categories = new Map();
        accountBalances.forEach((account, id) => {
            const category = Math.floor(account.number / 1000) * 1000;
            if (!categories.has(category)) {
                categories.set(category, []);
            }
            categories.get(category).push(account);
        });

        // Create account items
        accountGrid.innerHTML = '';
        categories.forEach((accounts, category) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'account-item';
            
            // Add icon based on category
            let icon = 'fas fa-wallet';
            if (category >= 2000 && category < 3000) icon = 'fas fa-file-invoice-dollar';
            if (category >= 3000 && category < 4000) icon = 'fas fa-chart-line';
            if (category >= 4000) icon = 'fas fa-chart-pie';
            
            categoryDiv.innerHTML = `
                <i class="${icon}"></i>
                <h3>${this.getCategoryName(category)}</h3>
                <div class="account-details">
                    ${accounts.map(acc => `
                        <p>${acc.name} (${acc.number}): CHF ${this.formatAmount(acc.balance)}</p>
                    `).join('')}
                </div>
            `;
            accountGrid.appendChild(categoryDiv);
        });
    }

    getCategoryName(category) {
        switch(category) {
            case 1000: return 'Current Assets';
            case 2000: return 'Liabilities';
            case 3000: return 'Revenue';
            case 4000: return 'Expenses';
            case 5000: return 'Personnel Expenses';
            case 6000: return 'Other Operating Expenses';
            case 7000: return 'Secondary Business Income';
            case 8000: return 'Non-operating Results';
            case 9000: return 'Closing';
            default: return 'Other';
        }
    }

    displayRecords(records) {
        const transactionList = document.querySelector('#records .transaction-list');
        if (!transactionList) return;

        transactionList.innerHTML = records.map(record => `
            <div class="transaction" data-record-id="${record.id}">
                <span class="date">${new Date(record.date).toLocaleDateString()}</span>
                <span class="description">
                    ${record.Debitor?.Name || 'Unknown'} → ${record.Creditor?.Name || 'Unknown'}
                    ${record.Description ? `: ${record.Description}` : ''}
                    ${record.Notes ? `<i class="fas fa-book notes-icon" data-notes="${record.Notes}"></i>` : ''}
                </span>
                <span class="amount ${record.amount >= 0 ? 'income' : 'expense'}">
                    ${this.formatAmount(record.amount)}
                </span>
            </div>
        `).join('');
    }

    initializeFilter() {
        const filter = document.getElementById('account-filter');
        if (filter) {
            filter.addEventListener('change', () => {
                const selectedAccount = filter.value;
                const transactions = document.querySelectorAll('#records .transaction');
                
                transactions.forEach(transaction => {
                    const description = transaction.querySelector('.description').textContent;
                    if (selectedAccount === 'all' || description.includes(selectedAccount)) {
                        transaction.style.display = '';
                    } else {
                        transaction.style.display = 'none';
                    }
                });
            });
        }
    }

    // Format currency amount
    formatAmount(amount) {
        const num = parseFloat(amount).toFixed(2);
        const [whole, decimal] = num.split('.');
        const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `CHF ${formattedWhole}.${decimal}`;
    }

    initializeButtons() {
        const addButton = document.querySelector('#records [data-tooltip="Add Record"]');
        const editButton = document.querySelector('#records [data-tooltip="Edit Record"]');
        const deleteButton = document.querySelector('#records [data-tooltip="Delete Record"]');

        addButton.addEventListener('click', () => this.showModal('add'));
        editButton.addEventListener('click', () => this.showModal('edit'));
        deleteButton.addEventListener('click', () => this.deleteTransaction());
    }

    initializeModal() {
        const modalHTML = `
            <div id="transaction-modal" class="auth-modal">
                <div class="auth-modal-content">
                    <button class="close-modal">&times;</button>
                    
                    <form id="add-transaction-form" class="auth-form">
                        <h2>Add New Transaction</h2>
                        <div class="form-group">
                            <label for="new-transaction-date">Date</label>
                            <input type="date" id="new-transaction-date" name="date" required>
                        </div>
                        <div class="form-group">
                            <label for="new-transaction-from">From Account</label>
                            <div class="autocomplete-wrapper">
                                <input type="text" id="new-transaction-from" name="fromAccount" required>
                                <div class="suggestions-list" id="from-suggestions"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="new-transaction-to">To Account</label>
                            <div class="autocomplete-wrapper">
                                <input type="text" id="new-transaction-to" name="toAccount" required>
                                <div class="suggestions-list" id="to-suggestions"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="new-transaction-amount">Amount (CHF)</label>
                            <input type="number" id="new-transaction-amount" name="amount" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="new-transaction-notes">Notes</label>
                            <textarea id="new-transaction-notes" name="notes" rows="3"></textarea>
                        </div>
                        <button type="submit" class="auth-button">Add Transaction</button>
                    </form>

                    <form id="edit-transaction-form" class="auth-form">
                        <h2>Edit Transaction</h2>
                        <div class="form-group">
                            <label for="edit-transaction-select">Select Transaction</label>
                            <select id="edit-transaction-select" name="transactionSelect" required></select>
                        </div>
                        <div class="form-group">
                            <label for="edit-transaction-date">Date</label>
                            <input type="date" id="edit-transaction-date" name="date" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-transaction-from">From Account</label>
                            <input type="text" id="edit-transaction-from" name="fromAccount" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-transaction-to">To Account</label>
                            <input type="text" id="edit-transaction-to" name="toAccount" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-transaction-amount">Amount (CHF)</label>
                            <input type="number" id="edit-transaction-amount" name="amount" step="0.01" required>
                        </div>
                        <button type="submit" class="auth-button">Update Transaction</button>
                    </form>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('transaction-modal');
        const closeBtn = modal?.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        const addForm = document.getElementById('add-transaction-form');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTransaction(e.target);
                this.closeModal();
            });

            // Initialize autocomplete
            const fromInput = document.getElementById('new-transaction-from');
            const toInput = document.getElementById('new-transaction-to');
            
            [fromInput, toInput].forEach(input => {
                input.addEventListener('input', (e) => this.showSuggestions(e.target));
                input.addEventListener('blur', () => {
                    // Delay hiding suggestions
                    setTimeout(() => {
                        const suggestionsList = input.nextElementSibling;
                        if (suggestionsList) {
                            suggestionsList.style.display = 'none';
                        }
                    }, 200);
                });
            });
        }

        const editForm = document.getElementById('edit-transaction-form');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.editTransaction(e.target);
                this.closeModal();
            });
        }

    }

    showModal(type) {
        const modal = document.getElementById('transaction-modal');
        const addForm = document.getElementById('add-transaction-form');
        const editForm = document.getElementById('edit-transaction-form');

        [addForm, editForm].forEach(form => form.style.display = 'none');

        if (type === 'edit') {
            const transactions = Array.from(document.querySelectorAll('#records .transaction'))
                .map((trans, index) => {
                    const date = trans.querySelector('.date').textContent;
                    const description = trans.querySelector('.description').textContent;
                    const amount = trans.querySelector('.amount').textContent;
                    return `<option value="${index}">${date} - ${description} - ${amount}</option>`;
                }).join('');

            if (transactions.length === 0) {
                alert('No transactions available to edit');
                return;
            }

            const select = document.getElementById('edit-transaction-select');
            select.innerHTML = transactions;
            select.addEventListener('change', (e) => this.populateEditForm(e.target.value));
            editForm.style.display = 'block';
            // Populate initial selection
            if (transactions.length > 0) {
                this.populateEditForm(0);
            }
        } else {
            addForm.style.display = 'block';
        }

        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('transaction-modal');
        modal.style.display = 'none';
    }

    async addTransaction(form) {
        try {
            const fromAccountName = form.fromAccount.value;
            const toAccountName = form.toAccount.value;
            
            const accounts = await accountService.getAccountsByOwner(authManager.currentUser.id);
            const fromAccount = accounts.find(acc => acc.name === fromAccountName);
            const toAccount = accounts.find(acc => acc.name === toAccountName);

            if (!fromAccount || !toAccount) {
                throw new Error('Invalid accounts');
            }

            const recordData = {
                Date: new Date(form.date.value),
                Amount: parseFloat(form.amount.value),
                Description: `${fromAccountName} → ${toAccountName}`,
                CreditorId: toAccount.Id,
                DebitorId: fromAccount.Id,
                Notes: form.notes.value
            };

            const newRecord = await recordService.createRecord(recordData);
            
            // Update UI
            const transactionList = document.querySelector('#records .transaction-list');
            const newTransaction = document.createElement('div');
            newTransaction.className = 'transaction';
            newTransaction.dataset.recordId = newRecord.id;
            newTransaction.innerHTML = `
                <span class="date">${new Date(newRecord.Date).toLocaleDateString()}</span>
                <span class="description">
                    ${newRecord.Description}
                    ${recordData.Notes ? `<i class="fas fa-book notes-icon" data-notes="${recordData.Notes}"></i>` : ''}
                </span>
                <span class="amount expense">${this.formatAmount(newRecord.Amount)}</span>
            `;
            transactionList.insertBefore(newTransaction, transactionList.firstChild);
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Failed to add transaction. Please try again.');
        }
    }

    async editTransaction(form) {
        try {
            const selectedIndex = form.transactionSelect.value;
            const transactions = document.querySelectorAll('#records .transaction');
            const transaction = transactions[selectedIndex];

            if (transaction) {
                const recordId = transaction.dataset.recordId;
                
                const fromAccountName = form.fromAccount.value;
                const toAccountName = form.toAccount.value;
                
                const accounts = await accountService.getAccountsByOwner(authManager.currentUser.id);
                const fromAccount = accounts.find(acc => acc.name === fromAccountName);
                const toAccount = accounts.find(acc => acc.name === toAccountName);

                if (!fromAccount || !toAccount) {
                    throw new Error('Invalid accounts');
                }

                const recordData = {
                    Date: new Date(form.date.value),
                    Amount: parseFloat(form.amount.value),
                    Description: `${fromAccountName} → ${toAccountName}`,
                    CreditorId: toAccount.Id,
                    DebitorId: fromAccount.Id
                };

                const updatedRecord = await recordService.editRecord(recordId, recordData);

                // Update UI
                transaction.querySelector('.date').textContent = new Date(updatedRecord.date).toLocaleDateString();
                transaction.querySelector('.description').textContent = updatedRecord.description;
                transaction.querySelector('.amount').textContent = this.formatAmount(updatedRecord.amount);
            }
        } catch (error) {
            console.error('Error editing transaction:', error);
            alert('Failed to edit transaction. Please try again.');
        }
    }

    populateEditForm(index) {
        const transaction = document.querySelectorAll('#records .transaction')[index];
        if (!transaction) return;

        const form = document.getElementById('edit-transaction-form');
        const description = transaction.querySelector('.description').textContent;
        const [fromAccount, toAccount] = description.split(' → ');
        const amount = transaction.querySelector('.amount').textContent
            .replace('CHF ', '')
            .replace(',', '')
            .replace('.00', '');
        const date = transaction.querySelector('.date').textContent;

        form.date.value = date;
        form.fromAccount.value = fromAccount;
        form.toAccount.value = toAccount;
        form.amount.value = parseFloat(amount);
    }

    async deleteTransaction() {
        const transactions = document.querySelectorAll('#records .transaction');
        if (transactions.length === 0) {
            alert('No transactions available to delete');
            return;
        }

        // Add delete icons to all transactions
        transactions.forEach(transaction => {
            if (!transaction.querySelector('.delete-icon')) {
                const amountSpan = transaction.querySelector('.amount');
                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'fas fa-trash delete-icon';
                deleteIcon.style.cssText = 'color: #ff4444; cursor: pointer; margin-left: 10px; vertical-align: middle;';
                
                deleteIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const description = transaction.querySelector('.description').textContent;
                    
                    // Show confirmation modal
                    const confirmModal = document.createElement('div');
                    confirmModal.className = 'auth-modal';
                    confirmModal.innerHTML = `
                        <div class="auth-modal-content">
                            <h2>Confirm Delete</h2>
                            <p>Are you sure you want to delete the transaction "${description}"?</p>
                            <div class="auth-error">Warning: This action cannot be undone!</div>
                            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                                <button class="auth-button" id="confirm-delete">Delete</button>
                                <button class="auth-button" id="cancel-delete">Cancel</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(confirmModal);
                    confirmModal.style.display = 'block';

                    // Handle confirmation
                    document.getElementById('confirm-delete').onclick = async () => {
                        try {
                            const recordId = transaction.dataset.recordId;
                            await recordService.deleteRecord(recordId);
                            transaction.remove();
                            confirmModal.remove();
                            this.removeDeleteIcons();
                        } catch (error) {
                            console.error('Error deleting transaction:', error);
                            alert('Failed to delete transaction. Please try again.');
                        }
                    };

                    document.getElementById('cancel-delete').onclick = () => {
                        confirmModal.remove();
                    };
                });

                amountSpan.appendChild(deleteIcon);
            }
        });
    }

    removeDeleteIcons() {
        try {
            const deleteIcons = document.querySelectorAll('#records .delete-icon');
            deleteIcons.forEach(icon => icon.remove());
        } catch (error) {
            console.error('Error removing delete icons:', error);
        }
    }

    getAccountsList() {
        // Get accounts from chart of accounts
        return [
            // Assets (1000-1999)
            'Kasse (1000)', 'Bank (1020)', 'PayPal (1021)', 'Post (1030)', 'Kreditkarten (1040)',
            'Debitoren (1100)', 'Delkredere (1109)', 'Vorschüsse (1140)', 'Vorsteuer (1170)',
            'Handelswaren (1200)', 'Rohstoffe (1210)',
            // Liabilities (2000-2999)
            'Kreditoren (2000)', 'Bank (2100)', 'Mehrwertsteuer (2200)', 'Sozialversicherungen (2210)',
            // Equity (2800-2999)
            'Eigenkapital (2800)', 'Privat (2891)',
            // Revenue (3000-3999)
            'Warenertrag (3000)', 'Dienstleistungsertrag (3200)',
            // Expenses (4000-6999)
            'Materialaufwand (4000)', 'Handelswarenaufwand (4200)', 'Löhne (5000)',
            'Mietaufwand (6000)', 'Versicherungsaufwand (6300)'
        ];
    }

    // Display autocomplete suggestions
    showSuggestions(input) {
        try {
            const suggestionsList = input.nextElementSibling;
            const accounts = this.getAccountsList(); 
            const inputValue = input.value.toLowerCase();

            // Filter accounts based on input
            const filteredAccounts = accounts.filter(account => 
                account.toLowerCase().includes(inputValue)
            );

            // Show/hide suggestions container
            if (inputValue && filteredAccounts.length > 0) {
                suggestionsList.innerHTML = filteredAccounts
                    .map(account => `<div class="suggestion-item">${account}</div>`)
                    .join('');
                suggestionsList.style.display = 'block';

                // Add click handlers to suggestions
                const suggestions = suggestionsList.getElementsByClassName('suggestion-item');
                Array.from(suggestions).forEach(suggestion => {
                    suggestion.addEventListener('click', () => {
                        input.value = suggestion.textContent;
                        suggestionsList.style.display = 'none';
                    });
                });
            } else {
                suggestionsList.style.display = 'none';
            }
        } catch (error) {
            console.error('Error showing suggestions:', error);
            // Hide suggestions list in case of error
            if (input.nextElementSibling) {
                input.nextElementSibling.style.display = 'none';
            }
        }
    }
}
