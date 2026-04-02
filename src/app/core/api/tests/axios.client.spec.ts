import axiosClient from '../axios.client';

describe('AxiosClient', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
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
});
