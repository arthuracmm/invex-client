import { Product } from "./Products";

export interface Movimentation {
    id: string;
    type: string;
    location: string;
    quantity: string;
    createdAt: string;
    user: {
        fullName: string
    }
    product: Product
}