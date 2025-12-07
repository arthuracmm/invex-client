import { Divider, Button } from "@mui/material";
import EntryTable from "./EntryTable";
import { Product } from "../../types/Products";
import { useState, useEffect } from "react";
import AddInventoryModal from "./AddInventoryModal";
import { ProductService } from "../../service/products/productService";
import AddIcon from '@mui/icons-material/Add';
import { MovimentationService } from "@/src/service/movimentation/movimentationService";
import { Movimentation } from "@/src/types/Movimentation";
import Loading from "../Loading";
import CameraAltIcon from '@mui/icons-material/CameraAlt';

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
                MovimentationService.getAllEntry(currentPage, pageSize)
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
    if (loading) return < Loading />
    return (
        <div className="flex h-full flex-col ">
            <div className="flex p-4 px-8 my-5 w-full md:justify-between gap-2 justify-center items-center">
                <h1 className="text-4xl font-extrabold text-zinc-700 ">Entrada</h1>
                <button
                    className="hidden md:flex gap-2 bg-lime-500 px-4 p-2 rounded text-white group cursor-pointer shadow "
                    onClick={() => setIsModalOpen(true)}
                >
                    <AddIcon />
                    <p className="font-semibold group-hover:font-black transition-all">Adicionar Entrada</p>
                </button>
            </div>
            <Divider />
            <div className="hidden md:flex">
                <EntryTable
                    movimentation={movimentation}
                    darkMode={darkMode}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    handleOpenModal={handleOpenModal}
                />
            </div>
            <div className="flex md:hidden flex-col gap-2 m-5 flex-1 justify-center items-center">
                <button
                    className="flex  gap-2 bg-lime-500 px-4 p-2 rounded text-white group cursor-pointer shadow w-full justify-center"
                    onClick={() => setIsModalOpen(true)}
                >
                    <AddIcon />
                    <p className="font-semibold group-hover:font-black transition-all">Adicionar Manualmente</p>
                </button>
                <button
                    className="flex gap-2 bg-blue-500 px-4 p-2 rounded text-white group cursor-pointer shadow w-full justify-center"
                    onClick={() => setIsModalOpen(true)}
                >
                    <CameraAltIcon />
                    <p className="font-semibold group-hover:font-black transition-all">Adicionar Pelo Codigo</p>
                </button>
            </div>
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