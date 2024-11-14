class TransactionManager {
    constructor() {
        this.initializeButtons();
        this.initializeModal();
        this.initializeFilter();
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

    formatAmount(amount) {
        // Convert to number and fix to 2 decimal places
        const num = parseFloat(amount).toFixed(2);
        // Split into whole and decimal parts
        const [whole, decimal] = num.split('.');
        // Add commas to whole number part
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
        const closeBtn = modal.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        const addForm = document.getElementById('add-transaction-form');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTransaction(e.target);
                this.closeModal();
            });

            // Initialize autocomplete for account inputs
            const fromInput = document.getElementById('new-transaction-from');
            const toInput = document.getElementById('new-transaction-to');
            
            [fromInput, toInput].forEach(input => {
                input.addEventListener('input', (e) => this.showSuggestions(e.target));
                input.addEventListener('blur', () => {
                    // Delay hiding suggestions to allow for clicks
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

    addTransaction(form) {
        const date = form.date.value;
        const fromAccount = form.fromAccount.value;
        const toAccount = form.toAccount.value;
        const amount = this.formatAmount(form.amount.value);

        const transactionList = document.querySelector('#records .transaction-list');
        const newTransaction = document.createElement('div');
        newTransaction.className = 'transaction';
        const notes = form.notes.value;
        newTransaction.innerHTML = `
            <span class="date">${date}</span>
            <span class="description">
                ${fromAccount} → ${toAccount}
                ${notes ? `<i class="fas fa-book notes-icon" data-notes="${notes}"></i>` : ''}
            </span>
            <span class="amount expense">${amount}</span>
        `;
        transactionList.insertBefore(newTransaction, transactionList.firstChild);
    }

    editTransaction(form) {
        const selectedIndex = form.transactionSelect.value;
        const transactions = document.querySelectorAll('#records .transaction');
        const transaction = transactions[selectedIndex];

        if (transaction) {
            const date = form.date.value;
            const fromAccount = form.fromAccount.value;
            const toAccount = form.toAccount.value;
            const amount = this.formatAmount(form.amount.value);

            transaction.querySelector('.date').textContent = date;
            transaction.querySelector('.description').textContent = `${fromAccount} → ${toAccount}`;
            transaction.querySelector('.amount').textContent = amount;
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

    deleteTransaction() {
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
                    document.getElementById('confirm-delete').onclick = () => {
                        transaction.remove();
                        confirmModal.remove();
                        this.removeDeleteIcons();
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
        const deleteIcons = document.querySelectorAll('#records .delete-icon');
        deleteIcons.forEach(icon => icon.remove());
    }

    getAccountsList() {
        // Get accounts from the chart of accounts
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

    showSuggestions(input) {
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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TransactionManager();
});
