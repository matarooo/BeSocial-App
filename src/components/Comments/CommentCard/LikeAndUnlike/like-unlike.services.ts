import axios from "axios"
import { axiosInterceptor } from "../../../../axios-interceptors/axiosinterceptors";
import type { CommentLikeResponseType } from "./like-unlike.interface";

export async function likeAndUnlike(postId:string , commentId:string) {
    try {
        const response = await axiosInterceptor.put<CommentLikeResponseType>(`/posts/${postId}/comments/${commentId}/like`)
        return {
            like: response.data.data.liked,
            likesTotal: response.data.data.likesCount
        }
    } catch (error) {
        if(axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message)

        }
        throw new Error('Network Error');    }
}