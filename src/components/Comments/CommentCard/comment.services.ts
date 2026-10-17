import axios from "axios"
import { axiosInterceptor } from "../../../axios-interceptors/axiosinterceptors"
import type { AllCommentResponseType } from "./comment.interface"
import type { AddCommentResponseType } from "./addcomment.interface"
import type { DeleteCommentResponseType } from "./deletecomment.interface"
import type { UpdateCommentResponseType } from "./updatecomment.interface"

export async function getAllComments(postId:string) {
    try {
        const response = await axiosInterceptor.get<AllCommentResponseType>(`/posts/${postId}/comments?page=1&limit=10`)
        return {
            comments: response.data.data.comments,
            total: response.data.meta.pagination.total,
        }
    } catch (error) {
        if(axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message)

        }
        throw new Error('Network Error');    }
}


export async function postComments(postId:string , data:FormData) {
    try {
        const response = await axiosInterceptor.post<AddCommentResponseType>(`/posts/${postId}/comments`, data)
        return response.data.data.comment

    } catch (error) {
        if(axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message)

        }
        throw new Error('Network Error');    }
}

export async function deleteComments(postId:string , commentId:string) {
    try {
        const response = await axiosInterceptor.delete<DeleteCommentResponseType>(`/posts/${postId}/comments/${commentId}`)
        return response.data.message

    } catch (error) {
        if(axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message)

        }
        throw new Error('Network Error');    }
}


export async function UpdateComments(postId:string , commentId:string, data: FormData) {
    try {
        const response = await axiosInterceptor.put<UpdateCommentResponseType>(
            `/posts/${postId}/comments/${commentId}`,
            data,
        )
        return response.data.data.comment

    } catch (error) {
        if(axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data.message)

        }
        throw new Error('Network Error');    }
}