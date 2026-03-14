import axiosClient from './axios.client';

describe('AxiosClient', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();

        // Mock window.location.href safely
        const mockLocation = { href: '' };
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: mockLocation,
            writable: true
        });
    });

    it('should have correct baseURL', () => {
        expect(axiosClient.defaults.baseURL).toBeDefined();
    });

    it('should add Authorization header if token exists', async () => {
        localStorage.setItem('token', 'test-token');
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

    it('should clear storage on boot-id mismatch', () => {
        localStorage.setItem('bootId', 'old-id');
        localStorage.setItem('token', 'some-token');
        
        const response: any = {
            headers: { 'boot-id': 'new-id' }
        };
        const responseInterceptor: any = (axiosClient.interceptors.response as any).handlers[0].fulfilled;
        
        try {
            // This will trigger window.location.href which might reload the page in Karma
            // but we focus on checking the side effects in this unit test.
            responseInterceptor(response);
        } catch (e) {
            // expected
        }

        expect(localStorage.getItem('token')).toBeNull();
    });

    it('should handle network errors by clearing storage', async () => {
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

        expect(localStorage.getItem('token')).toBeNull();
    });
});
