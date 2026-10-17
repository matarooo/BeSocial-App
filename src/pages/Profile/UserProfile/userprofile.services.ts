import axios from "axios"
import { axiosInterceptor } from "../../../axios-interceptors/axiosinterceptors";
import type { UserProfileResponseType } from "./userprofile.interface";


export const getUsersData = async (userId: string) => {
    try {
        const response = await axiosInterceptor.get<UserProfileResponseType>(`/users/${userId}/profile`);
        return response.data.data.user
    } catch (error) {
        if (axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message);
        }
        throw new Error('Network Error')
    }
    
}