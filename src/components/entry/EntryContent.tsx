import { Divider, Modal } from "@mui/material";
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
import MobileScanner from "../MobileScanner";
import ShortcutListener from "@/src/ui/ShortcutListener";
import PrintIcon from '@mui/icons-material/Print';
import handlePrintStockPdf from "@/src/utils/HandlePrint";

interface EntryContentProps {
    darkMode: boolean | null
}

type AddedItem = {
    product: Product;
    quantity: number;
};

export default function EntryContent({ darkMode }: EntryContentProps) {
    const [loading, setLoading] = useState(false);

    const [printReady, setPrintReady] = useState(false);
    const [isModalPrintOpen, setIsModalPrintOpen] = useState(false);

    const [arrayAddItems, setArrayAddItems] = useState<AddedItem[]>([]);

    const [products, setProducts] = useState<Product[]>([]);
    const [movimentation, setMovimentation] = useState<Movimentation[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);

    const [scannerOpen, setScannerOpen] = useState(false);

    const handleCodeDetected = (code: string) => {
        setScannerOpen(false);

        const product = products.find(p => String(p.id) === code);

        if (product) {
            handleOpenModal(product);
        } else {
            alert(`Produto não encontrado com este código: ${code}`);
        }
    };

    const fetchData = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (printReady) {
            setIsModalPrintOpen(true);
        }
    }, [printReady]);

    const handleOpenModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleClosePrintModal = () => {
        setIsModalPrintOpen(false);
    };

    const handleSuccess = () => {
        fetchData();
    };

    if (loading) return <Loading />;

    return (
        <div className="flex h-full flex-col">
            <div className="flex p-4 px-8 md:my-5 w-full md:justify-between gap-2 justify-center items-center">
                <h1 className={`text-4xl font-extrabold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    Entrada
                </h1>

                <button
                    className="hidden md:flex gap-2 bg-lime-500 px-4 p-2 rounded text-white shadow"
                    onClick={() => setIsModalOpen(true)}
                >
                    <AddIcon />
                    <p className="font-semibold">Adicionar Entrada</p>
                </button>
            </div>

            <Divider />

            <div className="hidden md:flex h-full p-4">
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

            {/* Mobile */}
            <div className="flex md:hidden flex-col gap-2 m-5 flex-1 justify-center items-center">
                <button
                    className="flex gap-2 bg-lime-500 px-4 p-2 rounded text-white w-full justify-center"
                    onClick={() => setIsModalOpen(true)}
                >
                    <AddIcon />
                    Adicionar Manualmente
                </button>

                <button
                    className="flex gap-2 bg-blue-500 px-4 p-2 rounded text-white w-full justify-center"
                    onClick={() => setScannerOpen(true)}
                >
                    <CameraAltIcon />
                    Adicionar Pelo Código
                </button>
            </div>

            {printReady && (
                <button
                    onClick={() => setIsModalPrintOpen(true)}
                    className="fixed bottom-4 right-4 bg-lime-500 w-14 h-14 rounded-full flex items-center justify-center text-white shadow"
                >
                    <PrintIcon />
                </button>
            )}

            {/* Modal Print */}
            <Modal open={isModalPrintOpen} onClose={handleClosePrintModal}>
                <div className="flex flex-col bg-white shadow-2xl md:w-[50%] md:h-[50%] rounded-2xl p-6 justify-center items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Deseja emitir o PDF agora?
                    </h1>

                    <button
                        className="bg-lime-500 text-white px-8 py-2 rounded-xl font-bold"
                        onClick={() => {
                            setPrintReady(false);
                            handlePrintStockPdf(arrayAddItems);
                            setArrayAddItems([]);
                            handleClosePrintModal();
                        }}
                    >
                        Sim
                    </button>

                    <button
                        className="bg-zinc-300 px-8 py-2 rounded-xl"
                        onClick={handleClosePrintModal}
                    >
                        Continuar Adicionando
                    </button>

                    <ShortcutListener
                        keyTrigger="Enter"
                        onShortcut={() => {
                            setPrintReady(false);
                            handlePrintStockPdf(arrayAddItems);
                            setArrayAddItems([]);
                            handleClosePrintModal();
                        }}
                    />
                </div>
            </Modal>

            {scannerOpen && (
                <MobileScanner
                    onDetected={handleCodeDetected}
                    onClose={() => setScannerOpen(false)}
                />
            )}

            <AddInventoryModal
                open={isModalOpen}
                onClose={handleCloseAddModal}
                product={selectedProduct}
                products={products}
                printReady={printReady}
                setPrintReady={setPrintReady}
                onSuccess={handleSuccess}
                setArrayAddItems={setArrayAddItems}
                darkMode={darkMode}
            />

            <ShortcutListener onShortcut={() => setIsModalOpen(true)} />
        </div>
    );
}
