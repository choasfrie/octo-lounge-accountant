import { validateRecordData, handleApiResponse, LoadingState } from '../utils/validationUtils.js';

const API_BASE_URL = 'http://localhost:5116/api/Records';

class RecordService {
    constructor() {
        this.loadingState = new LoadingState('records');
    }

    async createRecord(recordData) {
        const errors = validateRecordData(recordData);
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }

        this.loadingState.start('Creating record...');
        try {
            const response = await fetch(`${API_BASE_URL}/createRecord`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({
                    Date: new Date(recordData.Date).toISOString(),
                    Amount: parseFloat(recordData.Amount),
                    Description: recordData.Description,
                    CreditorId: recordData.CreditorId,
                    DebitorId: recordData.DebitorId
                })
            });
            const data = await handleApiResponse(response, 'Failed to create record');
            this.loadingState.end();
            return data;
        } catch (error) {
            this.loadingState.error(error.message);
            throw error;
        }
    }

    async deleteRecord(recordId) {
        try {
            const response = await fetch(`${API_BASE_URL}/deleteRecord/${recordId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete record');
            return await response.text();
        } catch (error) {
            console.error('Error deleting record:', error);
            throw error;
        }
    }

    async editRecord(recordId, recordData) {
        try {
            const response = await fetch(`${API_BASE_URL}/editRecord/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recordData)
            });
            if (!response.ok) throw new Error('Failed to edit record');
            return await response.json();
        } catch (error) {
            console.error('Error editing record:', error);
            throw error;
        }
    }

    async getRecordsByDebitorId(debitorId) {
        try {
            const response = await fetch(`${API_BASE_URL}/getRecordsByDebitorId/${debitorId}`);
            if (!response.ok) throw new Error('Failed to fetch records');
            return await response.json();
        } catch (error) {
            console.error('Error fetching records:', error);
            throw error;
        }
    }

    async getRecordsByCreditorId(creditorId) {
        try {
            const response = await fetch(`${API_BASE_URL}/getRecordsByCreditorId/${creditorId}`);
            if (!response.ok) throw new Error('Failed to fetch records');
            return await response.json();
        } catch (error) {
            console.error('Error fetching records:', error);
            throw error;
        }
    }
}

export const recordService = new RecordService();
