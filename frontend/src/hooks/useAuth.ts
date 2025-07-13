import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { IAuthContext } from '../types';

export const useAuth = (): IAuthContext => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};