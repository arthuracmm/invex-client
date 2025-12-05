import api from "../auth/api";
import { Product } from "../../types/Products";

export const ProductService = {
    getAll: async (): Promise<Product[]> => {
        const response = await api.get("/product");
        return response.data;
    },

    create: async (data: Omit<Product, "id">): Promise<Product> => {
        const response = await api.post("/product", data);
        return response.data;
    },
};
