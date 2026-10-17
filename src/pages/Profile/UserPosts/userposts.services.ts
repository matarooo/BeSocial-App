import axios from "axios"
import { axiosInterceptor } from "../../../axios-interceptors/axiosinterceptors";
import type { UserPostsResponseType } from "./userposts.interface";


export const getUsersPostsData = async (userId: string) => {
    try {
        const response = await axiosInterceptor.get<UserPostsResponseType>(`/users/${userId}/posts`);
        return response.data.data.posts
    } catch (error) {
        if (axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message);
        }
        throw new Error('Network Error')
    }
    
}