import axios from 'axios';
import { environment } from '@env/environment';

const axiosClient = axios.create({
    baseURL: environment.apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error: Connection to backend lost.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('welcomeShown');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
