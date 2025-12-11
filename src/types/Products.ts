import { Inventory } from "./Inventory";

export interface Product {
    id: string;
    shortName: string;
    fullName: string;
    unitMeasure: string;
    quantMin: number | undefined;

    inventories?: Inventory[];
}
