// Input validation functions
export const validateAccountData = (data) => {
    const errors = [];
    if (!data.Name?.trim()) errors.push('Account name is required');
    if (!data.AccountNumber || data.AccountNumber < 1000 || data.AccountNumber > 9999) {
        errors.push('Account number must be between 1000 and 9999');
    }
    if (!['+', '-'].includes(data.Behaviour)) errors.push('Invalid account behavior');
    if (!data.OwnerId) errors.push('Owner ID is required');
    return errors;
};

export const validateRecordData = (data) => {
    const errors = [];
    
    // Validate date
    if (!data.date) {
        errors.push('Date is required');
    } else if (isNaN(new Date(data.date).getTime())) {
        errors.push('Invalid date format');
    }

    // Validate amount
    if (typeof data.amount !== 'number' || isNaN(data.amount)) {
        errors.push('Amount must be a valid number');
    }

    // Validate creditor
    if (!data.creditorId || isNaN(parseInt(data.creditorId))) {
        errors.push('Creditor account is required and must be a valid ID');
    }

    // Validate debitor
    if (!data.debitorId || isNaN(parseInt(data.debitorId))) {
        errors.push('Debitor account is required and must be a valid ID');
    }

    return errors;
};

export const validateAuthData = (data, type = 'login') => {
    const errors = [];
    if (!data.username?.trim()) errors.push('Username is required');
    if (!data.password?.trim()) errors.push('Password is required');
    if (type === 'register') {
        if (!data.email?.trim()) errors.push('Email is required');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Invalid email format');
        }
    }
    return errors;
};

// API response handling
export const handleApiResponse = async (response, errorMessage = 'Operation failed') => {
    if (!response.ok) {
        let error = errorMessage;
        try {
            const errorData = await response.json();
            error = errorData.message || errorMessage;
        } catch (e) {
            console.error('Error parsing error response:', e);
        }
        throw new Error(error);
    }
    return response.json();
};

// Loading state management
export class LoadingState {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
    }

    start(message = 'Loading...') {
        if (this.element) {
            this.element.innerHTML = `<div class="loading">${message}</div>`;
        }
    }

    end() {
        if (this.element) {
            const loadingDiv = this.element.querySelector('.loading');
            if (loadingDiv) {
                loadingDiv.remove();
            }
        }
    }

    error(message) {
        if (this.element) {
            this.element.innerHTML = `<div class="error">${message}</div>`;
        }
    }
}
