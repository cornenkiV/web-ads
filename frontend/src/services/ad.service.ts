import axiosInstance from '../api/axiosInstance';
import { IAd, Page } from '../types';

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

const adService = {
    getAllAds,
    getAdById
};

export default adService;