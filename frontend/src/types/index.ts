export interface IUser {
    id: number;
    username: string;
    phoneNumber: string;
    registrationDate: string;
}

export interface IAuthContext {
    isAuthenticated: boolean;
    user: IUser | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export interface IDecodedJWT {
    sub: string;
    exp: number;
}