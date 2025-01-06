const API_BASE_URL = 'api/Accounts';

class AccountService {
    async createAccount(accountData) {
        try {
            const response = await fetch(`${API_BASE_URL}/createAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(accountData)
            });
            if (!response.ok) throw new Error('Failed to create account');
            return await response.json();
        } catch (error) {
            console.error('Error creating account:', error);
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
