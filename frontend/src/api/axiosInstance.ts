import axios, { InternalAxiosRequestConfig } from 'axios';
import authService from '../services/auth.service';


const tokenManager = {
    token: null as string | null,
    setToken(token: string | null) {
        this.token = token;
    },
    getToken() {
        return this.token;
    },
};


const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes('/refresh-token')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    return Promise.reject(error);
                }

                const response = await authService.refreshToken(refreshToken);
                const newToken = response.token;

                tokenManager.setToken(newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                console.error("Unable to refresh token:", refreshError);
                localStorage.removeItem('refreshToken');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const setAuthToken = tokenManager.setToken.bind(tokenManager);
export default axiosInstance;