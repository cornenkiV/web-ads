import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { IAuthContext, IDecodedJWT, IUser } from '../types';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext<IAuthContext | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            try {
                const decodedToken: IDecodedJWT = jwtDecode(token);

                if (decodedToken.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setUser({ id: 0, username: decodedToken.sub, phoneNumber: '', registrationDate: '' }); 
                    localStorage.setItem('token', token);
                }
            } catch (error) {
                console.error("Invalid token: ", error);
                logout();
            }
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const login = (newToken: string) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    const contextValue = {
        isAuthenticated: !!token,
        user,
        token,
        login,
        logout,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;