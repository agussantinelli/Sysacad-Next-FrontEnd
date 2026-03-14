import axiosClient from './axios.client';
import axios from 'axios';

describe('AxiosClient', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        // Spying on window.location.href is tricky in some environments, 
        // but we can check if it would have been called if we mock parts of the logic.
    });

    it('should have correct baseURL', () => {
        expect(axiosClient.defaults.baseURL).toBeDefined();
    });

    it('should add Authorization header if token exists', async () => {
        localStorage.setItem('token', 'test-token');
        
        // We use a internal helper or just inspect the interceptors
        const config: any = { headers: {} };
        const requestInterceptor: any = (axiosClient.interceptors.request as any).handlers[0].fulfilled;
        
        const modifiedConfig = requestInterceptor(config);
        expect(modifiedConfig.headers['Authorization']).toBe('Bearer test-token');
    });

    it('should NOT add Authorization header if token is missing', () => {
        const config: any = { headers: {} };
        const requestInterceptor: any = (axiosClient.interceptors.request as any).handlers[0].fulfilled;
        
        const modifiedConfig = requestInterceptor(config);
        expect(modifiedConfig.headers['Authorization']).toBeUndefined();
    });

    it('should clear storage and redirect if boot-id mismatch occurs', () => {
        localStorage.setItem('bootId', 'old-id');
        localStorage.setItem('token', 'some-token');
        
        // Mock window.location
        const originalLocation = window.location;
        delete (window as any).location;
        (window as any).location = { href: '' };

        const response: any = {
            headers: { 'boot-id': 'new-id' }
        };
        const responseInterceptor: any = (axiosClient.interceptors.response as any).handlers[0].fulfilled;
        
        try {
            responseInterceptor(response);
        } catch (e) {
            // It should reject with 'BootId Mismatch'
        }

        expect(localStorage.getItem('token')).toBeNull();
        expect(window.location.href).toBe('/login');

        // Restore
        (window as any).location = originalLocation;
    });

    it('should handle network errors by clearing storage and redirecting', async () => {
        const originalLocation = window.location;
        delete (window as any).location;
        (window as any).location = { href: '' };

        const error = {
            code: 'ERR_NETWORK',
            config: {}
        };
        const responseErrorInterceptor: any = (axiosClient.interceptors.response as any).handlers[0].rejected;

        try {
            await responseErrorInterceptor(error);
        } catch (e) {
            // expected
        }

        expect(window.location.href).toBe('/login');
        (window as any).location = originalLocation;
    });
});
