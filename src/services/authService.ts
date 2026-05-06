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

export interface LogoutPayload {
    refreshToken: string;
}

export const logoutUser = async (payload: LogoutPayload): Promise<any> => {
    try {
        const response = await axiosInstance.post<any>(`${LoginUrlConstants.LOGOUT}`, payload);
        return response.data;
    } catch (error: AxiosError | any) {
        throw error.response?.data?.message || "Logout failed. Please try again.";
    }
}

export interface RegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    role: string;
}

export const registerUser = async (payload: RegisterPayload): Promise<any> => {
    try {
        const response = await axiosInstance.post<any>(`${LoginUrlConstants.REGISTER}`, payload);
        return response.data;
    } catch (error: AxiosError | any) {
        throw error.response?.data?.message || "Registration failed. Please try again.";
    }
}

export const validateVerificationCode = async (username: string, verificationCode: string): Promise<any> => {
    try {
        const response = await axiosInstance.get<any>(`${LoginUrlConstants.VALIDATE_VERIFICATION_CODE}`, {
            params: { username, verificationCode },
        });
        return response.data;
    } catch (error: AxiosError | any) {
        throw error.response?.data?.message || "Verification failed. Please try again.";
    }
}

export const resendVerificationCode = async (username: string): Promise<any> => {
    try {
        const response = await axiosInstance.get<any>(`${LoginUrlConstants.RESEND_VERIFICATION_CODE}`, {
            params: { username },
        });
        return response.data;
    } catch (error: AxiosError | any) {
        throw error.response?.data?.message || "Could not resend the verification code. Please try again.";
    }
}

export interface GoogleLoginPayload {
    idToken: string;
}

export const googleLogin = async (payload: GoogleLoginPayload): Promise<any> => {
    try {
        const response = await axiosInstance.post<any>(`${LoginUrlConstants.GOOGLE_LOGIN}`, payload);
        return response.data;
    } catch (error: AxiosError | any) {
        throw error.response?.data?.message || "Google sign-in failed. Please try again.";
    }
}

export interface GoogleRegistrationPayload {
    idToken: string;
    intendedRole: string;
    password: string;
}

export const googleRegistration = async (payload: GoogleRegistrationPayload): Promise<any> => {
    try {
        const response = await axiosInstance.post<any>(`${LoginUrlConstants.GOOGLE_REGISTRATION}`, payload);
        return response.data;
    } catch (error: AxiosError | any) {
        throw error.response?.data?.message || "Google registration failed. Please try again.";
    }
}
