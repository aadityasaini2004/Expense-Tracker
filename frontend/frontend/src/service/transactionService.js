// src/services/transactionService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

// A helper function to get the token from the active Clerk session
const getAuthToken = async () => {
    const clerkSession = window.Clerk.session;
    if (clerkSession) {
        return await clerkSession.getToken();
    }
    return null;
};

// Fetches all transactions for the logged-in user
export const getTransactions = async () => {
    const token = await getAuthToken();
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// Adds a new transaction
export const addTransaction = async (transactionData) => {
    const token = await getAuthToken();
    if (!token) throw new Error("User not authenticated");

    // Make sure date is included, default to now if not present
    const dataToSend = { ...transactionData, date: transactionData.date || new Date() };

    const response = await axios.post(API_URL, dataToSend, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};

// Deletes a transaction
export const deleteTransaction = async (id) => {
    const token = await getAuthToken();
    if (!token) throw new Error("User not authenticated");

    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};
