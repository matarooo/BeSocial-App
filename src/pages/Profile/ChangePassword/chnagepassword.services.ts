import axios from "axios"
import { axiosInterceptor } from "../../../axios-interceptors/axiosinterceptors";

export interface ChangePasswordData {
    currentPassword: string
    newPassword: string
}

export const patchPassword = async (data: ChangePasswordData): Promise<string> => {
    try {
        const response = await axiosInterceptor.patch<{ message: string }>(`/users/change-password`, {
            password: data.currentPassword,
            newPassword: data.newPassword,
        });
        return response.data.message
    } catch (error) {
        if (axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message ?? error.message);
        }
        throw new Error(error instanceof Error ? error.message : 'Network Error')
    }
    
}