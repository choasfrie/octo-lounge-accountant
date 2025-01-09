import { recordService } from './services/recordService.js';
import { authManager } from './auth.js';

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

            // Get all accounts with their records
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ACCOUNTS}/getAllAccountsAndRecords/${authManager.currentUser.id}`);
            if (!response.ok) throw new Error('Failed to fetch accounts and records');
            const accountsWithRecords = await response.json();

            // Calculate balances and collect all records
            const accountBalances = new Map();
            const allRecords = [];
            
            accountsWithRecords.forEach(account => {
                let balance = 0;
                account.Records.forEach(record => {
                    if (record.CreditorId === account.AccountId) {
                        balance -= record.Amount;
                    } else if (record.DebitorId === account.AccountId) {
                        balance += record.Amount;
                    }
                });

                accountBalances.set(account.AccountId, {
                    name: account.AccountName,
                    number: account.AccountNumber,
                    balance: balance,
                    records: account.Records
                });

                allRecords.push(...account.Records);
            });

            // Sort records by date
            allRecords.sort((a, b) => new Date(b.Date) - new Date(a.Date));

            // Update UI
            this.displayAccounts(accountBalances);
            this.displayRecords(allRecords);
            this.updateAccountFilter(accountsWithRecords);
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
        this.renderTAccounts(records);
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

    async initializeFilter() {
        const filter = document.getElementById('account-filter');
        if (filter) {
            filter.addEventListener('change', async () => {
                const selectedAccount = filter.value;
                if (selectedAccount === 'all') {
                    await this.loadAccounts();
                    return;
                }

                try {
                    const records = selectedAccount.startsWith('debitor-') 
                        ? await recordService.getRecordsByDebitorId(selectedAccount.replace('debitor-', ''))
                        : await recordService.getRecordsByCreditorId(selectedAccount.replace('creditor-', ''));
                    
                    this.displayRecords(records);
                } catch (error) {
                    console.error('Error filtering records:', error);
                }
            });
        }
    }

    updateAccountFilter(accounts) {
        const filter = document.getElementById('account-filter');
        if (!filter) return;

        filter.innerHTML = '<option value="all">All Accounts</option>';
        
        accounts.forEach(account => {
            const debitorOption = document.createElement('option');
            debitorOption.value = `debitor-${account.AccountId}`;
            debitorOption.textContent = `${account.AccountName} (Debits)`;
            filter.appendChild(debitorOption);

            const creditorOption = document.createElement('option');
            creditorOption.value = `creditor-${account.AccountId}`;
            creditorOption.textContent = `${account.AccountName} (Credits)`;
            filter.appendChild(creditorOption);
        });
    }

    updateAccountFilter(accounts) {
        const filter = document.getElementById('account-filter');
        if (!filter) return;

        // Clear existing options
        filter.innerHTML = '<option value="all">All Accounts</option>';

        // Add account options
        accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.AccountName;
            option.textContent = `${account.AccountName} (${account.AccountNumber})`;
            filter.appendChild(option);
        });
    }

    // Format currency amount
    renderTAccounts(records) {
        const tAccountsGrid = document.getElementById('t-accounts-grid');
        if (!tAccountsGrid) return;

        // Group records by account
        const accountsMap = new Map();
        records.forEach(record => {
            if (!accountsMap.has(record.DebitorId)) {
                accountsMap.set(record.DebitorId, {
                    name: record.Debitor?.Name || 'Unknown',
                    debits: [],
                    credits: []
                });
            }
            if (!accountsMap.has(record.CreditorId)) {
                accountsMap.set(record.CreditorId, {
                    name: record.Creditor?.Name || 'Unknown',
                    debits: [],
                    credits: []
                });
            }

            // Add to debitor's credits
            accountsMap.get(record.DebitorId).credits.push({
                amount: record.Amount,
                date: record.Date,
                description: record.Description
            });

            // Add to creditor's debits
            accountsMap.get(record.CreditorId).debits.push({
                amount: record.Amount,
                date: record.Date,
                description: record.Description
            });
        });

        // Render T-Accounts
        tAccountsGrid.innerHTML = '';
        accountsMap.forEach((account, accountId) => {
            const tAccount = document.createElement('div');
            tAccount.className = 't-account';
            tAccount.innerHTML = `
                <h3>${account.name}</h3>
                <div class="t-account-content">
                    <div class="debit-side">
                        <h4>Debit (+)</h4>
                        ${account.debits.map(entry => `
                            <div class="entry">
                                <span>${this.formatAmount(entry.amount)} - ${entry.description}</span>
                                <span class="date">${new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="credit-side">
                        <h4>Credit (-)</h4>
                        ${account.credits.map(entry => `
                            <div class="entry">
                                <span>${this.formatAmount(entry.amount)} - ${entry.description}</span>
                                <span class="date">${new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            tAccountsGrid.appendChild(tAccount);
        });
    }

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

    async getAccountsList() {
        try {
            if (!authManager.currentUser) {
                return [];
            }
            
            const response = await fetch(`https://localhost:7162/api/Accounts/getAccountsByOwner/${authManager.currentUser.id}`);
            if (!response.ok) throw new Error('Failed to fetch accounts');
            const accounts = await response.json();
            
            return accounts.map(account => 
                `${account.name} (${account.accountNumber})`
            );
        } catch (error) {
            console.error('Error fetching accounts:', error);
            return [];
        }
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
