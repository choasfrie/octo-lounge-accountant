import { validateAccountData, handleApiResponse, LoadingState } from '../utils/validationUtils.js';

const API_BASE_URL = 'http://localhost:5116/api/Accounts';

class AccountService {
    constructor() {
        this.loadingState = new LoadingState('account-grid');
    }

    async createAccount(accountData) {
        const errors = validateAccountData(accountData);
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }

        console.log('Create Account Request Body:', accountData);
        this.loadingState.start('Creating account...');
        try {
            const response = await fetch(`${API_BASE_URL}/createAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(accountData)
            });
            const data = await handleApiResponse(response, 'Failed to create account');
            this.loadingState.end();
            return data;
        } catch (error) {
            this.loadingState.error(error.message);
            throw error;
        }
    }

    async deleteAccount(accountId) {
        try {
            console.log('Delete Account Request:', { accountId });
            const response = await fetch(`${API_BASE_URL}/deleteAccount/${accountId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete account');
            return await response.text();
        } catch (error) {
            console.error('Error deleting account:', error);
            throw error;
        }
    }

    async editAccount(accountId, accountData) {
        try {
            console.log('Edit Account Request Body:', { accountId, accountData });
            const response = await fetch(`${API_BASE_URL}/editAccount/${accountId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(accountData)
            });
            if (!response.ok) throw new Error('Failed to edit account');
            return await response.json();
        } catch (error) {
            console.error('Error editing account:', error);
            throw error;
        }
    }

    async getAccountsByOwner(ownerId) {
        try {
            const response = await fetch(`${API_BASE_URL}/getAccountsByOwner/${ownerId}`);
            if (!response.ok) throw new Error('Failed to fetch accounts');
            return await response.json();
        } catch (error) {
            console.error('Error fetching accounts:', error);
            throw error;
        }
    }
}

export const accountService = new AccountService();
