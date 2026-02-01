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
        // BootId Validation
        const storedBootId = localStorage.getItem('bootId');
        const serverBootId = response.headers['boot-id']; // Check header

        if (storedBootId && serverBootId && storedBootId !== serverBootId) {
            console.warn('BootId Mismatch: Server restarted. Logging out.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('bootId');
            sessionStorage.removeItem('welcomeShown');
            window.location.href = '/login';
            return Promise.reject('BootId Mismatch');
        }
        return response;
    },
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error: Connection to backend lost.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('bootId');
            sessionStorage.removeItem('welcomeShown');
            window.location.href = '/login';
        }
        // Also check header on error response if available
        if (error.response?.headers?.['boot-id']) {
            const storedBootId = localStorage.getItem('bootId');
            const serverBootId = error.response.headers['boot-id'];
            if (storedBootId && storedBootId !== serverBootId) {
                console.warn('BootId Mismatch (Error): Server restarted. Logging out.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('bootId');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
