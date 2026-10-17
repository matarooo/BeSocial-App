import axios from "axios"
import { axiosInterceptor } from "../../../axios-interceptors/axiosinterceptors"
import type { ReplyToCommentResponseType } from "./replies.interface"
import type { AddReplyResponseType } from "./addreply.interface"

export async function getAllReplies(postId:string , commentId:string) {
    try {
        const response = await axiosInterceptor.get<ReplyToCommentResponseType>(`/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`)
        return response.data.data.replies
    } catch (error) {
        if(axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message)

        }
        throw new Error('Network Error');    }
}

export async function postReply(postId:string , commentId:string, data:FormData) {
    try {
        const response = await axiosInterceptor.post<AddReplyResponseType>(`/posts/${postId}/comments/${commentId}/replies`,data)
        return response.data.data.reply
    } catch (error) {
        if(axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message)

        }
        throw new Error('Network Error');    }
}

export async function deleteReply(postId:string , commentId:string) {
    try {
        const response = await axiosInterceptor.delete(`/posts/${postId}/comments/${commentId}`)
        return response.data.message
    } catch (error) {
        if(axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message)

        }
        throw new Error('Network Error');    }
}
export async function updateReply(postId:string , commentId:string, data:FormData) {
    try {
        const response = await axiosInterceptor.put(`/posts/${postId}/comments/${commentId}`, data)
        return response.data.data.reply
    } catch (error) {
        if(axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message)

        }
        throw new Error('Network Error');    }
}
