import { authManager } from './auth.js';
import { accountService } from './services/accountService.js';

class TAccountManager {
    getCurrentUserId() {
        if (!authManager.currentUser) {
            throw new Error('User not authenticated');
        }
        return authManager.currentUser.id;
    }
    constructor() {
        this.initializeButtons(); // Setup action buttons
        this.initializeModal(); // Setup modal dialogs
        this.loadAccounts(); // Load initial accounts
    }

    async loadAccounts() {
        try {
            const userId = this.getCurrentUserId();
            const response = await fetch(`http://localhost:5116/api/Accounts/getAllAccountsAndRecords/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
                }
            });
            if (!response.ok) {
                if (response.status === 404) {
                    const tAccountGrid = document.querySelector('.t-account-grid');
                    tAccountGrid.innerHTML = '<div class="error">No accounts found. Please create an account to get started.</div>';
                    return;
                }
                throw new Error('Failed to fetch accounts');
            }
            const accountsData = await response.json();
            
            const tAccountGrid = document.querySelector('.t-account-grid');
            if (!tAccountGrid) {
                console.error('T-account grid element not found');
                return;
            }
            tAccountGrid.innerHTML = ''; // Clear loading state
            
            accountsData.forEach(account => {
                const accountElement = document.createElement('div');
                accountElement.className = 't-account';
                accountElement.dataset.accountId = account.accountId;
                accountElement.dataset.behavior = account.accountBehaviour;
                
                // Calculate totals for debugging - handle both camelCase and PascalCase
                const debits = account.records
                    .filter(r => (r.DebitorId === account.accountId || r.debitorId === account.accountId))
                    .reduce((sum, r) => sum + parseFloat(r.Amount || r.amount), 0);
                const credits = account.records
                    .filter(r => (r.CreditorId === account.accountId || r.creditorId === account.accountId))
                    .reduce((sum, r) => sum + parseFloat(r.Amount || r.amount), 0);
                // Determine outline color and behavior symbol based on account behavior
                const outlineColor = account.accountBehaviour === '+' ? '#4CAF50' : '#F44336';
                const behaviorSymbol = account.accountBehaviour;
                
                accountElement.innerHTML = `
                    <h3>
                        ${account.accountName} (${account.accountNumber})
                        <span data-tooltip="${account.accountBehaviour === '+' ? 'Active Account (Debit behavior)' : 'Passive Account (Credit behavior)'}">
                            <i class="fas fa-book" style="margin-left: 8px; font-size: 0.8em; color: #666;"></i>
                        </span>
                    </h3>
                    <div class="t-account-content">
                        <div class="debit-side">
                            <h4>Debit (+)</h4>
                            ${account.records
                                .filter(r => r.DebitorId === account.accountId || r.debitorId === account.accountId)
                                .map(r => `
                                    <div class="entry">
                                        <span class="amount">${this.formatAmount(Math.abs(r.Amount || r.amount))}</span>
                                    </div>
                                `).join('') || '<div class="entry"><span>No debit entries</span></div>'}
                        </div>
                        <div class="credit-side">
                            <h4>Credit (-)</h4>
                            ${account.records
                                .filter(r => r.CreditorId === account.accountId || r.creditorId === account.accountId)
                                .map(r => `
                                    <div class="entry">
                                        <span class="amount">${this.formatAmount(Math.abs(r.Amount || r.amount))}</span>
                                    </div>
                                `).join('') || '<div class="entry"><span>No credit entries</span></div>'}
                        </div>
                    </div>
                `;
                tAccountGrid.appendChild(accountElement);
            });
        } catch (error) {
            console.error('Error loading accounts:', error);
            const tAccountGrid = document.querySelector('.t-account-grid');
            tAccountGrid.innerHTML = '<div class="error">Failed to load accounts. Please try again.</div>';
        }
    }

    formatAmount(amount) {
        return new Intl.NumberFormat('de-CH', { 
            style: 'currency', 
            currency: 'CHF' 
        }).format(amount);
    }

    initializeButtons() {
        const addButton = document.querySelector('[data-tooltip="Add Account"]');
        const editButton = document.querySelector('[data-tooltip="Edit Account"]');
        const deleteButton = document.querySelector('[data-tooltip="Delete Account"]');

        addButton.addEventListener('click', () => this.showModal('add'));
        editButton.addEventListener('click', () => this.showModal('edit'));
        deleteButton.addEventListener('click', () => this.showModal('delete'));
    }

    initializeModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="account-modal" class="auth-modal">
                <div class="auth-modal-content">
                    <button class="close-modal">&times;</button>
                    
                    <form id="add-account-form" class="auth-form">
                        <h2>Add New Account</h2>
                        <div class="form-group">
                            <label for="new-account-name">Account Name</label>
                            <input type="text" id="new-account-name" name="accountName" required>
                        </div>
                        <div class="form-group">
                            <label for="new-account-number">Account Number</label>
                            <input type="number" id="new-account-number" name="accountNumber" required min="1000" max="9999">
                        </div>
                        <div class="form-group">
                            <label for="new-account-behavior">Account Behavior</label>
                            <select id="new-account-behavior" name="accountBehavior" required>
                                <option value="+">Active (Debit)</option>
                                <option value="-">Passive (Credit)</option>
                            </select>
                        </div>
                        <button type="submit" class="auth-button">Add Account</button>
                    </form>

                    <form id="edit-account-form" class="auth-form">
                        <h2>Edit Account</h2>
                        <div class="form-group">
                            <label for="edit-account-select">Select Account</label>
                            <select id="edit-account-select" name="accountSelect" required></select>
                        </div>
                        <div class="form-group">
                            <label for="edit-account-name">Account Name</label>
                            <input type="text" id="edit-account-name" name="accountName" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-account-number">Account Number</label>
                            <input type="number" id="edit-account-number" name="accountNumber" required min="1000" max="9999">
                        </div>
                        <div class="form-group">
                            <label for="edit-account-behavior">Account Behavior</label>
                            <select id="edit-account-behavior" name="accountBehavior" required>
                                <option value="+">Active (Debit)</option>
                                <option value="-">Passive (Credit)</option>
                            </select>
                        </div>
                        <button type="submit" class="auth-button">Update Account</button>
                    </form>

                    <form id="delete-account-form" class="auth-form">
                        <h2>Delete Account</h2>
                        <div class="form-group">
                            <label for="delete-account-select">Select Account</label>
                            <select id="delete-account-select" name="accountSelect" required></select>
                        </div>
                        <div class="auth-error">Warning: This action cannot be undone!</div>
                        <button type="submit" class="auth-button">Delete Account</button>
                    </form>
                </div>
            </div>`;

        // Add modal to document
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Initialize modal events
        const modal = document.getElementById('account-modal');
        const closeBtn = modal.querySelector('.close-modal');
        
        closeBtn.addEventListener('click', () => this.closeModal());
        
        // Initialize form submissions
        document.getElementById('add-account-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addAccount(e.target);
            this.closeModal();
            this.loadAccounts(); // Refresh the accounts view
        });

        document.getElementById('edit-account-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.editAccount(e.target);
            this.closeModal();
        });

        document.getElementById('delete-account-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.deleteAccount();
            this.closeModal();
        });
    }

    showModal(type) {
        const modal = document.getElementById('account-modal');
        const addForm = document.getElementById('add-account-form');
        const editForm = document.getElementById('edit-account-form');
        const deleteForm = document.getElementById('delete-account-form');

        // Hide all forms first
        [addForm, editForm, deleteForm].forEach(form => form.style.display = 'none');

        // Update account lists for edit and delete forms
        if (type !== 'add') {
            const accounts = Array.from(document.querySelectorAll('.t-account h3'));
            const options = accounts.map(h3 => 
                `<option value="${h3.textContent}">${h3.textContent}</option>`
            ).join('');

            if (accounts.length === 0) {
                alert('No accounts available');
                return;
            }

            document.getElementById('edit-account-select').innerHTML = options;
            document.getElementById('delete-account-select').innerHTML = options;
        }

        // Show appropriate form
        if (type === 'add') addForm.style.display = 'block';
        else if (type === 'edit') editForm.style.display = 'block';
        else if (type === 'delete') deleteForm.style.display = 'block';

        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('account-modal');
        modal.style.display = 'none';
    }

    // Create new T-Account entry
    async addAccount(form) {
        const accountName = form.accountName.value;
        const accountNumber = form.accountNumber.value;
        const accountBehavior = form.accountBehavior.value;

        if (!accountName || !accountNumber || !accountBehavior) return;

        try {
            const accountData = {
                Name: accountName,
                AccountNumber: parseInt(accountNumber),
                AccountType: null,
                Behaviour: accountBehavior,
                OwnerId: parseInt(sessionStorage.getItem('userId'))
            };

            const newAccount = await accountService.createAccount(accountData);
            
            const tAccountGrid = document.querySelector('.t-account-grid');
            const accountElement = document.createElement('div');
            accountElement.className = 't-account';
            accountElement.dataset.accountId = newAccount.id;
            accountElement.innerHTML = `
                <h3>${newAccount.Name}</h3>
                <div class="t-account-content">
                    <div class="debit-side">
                        <h4>Debit (+)</h4>
                        <div class="entry">
                            <span>Click to add entry</span>
                        </div>
                    </div>
                    <div class="credit-side">
                        <h4>Credit (-)</h4>
                        <div class="entry">
                            <span>Click to add entry</span>
                        </div>
                    </div>
                </div>
            `;
            tAccountGrid.appendChild(accountElement);
        } catch (error) {
            console.error('Failed to add account:', error);
            alert('Failed to create account. Please try again.');
        }
    }

    async editAccount(form) {
        const selectedAccount = form.accountSelect.value;
        if (!selectedAccount) return;

        const accountElement = Array.from(document.querySelectorAll('.t-account'))
            .find(acc => acc.querySelector('h3').textContent === selectedAccount);

        if (accountElement) {
            try {
                const accountId = accountElement.dataset.accountId;
                const accountData = {
                    name: form.accountName.value,
                    accountType: null,
                    accountNumber: parseInt(form.accountNumber.value),
                    behaviour: form.accountBehavior.value,
                    ownerId: parseInt(sessionStorage.getItem('userId'))
                };

                await accountService.editAccount(accountId, accountData);
                await this.loadAccounts(); // Refresh the accounts view
            } catch (error) {
                console.error('Failed to edit account:', error);
                alert('Failed to update account. Please try again.');
            }
        }
    }

    async deleteAccount() {
        const selectElement = document.getElementById('delete-account-select');
        if (!selectElement || !selectElement.value) {
            alert('No account selected');
            return;
        }

        // Find the account element that matches the selected name
        const accounts = document.querySelectorAll('.t-account');
        const selectedAccount = Array.from(accounts).find(account => 
            account.querySelector('h3').textContent === selectElement.value
        );

        if (!selectedAccount) {
            alert('Selected account not found');
            return;
        }

        const accountId = selectedAccount.dataset.accountId;
        const accountName = selectElement.value;

        // Show confirmation modal
        const confirmModal = document.createElement('div');
        confirmModal.className = 'auth-modal';
        confirmModal.innerHTML = `
            <div class="auth-modal-content">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete the account "${accountName}"?</p>
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
                await accountService.deleteAccount(accountId);
                selectedAccount.remove();
                confirmModal.remove();
                await this.loadAccounts(); // Refresh the accounts view
            } catch (error) {
                console.error('Failed to delete account:', error);
                alert('Failed to delete account. Please try again.');
            }
        };

        document.getElementById('cancel-delete').onclick = () => {
            confirmModal.remove();
        };
    }
}

// Initialize T-Account manager when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TAccountManager();
});
