import { Notifications } from "@/src/types/Notifications";
import api from "../auth/api";

interface updateNotificationDto {
    read: boolean;
}
export const NotificationsService = {

    getAll: async (page: number, pageSize: number) => {
        const response = await api.get(`/notifications?page=${page}&pageSize=${pageSize}`);
        return response.data;
    },

    update: async (data: updateNotificationDto, id: string) => {
        const response = await api.patch(`notifications/${id}`, data);
        return response.data;
    },

    hasNotification: async () => {
        const response = await api.get('notifications/noRead');
        return response.data;
    },
};
