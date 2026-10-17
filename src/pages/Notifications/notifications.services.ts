import axios from "axios"
import { axiosInterceptor } from "../../axios-interceptors/axiosinterceptors";
import type { GetNotificationsResponseType, UnreadCountResponseType } from "./getnotifications.interface";
import type { MarkAllAsReadResponseType, MarkAsReadResponseType } from "./markasread.interface";

export const unreadNotificationsQueryKey = ["unreadNotificationCount"] as const;

export const getNotifications = async () => {
    try {
        const response = await axiosInterceptor.get<GetNotificationsResponseType>(`/notifications?page=1&limit=10`);
        return response.data.data.notifications
    } catch (error) {
        if (axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data?.message ?? error.message);
        }
        throw new Error(error instanceof Error ? error.message : 'Network Error')
    }
    
}
export const getUnreadNotifications = async () => {
    try {
        const response = await axiosInterceptor.get<UnreadCountResponseType>(`/notifications/unread-count`);
        return response.data.data.unreadCount
    } catch (error) {
        if (axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data?.message ?? error.message);
        }
        throw new Error(error instanceof Error ? error.message : 'Network Error')
    }
    
}
export const patchNotificationAsRead = async (notificationId:string) => {
    try {
        const response = await axiosInterceptor.patch<MarkAsReadResponseType>(`/notifications/${notificationId}/read`);
        return response.data.data.notification
    } catch (error) {
        if (axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data?.message ?? error.message);
        }
        throw new Error(error instanceof Error ? error.message : 'Network Error')
    }
    
}
export const patchNotificationAllAsRead = async () => {
    try {
        const response = await axiosInterceptor.patch<MarkAllAsReadResponseType>(`/notifications/read-all`);
        return response.data.data.modifiedCount
    } catch (error) {
        if (axios.isAxiosError<{message:string}>(error)){
            throw new Error(error.response?.data?.message ?? error.message);
        }
        throw new Error(error instanceof Error ? error.message : 'Network Error')
    }
    
}
