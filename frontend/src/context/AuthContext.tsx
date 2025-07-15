import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { IAuthContext, IDecodedJWT, ILoginResponse, IUser } from '../types';
import { jwtDecode } from 'jwt-decode';
import axiosInstance, { setAuthToken  } from '../api/axiosInstance';
import authService from '../services/auth.service';
import { Spin } from 'antd';

const AuthContext = createContext<IAuthContext | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initAuth = async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await authService.refreshToken(refreshToken);
                    setAuthToken(response.token);
                    const { token } = response;
                    const decodedToken: { sub: string } = jwtDecode(token);
                    setUser({ id: 0, username: decodedToken.sub, phoneNumber: '', registrationDate: '' });
                    setIsAuthenticated(true);
                } catch (error) {
                    localStorage.removeItem('refreshToken');
                    setIsAuthenticated(false);
                    setUser(null);
                    setAuthToken(null);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (data: ILoginResponse) => {
        const { token, refreshToken, username } = data;
        localStorage.setItem('refreshToken', refreshToken);
        setUser({ id: 0, username, phoneNumber: '', registrationDate: '' });
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout failed on server", error);
        } finally {
            localStorage.removeItem('refreshToken');
            setUser(null);
            setIsAuthenticated(false);
            setAuthToken(null);
        }
    };

    const contextValue = {
        isAuthenticated,
        user,
        login,
        logout,
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', marginTop: 200}}>
                <Spin size="large" />
            </div>
        );
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;