import axios from "axios";
import { axiosInterceptor } from "../../../axios-interceptors/axiosinterceptors";
import type { UserData } from "../../../Context/UserAuthProvider/userAuthProvider.interface";

export const updateUserProfilePicture = async (photoData: FormData): Promise<UserData> => {
    try {
        const response = await axiosInterceptor.put<{ data: { user: UserData } }>(`/users/upload-photo`, photoData);
        return response.data.data.user
    } catch (error) {
        if (axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message ?? error.message);
        }
        throw new Error(error instanceof Error ? error.message : 'Network Error')
    }
    
}