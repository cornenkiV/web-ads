import axiosInstance from '../api/axiosInstance';
import { ILoginRequest, ILoginResponse, IRegisterRequest, IUser, ITokenRefreshResponse } from '../types';
import axios from 'axios';

const AUTH_API_URL = '/auth';

const login = async (credentials: ILoginRequest): Promise<ILoginResponse> => {
    try {
        const response = await axiosInstance.post<ILoginResponse>(`${AUTH_API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const register = async (userData: IRegisterRequest): Promise<IUser> => {
    try {
        const response = await axiosInstance.post<IUser>(`${AUTH_API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const refreshToken = async (refreshToken: string): Promise<ITokenRefreshResponse> => {
    const refreshResponse = await axios.post<ITokenRefreshResponse>(
                    `${axiosInstance.defaults.baseURL}/auth/refresh`,
                    { refreshToken }
                );
    return refreshResponse.data;
};

const logout = async (): Promise<void> => {
    await axiosInstance.post('/auth/logout', {});
};

const authService = {
    login,
    register,
    refreshToken,
    logout,
};

export default authService;