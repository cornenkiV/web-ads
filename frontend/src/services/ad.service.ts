import axiosInstance from '../api/axiosInstance';
import { AdCategory, IAd, Page } from '../types';

const API_URL = '/ads';

export interface IAdFilterParams {
    page?: number;
    size?: number;
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    showMineOnly?: boolean;
}

export interface IAdFormData {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: AdCategory;
    city: string;
}

const getAllAds = async (params: IAdFilterParams): Promise<Page<IAd>> => {
    try {
        const response = await axiosInstance.get<Page<IAd>>(API_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch ads:", error);
        throw error;
    }
};

const getAdById = async (id: string): Promise<IAd> => {
    try {
        const response = await axiosInstance.get<IAd>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch ad with id ${id}:`, error);
        throw error;
    }
};

const createAd = async (adData: IAdFormData): Promise<IAd> => {
    try {
        const response = await axiosInstance.post<IAd>(API_URL, adData);
        return response.data;
    } catch (error) {
        console.error(`Failed to create ad:`, error);
        throw error;
    }
};

const updateAd = async (id: string, adData: IAdFormData): Promise<IAd> => {
    try {
        const response = await axiosInstance.put<IAd>(`${API_URL}/${id}`, adData);
        return response.data;
    }catch (error) {
        console.error(`Failed to update ad with id ${id}:`, error);
        throw error;
    }
};

const deleteAd = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Failed to delete ad with id ${id}:`, error);
        throw error;
    }
};

const adService = {
    getAllAds,
    getAdById,
    createAd,
    updateAd,
    deleteAd,
};

export default adService;