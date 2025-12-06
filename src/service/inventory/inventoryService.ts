import api from "../auth/api";
import { Inventory } from "../../types/Inventory";

interface CreateInventoryDto {
    productId: string;
    quantity: number;
    location: string;
}

export const InventoryService = {
    create: async (data: CreateInventoryDto): Promise<Inventory> => {
        const response = await api.post("/inventory", data);
        return response.data;
    },

    getAll: async (): Promise<Inventory[]> => {
        const response = await api.get("/inventory");
        return response.data;
    },
};
