import { useState, useEffect } from "react";
import { Divider } from "@mui/material";
import ProductsTable from "./ProductsTable";
import { Product } from "../../types/Products";
import { ProductService } from "../../service/products/productService";

export default function ProductContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await ProductService.getAll();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="flex h-full flex-col ">
            <div className="flex p-4 px-8 my-5 w-full justify-between items-center ">
                <h1 className="text-4xl font-extrabold text-zinc-700">Produtos</h1>
            </div>
            <Divider />
            <ProductsTable products={products} setSelectedProduct={setSelectedProduct} />
        </div>
    )
}