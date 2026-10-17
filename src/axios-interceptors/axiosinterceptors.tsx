import axios from "axios";
import { router } from "../AppRouter/AppRouter";

export const axiosInterceptor = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

axiosInterceptor.interceptors.request.use(
    function (request) {
        if(localStorage.getItem('token')) {
            request.headers.token = localStorage.getItem('token');
        }
        return request;
    },
    function(error) {
        return Promise.reject(error);
    }
);

axiosInterceptor.interceptors.response.use(
    function (response) {
        if (response && response.status === 401) {
            localStorage.removeItem('token');
            router.navigate('/login');
        }

        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);