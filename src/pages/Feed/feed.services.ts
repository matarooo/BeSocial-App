import { axiosInterceptor } from "../../axios-interceptors/axiosinterceptors"
import type { DeletePostResponseType } from "./deletepost.interface"
import type { HomeFeedResponseType, Post } from "./feed.interface"
import type { GetSavedPostsResponseType } from "./savedPosts.interface"
import type { SavePost, SavePostResponseType } from "./savepost.interface"
import type { SharePostRequestData, SharedPostResponseType } from "./sharepost.interface"
import type { UpdatePostResponseType } from "./updatepost.interface"

type FeedPage = {
        posts: Post[]
        meta: {
                pagination: {
                        currentPage: number
                        numberOfPages: number
                        nextPage: number
                }
        }
}

export const getSinglePost = async (postId:string): Promise<FeedPage> => {
        const response = await axiosInterceptor.get<HomeFeedResponseType>(`/posts/${postId}`)

        return {
                posts: response.data.data.posts,
                meta: response.data.meta,
        }
}
export const getHomeFeed = async (page: number): Promise<FeedPage> => {
        const response = await axiosInterceptor.get<HomeFeedResponseType>(`/posts/feed?only=following&page=${page}&limit=10`)

        return {
                posts: response.data.data.posts,
                meta: response.data.meta,
        }
}
export const getAllPosts = async (page: number): Promise<FeedPage> => {
        const response = await axiosInterceptor.get<HomeFeedResponseType>(`/posts?page=${page}&limit=10`)

        return {
                posts: response.data.data.posts,
                meta: response.data.meta,
        }
}
export const deletePost = async (postId:string): Promise<DeletePostResponseType> => {
        const response = await axiosInterceptor.delete<DeletePostResponseType>(`/posts/${postId}`)

        return response.data
}
export const updatePost = async (postId: string, postData: FormData): Promise<UpdatePostResponseType> => {
        const response = await axiosInterceptor.put<UpdatePostResponseType>(`/posts/${postId}`, postData)

        return response.data
}
export const savePost = async (postId: string): Promise<SavePost> => {
        const response = await axiosInterceptor.put<SavePostResponseType>(`/posts/${postId}/bookmark`)

        return response.data.data
}
export const sharePost = async (postId: string, data: SharePostRequestData): Promise<SharedPostResponseType> => {
        const response = await axiosInterceptor.post<SharedPostResponseType>(`/posts/${postId}/share`, data)

        return response.data
}
export const getSavedPosts = async (page: number): Promise<FeedPage> => {
        const response = await axiosInterceptor.get<GetSavedPostsResponseType>(`/users/bookmarks?page=${page}&limit=10`)
        const { currentPage, numberOfPages } = response.data.meta.pagination

        return {
                posts: response.data.data.bookmarks,
                meta: {
                        pagination: {
                                currentPage,
                                numberOfPages,
                                nextPage: currentPage + 1,
                        },
                },
        }
}