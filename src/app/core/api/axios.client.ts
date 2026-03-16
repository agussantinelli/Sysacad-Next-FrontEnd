import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { environment } from '@env/environment';

const axiosClient = axios.create({
    baseURL: environment.apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        
        const storedBootId = localStorage.getItem('bootId');
        const serverBootId = response.headers?.['boot-id']; 

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
    (error: AxiosError) => {
        const anyError = error as any;
        if (anyError.code === 'ERR_NETWORK') {
            console.error('Network Error: Connection to backend lost.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('bootId');
            sessionStorage.removeItem('welcomeShown');
            window.location.href = '/login';
        }
        
        if (anyError.response?.headers?.['boot-id']) {
            const storedBootId = localStorage.getItem('bootId');
            const serverBootId = anyError.response.headers['boot-id'];
            if (storedBootId && storedBootId !== serverBootId) {
                console.warn('BootId Mismatch (Error): Server restarted. Logging out.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('bootId');
                window.location.href = '/login';
            }
        }

        if (anyError.response && anyError.response.status === 500) {
            const message = anyError.response.data?.message || 'Error interno del servidor';
            window.dispatchEvent(new CustomEvent('sysacad-error', { detail: message }));
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
