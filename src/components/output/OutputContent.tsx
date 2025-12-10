import { Divider, Button } from "@mui/material";
import { Product } from "../../types/Products";
import { useState, useEffect } from "react";
import { ProductService } from "../../service/products/productService";
import AddIcon from '@mui/icons-material/Add';
import { MovimentationService } from "@/src/service/movimentation/movimentationService";
import { Movimentation } from "@/src/types/Movimentation";
import Loading from "../Loading";
import SubInventoryModal from "./SubInventoryModal";
import OutputTable from "./OutputTable";

interface EntryContentProps {
    darkMode: boolean | null
}

export default function EntryContent({ darkMode }: EntryContentProps) {
    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [movimentation, setMovimentation] = useState<Movimentation[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(20)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [productsData, movimentationEntryData] = await Promise.all([
                ProductService.getAll(),
                MovimentationService.getAllOutput(currentPage, pageSize)
            ]);
            setProducts(productsData);
            setMovimentation(movimentationEntryData.data);
            setTotalPages(movimentationEntryData.total);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 500);
        }
    };

    const [totalPages, setTotalPages] = useState<number>(0)

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);


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
                <h1 className="text-4xl font-extrabold text-zinc-700 ">Saída</h1>
                <button
                    className="flex gap-2 bg-lime-500 px-4 p-2 rounded text-white group cursor-pointer shadow "
                    onClick={() => setIsModalOpen(true)}
                >
                    <AddIcon />
                    <p className="font-semibold group-hover:font-black transition-all">Adicionar Saída</p>
                </button>
            </div>
            <Divider />
            {loading ? <Loading /> : (
                <div className="hidden md:flex h-full p-4">
                    <OutputTable
                        movimentation={movimentation}
                        darkMode={darkMode}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        handleOpenModal={handleOpenModal}
                    />
                </div>
            )}
            <SubInventoryModal
                open={isModalOpen}
                onClose={handleCloseModal}
                product={selectedProduct}
                products={products}
                onSuccess={handleSuccess}
            />
        </div>
    )
}