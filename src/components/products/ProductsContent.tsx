import { useState, useEffect } from "react";
import { Divider, Button, Pagination } from "@mui/material";
import ProductsTable from "./ProductsTable";
import { Product } from "../../types/Products";
import { ProductService } from "../../service/products/productService";
import AddProductModal from "./AddProductModal";
import AddIcon from '@mui/icons-material/Add';
import ShortcutListener from "@/src/ui/ShortcutListener";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import * as XLSX from "xlsx";

interface ProductContentProps {
    darkMode: boolean | null
}

export default function ProductContent({ darkMode }: ProductContentProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageLimit, setPageLimit] = useState<number>(20);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [selectedId, setSelectedId] = useState<string>('');

    const inputColors = {
        icon: darkMode ? '#a1a1aa' : '#52525b',
        label: darkMode ? '#d4d4d8' : '#3f3f46',
        text: darkMode ? '#e4e4e7' : '#27272a',
        placeholder: darkMode ? '#71717a' : '#a1a1aa',
        border: darkMode ? '#3f3f46' : '#d4d4d8',
        focus: '#22c55e',
    };

    const fetchProducts = async () => {
        try {
            const response = await ProductService.getAll(currentPage, pageLimit);
            setProducts(response.data);
            setTotalPages(Math.ceil(response.total / pageLimit));
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const handleExportSchedules = () => {
        if (!products || products.length === 0) {
            return;
        }

        const formattedData = products.map((product) => ({
            Nome_Curto: product.shortName,
            Nome_Completo: product.fullName,
            Medida: product.unitMeasure,
            Quantidade: product.inventories?.reduce((acc, curr) => acc + curr.quantity, 0) || 0,
            Localizações: product?.inventories && product.inventories.length > 0
                ? Array.from(new Set(product.inventories.map(inv => inv.location))).join(", ")
                : null,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");

        XLSX.writeFile(workbook, `produtos${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="flex h-full flex-col ">
            <div className="flex p-4 px-8 my-5 w-full justify-between items-center ">
                <h1 className={`text-4xl font-extrabold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'} `}>Produtos</h1>
                <div className="flex gap-2 items-center">
                    <button
                        className="flex gap-2 bg-lime-500 px-4 p-2 rounded text-white group cursor-pointer shadow "
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <AddIcon />
                        <p className="font-semibold group-hover:font-black transition-all">Adicionar Produto</p>
                    </button>
                    <button
                        className="flex font-bold bg-zinc-100 items-center rounded-xl p-3 cursor-pointer hover:font-black hover:bg-zinc-200 transition-all"
                        onClick={handleExportSchedules}
                    >
                        <SaveAltIcon />
                    </button>
                </div>
            </div>
            <Divider />
            <ProductsTable
                products={products}
                darkMode={darkMode}
                setSelectedId={setSelectedId}
                pageLimit={pageLimit}
                setPageLimit={setPageLimit}
            />
            <div className="flex w-full justify-center mb-4">
                <Pagination
                    page={currentPage}
                    count={totalPages}
                    onChange={(_, value) => setCurrentPage(value)}
                    variant="outlined"
                    shape="rounded"
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: inputColors.text,
                            borderColor: inputColors.border,
                        },
                        '& .MuiPaginationItem-root:hover': {
                            borderColor: inputColors.focus,
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                            color: inputColors.focus,
                            borderColor: inputColors.focus,
                        },
                        '& .MuiPaginationItem-root.Mui-selected:hover': {
                            borderColor: inputColors.focus,
                        },
                    }}
                />
            </div>
            <AddProductModal
                open={isAddModalOpen || selectedId !== ''}
                onClose={() => {
                    setIsAddModalOpen(false)
                    setSelectedId('')
                }
                }
                onSuccess={fetchProducts}
                darkMode={darkMode}
                selectedId={selectedId}
            />
            <ShortcutListener onShortcut={() => setIsAddModalOpen(true)} />
        </div>
    )
}