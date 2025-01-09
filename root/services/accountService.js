import { API_CONFIG } from '../config.js';
import { validateAccountData, handleApiResponse, LoadingState } from '../utils/validationUtils.js';

const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ACCOUNTS}`;

class AccountService {
    constructor() {
        this.loadingState = new LoadingState('account-grid');
    }

    async createAccount(accountData) {
        const errors = validateAccountData(accountData);
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }

        this.loadingState.start('Creating account...');
        try {
            const response = await fetch(`${API_BASE_URL}/createAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Name: accountData.Name,
                    AccountType: accountData.AccountType,
                    AccountNumber: accountData.AccountNumber,
                    Behaviour: accountData.Behaviour,
                    OwnerId: accountData.OwnerId
                })
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

    async createStandardPackage(profileId, companyType) {
        try {
            const response = await fetch(`${API_BASE_URL}/createStandardPackage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profileId: profileId,
                    companyType: companyType
                })
            });
            if (!response.ok) throw new Error('Failed to create standard package');
            return await response.json();
        } catch (error) {
            console.error('Error creating standard package:', error);
            throw error;
        }
    }
}

export const accountService = new AccountService();
