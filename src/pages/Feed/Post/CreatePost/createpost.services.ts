import axios from "axios"
import { axiosInterceptor } from "../../../../axios-interceptors/axiosinterceptors"
import type { CreatePostResponseType } from "./createpost.interface";


export const createUserPost = async (postData:FormData) => {
    try {
        const response = await axiosInterceptor.post<CreatePostResponseType>(`/posts`, postData);
        return response.data.message
    } catch (error) {
        if (axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data?.message ?? error.message);
        }
        throw new Error(error instanceof Error ? error.message : 'Network Error')
    }
    
}