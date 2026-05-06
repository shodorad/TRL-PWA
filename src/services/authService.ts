import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';
import { LoginUrlConstants } from '../components/common/constants/urlConstants';

export interface LoginPayload {
    email: string;
    password: string;
}

export const loginUser = async (payload: LoginPayload): Promise<any> => {
    try {
        const response = await axiosInstance.post<any>(`${LoginUrlConstants.LOGIN}`, payload);
        return response.data;
    } catch (error: AxiosError | any) {
        throw error.response?.data?.message || "Login failed. Please try again.";
    }
}

export interface GoogleAuthPayload {
    idToken: string;
    intendedRole: string;
}

export const googleAuth = async (payload: GoogleAuthPayload): Promise<any> => {
    try {
        const response = await axiosInstance.post<any>(`${LoginUrlConstants.GOOGLE_AUTH}`, payload);
        return response.data;
    } catch (error: AxiosError | any) {
        throw error.response?.data?.message || "Google sign-in failed. Please try again.";
    }
}
