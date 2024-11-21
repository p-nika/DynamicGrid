import axios from 'axios';

const API_BASE_URL = 'http://localhost:7001/api/User';

export const isAdmin = async (email) => {
    const response = await axios.get(`${API_BASE_URL}/is-admin/${email}`);
    return response.data;
};

export const addUser = async (email) => {
    await axios.post(`${API_BASE_URL}/add-user`, { email: email, accessToTables: [], isAdmin: false});
};

export const getUser = async (email) => {
    const response = await axios.get(`${API_BASE_URL}/get-user/${email}`);
    return response.data;
};