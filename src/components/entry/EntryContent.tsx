import { Divider, Button } from "@mui/material";
import EntryTable from "./EntryTable";
import { Product, Inventory } from "../../types/Products";
import { useState, useEffect } from "react";
import AddInventoryModal from "./AddInventoryModal";
import { ProductService } from "../../service/products/productService";
import { InventoryService } from "../../service/inventory/inventoryService";
import AddIcon from '@mui/icons-material/Add';

interface EntryContentProps {
    darkMode: boolean | null
}

export default function EntryContent({ darkMode }: EntryContentProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [productsData, inventoriesData] = await Promise.all([
                ProductService.getAll(),
                InventoryService.getAll()
            ]);
            setProducts(productsData);
            setInventories(inventoriesData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSuccess = () => {
        fetchData();
    };

    return (
        <div className="flex h-full flex-col ">
            <div className="flex p-4 px-8 my-5 w-full justify-between items-center ">
                <h1 className="text-4xl font-extrabold text-zinc-700 ">Entrada</h1>
               <button
                    className="flex gap-2 bg-lime-500 px-4 p-2 rounded text-white group cursor-pointer shadow "
                    onClick={() => setIsModalOpen(true)}
                >
                    <AddIcon />
                    <p className="font-semibold group-hover:font-black transition-all">Adicionar Entrada</p>
                </button>
            </div>
            <Divider />
            <EntryTable
                inventories={inventories}
                onSelectProduct={handleOpenModal}
                darkMode={darkMode}
            />
            <AddInventoryModal
                open={isModalOpen}
                onClose={handleCloseModal}
                product={selectedProduct}
                products={products}
                onSuccess={handleSuccess}
            />
        </div>
    )
}