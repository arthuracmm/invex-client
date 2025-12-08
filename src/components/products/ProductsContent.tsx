import { useState, useEffect } from "react";
import { Divider, Button } from "@mui/material";
import ProductsTable from "./ProductsTable";
import { Product } from "../../types/Products";
import { ProductService } from "../../service/products/productService";
import AddProductModal from "./AddProductModal";
import AddIcon from '@mui/icons-material/Add';

interface ProductContentProps{
    darkMode:boolean | null
}

export default function ProductContent({darkMode} : ProductContentProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchProducts = async () => {
        try {
            const data = await ProductService.getAll();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="flex h-full flex-col ">
            <div className="flex p-4 px-8 my-5 w-full justify-between items-center ">
                <h1 className={`text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-zinc-700'} `}>Produtos</h1>
                <button
                    className="flex gap-2 bg-lime-500 px-4 p-2 rounded text-white group cursor-pointer shadow "
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <AddIcon />
                    <p className="font-semibold group-hover:font-black transition-all">Adicionar Produto</p>
                </button>
            </div>
            <Divider />
            <ProductsTable products={products} darkMode={darkMode}/>
            <AddProductModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchProducts}
            />
        </div>
    )
}