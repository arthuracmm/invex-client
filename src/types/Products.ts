export interface Product {
    id: string;
    shortName: string;
    fullName: string;
    unitMeasure: string;
    quantMin: number;
    inventories?: Inventory[];
}

export interface Inventory {
    id: string;
    productId: string;
    quantity: number;
    location: string;
}
