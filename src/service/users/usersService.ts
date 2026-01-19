import api from "../auth/api";
import { Users } from "@/src/types/Users";

export const usersService = {
    getAll: async (): Promise<Users[]> => {
        const response = await api.get("/users");
        return response.data;
    },

    getOne: async (id: string): Promise<Users> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    create: async (data: any): Promise<Users> => {
        const response = await api.post("/users", data);
        return response.data;
    },

    update: async (id: string, data: any): Promise<Users> => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    },
};
