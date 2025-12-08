import axios from "axios";
import Cookies from "js-cookie";
import { AuthService } from "./authService";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});

let isRefreshing = false;
let failedRequestsQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

api.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthRoute =
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/refresh");

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await AuthService.refreshToken();

                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                failedRequestsQueue.forEach(({ resolve }) => resolve(newToken));
                failedRequestsQueue = [];

                return api(originalRequest);
            } catch (refreshError) {
                failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
                failedRequestsQueue = [];

                AuthService.logout();
                window.location.href = '/authentication/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;