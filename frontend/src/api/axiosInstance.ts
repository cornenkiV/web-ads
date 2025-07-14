import axios, { InternalAxiosRequestConfig } from 'axios';
import authService from '../services/auth.service';


let token: string | null = null;

const setToken = (token: string | null) => {
    console.log("Setting a new access token:", token);
    token = token;
}


const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
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

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    return Promise.reject(error);
                }

                const response = await authService.refreshToken(refreshToken);
                const newToken = response.token;

                setToken(newToken);

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

export { setToken };
export default axiosInstance;