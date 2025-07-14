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

export enum AdCategory {
    CLOTHING = 'CLOTHING',
    TOOLS = 'TOOLS',
    SPORTS = 'SPORTS',
    ACCESSORIES = 'ACCESSORIES',
    FURNITURE = 'FURNITURE',
    PETS = 'PETS',
    GAMES = 'GAMES',
    BOOKS = 'BOOKS',
    TECHNOLOGY = 'TECHNOLOGY',
}

export interface IAd {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: AdCategory;
    city: string;
    postDate: string;
    seller: ISeller;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export interface ISeller {
    id: number;
    username: string;
    phoneNumber: string;
    registrationDate: string;
}