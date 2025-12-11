import api from "../auth/api";
import { Inventory } from "../../types/Inventory";
import { Movimentation } from "@/src/types/Movimentation";

interface CreateMovimentationDto {
    userId: string;
    productId: string;
    location: string;
    quantity: number | undefined;
}

export const MovimentationService = {
    createEntry: async (data: CreateMovimentationDto): Promise<Movimentation> => {
        const response = await api.post("/movimentations/entry", data);
        return response.data;
    },

    createOutput: async (data: CreateMovimentationDto): Promise<Movimentation> => {
        const response = await api.post("/movimentations/output", data);
        return response.data;
    },

    getAllEntry: async (page: number, pageSize: number) => {
        const response = await api.get(`/movimentations/entry?page=${page}&pageSize=${pageSize}`);
        return response.data;
    },

    getAllOutput: async (page: number, pageSize: number) => {
        const response = await api.get(`/movimentations/output?page=${page}&pageSize=${pageSize}`);
        return response.data;
    },
};
