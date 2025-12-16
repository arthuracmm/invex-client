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

    const [printReady, setPrintReady] = useState<boolean>(false)
    const [isModalPrintOpen, setIsModalPrintOpen] = useState<boolean>(false)

    const [arrayAddItems, setArrayAddItems] = useState<AddedItem[] | []>([])

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
    }

    const handleSuccess = () => {
        fetchData();
    };
    if (loading) return < Loading />
    return (
        <div className="flex h-full flex-col ">
            <div className="flex p-4 px-8 md:my-5 w-full md:justify-between gap-2 justify-center items-center">
                <h1 className={`text-4xl font-extrabold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'} `}>Entrada</h1>
                <button
                    className="hidden md:flex gap-2 bg-lime-500 px-4 p-2 rounded text-white group cursor-pointer shadow "
                    onClick={() => setIsModalOpen(true)}
                >
                    <AddIcon />
                    <p className="font-semibold group-hover:font-black transition-all">Adicionar Entrada</p>
                </button>
            </div>
            <Divider />
            {loading ? <Loading /> : (
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

            {printReady && (
                <button
                    onClick={() => setIsModalPrintOpen(true)}
                    className="fixed bottom-4 right-4 flex bg-lime-500 hover:bg-lime-600 w-15 h-15 rounded-full items-center justify-center text-white cursor-pointer shadow">
                    <PrintIcon />
                </button>
            )}

            <Modal
                open={isModalPrintOpen}
                onClose={handleClosePrintModal}
                className="flex items-center justify-center text-zinc-700"
            >
                <div className="flex flex-col bg-white shadow-2xl md:w-[50%] md:h-[50%] rounded-2xl outline-none overflow-hidden relative pb-12 md:pb-0 justify-center items-center gap-4">
                    <h1 className="md:text-3xl text-2xl font-bold text-zinc-700">Deseja emitir o PDF agora?</h1>
                    <div className="flex flex-col items-center gap-4">
                        <button
                            className="flex p-2 px-8 gap-2 w-fit bg-lime-500 hover:bg-lime-600 text-white rounded-xl items-center cursor-pointer"
                            onClick={() => {
                                setPrintReady(false)
                                setArrayAddItems([])
                                handlePrintStockPdf(arrayAddItems)
                                handleClosePrintModal
                            }
                            }
                        >
                            <div className="flex rounded-xl border border-white/50 p-2 font-bold">
                                Enter
                            </div>
                            <p className="font-bold">Sim</p>
                        </button>

                        <button
                            className="flex p-2 px-8 gap-2 w-fit bg-zinc-300 hover:bg-zinc-400/60  rounded-xl items-center cursor-pointer"
                            onClick={handleClosePrintModal}
                        >
                            <div className="flex rounded-xl border border-black/20 p-2 font-bold">
                                Esc
                            </div>
                            <p className="font-bold">Continuar Adicionando</p>
                        </button>
                    </div>
                    <ShortcutListener keyTrigger="Enter" onShortcut={() => {
                        setPrintReady(false)
                        setArrayAddItems([])
                        handlePrintStockPdf(arrayAddItems)
                        handleClosePrintModal
                    }} />
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
    )
}