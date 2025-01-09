import { API_CONFIG } from '../config.js';
const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.RECORDS}`;

class RecordService {
    async createRecord(recordData) {
        try {
            const response = await fetch(`${API_BASE_URL}/createRecord`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recordData)
            });
            if (!response.ok) throw new Error('Failed to create record');
            return await response.json();
        } catch (error) {
            console.error('Error creating record:', error);
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
