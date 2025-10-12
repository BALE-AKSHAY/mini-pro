import axios from 'axios';

const api = axios.create({
    baseURL: 'https://mm-library-backend-6juw.vercel.app/api', // Your backend URL
});

// Function to set the auth token for all requests
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
