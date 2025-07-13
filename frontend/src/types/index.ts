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

export interface ILoginRequest {
    username: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
}

export interface IRegisterRequest {
    username: string;
    password: string;
    phoneNumber: string;
}