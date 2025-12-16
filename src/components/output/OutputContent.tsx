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
import ShortcutListener from "@/src/ui/ShortcutListener";
import MobileScanner from "../MobileScanner";
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

    const [scannerOpen, setScannerOpen] = useState(false);

    const handleCodeDetected = (code: string) => {
        setScannerOpen(false);
        const product = products.find((p) => p.id === code);
        if (product) {
            handleOpenModal(product);
        } else {
            alert(`Produto não encontrado com este código: ${code}`);
        }
    };


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
            <div className="flex p-4 px-8 md:my-5 w-full md:justify-between gap-2 justify-center items-center">
                <h1 className={`text-4xl font-extrabold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'} `}>Saída</h1>
                <button
                    className="hidden md:flex gap-2 bg-lime-500 px-4 p-2 rounded text-white group cursor-pointer shadow "
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
                    onClick={() => setScannerOpen(true)}
                >
                    <CameraAltIcon />
                    <p className="font-semibold group-hover:font-black transition-all">
                        Adicionar Pelo Codigo
                    </p>
                </button>
            </div>

            {scannerOpen && (
                <MobileScanner
                    onDetected={handleCodeDetected}
                    onClose={() => setScannerOpen(false)}
                />
            )}

            <SubInventoryModal
                open={isModalOpen}
                onClose={handleCloseModal}
                product={selectedProduct}
                products={products}
                onSuccess={handleSuccess}
                darkMode={darkMode}
            />

            <ShortcutListener onShortcut={() => setIsModalOpen(true)} />
        </div>
    )
}