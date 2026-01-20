import api from "../auth/api";
import { Product } from "../../types/Products";

export const ProductService = {
    getAll: async (page: number, pageSize: number): Promise<{
        page: number;
        total: number;
        limit: number
        data: Product[];
    }> => {
        const response = await api.get(`/product?page=${page}&pageSize=${pageSize}`);
        return response.data;
    },

    getOne: async (id: string): Promise<Product> => {
        const response = await api.get(`/product/${id}`);
        return response.data;
    },

    update: async (id: string, data: any): Promise<Product> => {
        const response = await api.patch(`/product/${id}`, data);
        return response.data;
    },

    create: async (data: any): Promise<Product> => {
        const response = await api.post("/product", data);
        return response.data;
    },
};
