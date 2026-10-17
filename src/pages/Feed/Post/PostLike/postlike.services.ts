import axios from "axios"
import { axiosInterceptor } from "../../../../axios-interceptors/axiosinterceptors"
import type { PostLikeResponseType } from "./postlike.interface"


export const postLike = async (postId: string) => {
    try {
        const response = await axiosInterceptor.put<PostLikeResponseType>(`/posts/${postId}/like`);
        return {
            like: response.data.data.liked,
            likesTotal: response.data.data.likesCount,
        }
    } catch (error) {
        if (axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message);
        }
        throw new Error('Network Error')
    }
    
}