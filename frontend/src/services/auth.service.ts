import axiosInstance from '../api/axiosInstance';
import { ILoginRequest, ILoginResponse, IRegisterRequest, IUser } from '../types';

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

const authService = {
    login,
    register,
};

export default authService;