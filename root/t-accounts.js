class TAccountManager {
    constructor() {
        this.initializeButtons(); // Setup action buttons
        this.initializeModal(); // Setup modal dialogs
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
                        <button type="submit" class="auth-button">Add Account</button>
                    </form>

                    <form id="edit-account-form" class="auth-form">
                        <h2>Edit Account</h2>
                        <div class="form-group">
                            <label for="edit-account-select">Select Account</label>
                            <select id="edit-account-select" name="accountSelect" required></select>
                        </div>
                        <div class="form-group">
                            <label for="edit-account-name">New Account Name</label>
                            <input type="text" id="edit-account-name" name="accountName" required>
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
        document.getElementById('add-account-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAccount(e.target.accountName.value);
            this.closeModal();
        });

        document.getElementById('edit-account-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.editAccount(e.target.accountSelect.value, e.target.accountName.value);
            this.closeModal();
        });

        document.getElementById('delete-account-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.deleteAccount(e.target.accountSelect.value);
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
    addAccount(accountName) {
        if (!accountName) return;

        const tAccountGrid = document.querySelector('.t-account-grid');
        const newAccount = document.createElement('div');
        newAccount.className = 't-account';
        newAccount.innerHTML = `
            <h3>${accountName}</h3>
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
        tAccountGrid.appendChild(newAccount);
    }

    editAccount(oldName, newName) {
        if (!oldName || !newName) return;

        const accountToEdit = Array.from(document.querySelectorAll('.t-account h3'))
            .find(h3 => h3.textContent === oldName);

        if (accountToEdit) {
            accountToEdit.textContent = newName;
        }
    }

    deleteAccount(accountName) {
        if (!accountName) return;

        const accountToDelete = Array.from(document.querySelectorAll('.t-account h3'))
            .find(h3 => h3.textContent === accountName)
            ?.closest('.t-account');

        if (accountToDelete) {
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
            document.getElementById('confirm-delete').onclick = () => {
                accountToDelete.remove();
                confirmModal.remove();
            };

            document.getElementById('cancel-delete').onclick = () => {
                confirmModal.remove();
            };
        }
    }
}

// Initialize T-Account manager when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TAccountManager();
});
