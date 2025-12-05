import { useState, useEffect } from "react";
import { Divider, Button } from "@mui/material";
import ProductsTable from "./ProductsTable";
import { Product } from "../../types/Products";
import { ProductService } from "../../service/products/productService";
import AddProductModal from "./AddProductModal";
import AddIcon from '@mui/icons-material/Add';

export default function ProductContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
                <h1 className="text-4xl font-extrabold text-zinc-700">Produtos</h1>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddModalOpen(true)}
                    sx={{ backgroundColor: "#65a30d", "&:hover": { backgroundColor: "#84cc16" } }}
                >
                    Adicionar Produto
                </Button>
            </div>
            <Divider />
            <ProductsTable products={products} setSelectedProduct={setSelectedProduct} />
            <AddProductModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchProducts}
            />
        </div>
    )
}