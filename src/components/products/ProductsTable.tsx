"use client";

import React, { useState, useEffect } from "react";
import { Product } from "../../types/Products";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
    Typography,
} from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import { ChevronRight, Search } from "lucide-react";
import handlePrintPdf from "@/src/utils/HandlePrint";

type Order = "asc" | "desc";

interface ProductsTableProps {
    products: Product[];
    darkMode: boolean | null
    setSelectedId: React.Dispatch<React.SetStateAction<string>>
    pageLimit: number
    setPageLimit: React.Dispatch<React.SetStateAction<number>>
}

export default function ProductsTable({ products, darkMode, setSelectedId, pageLimit, setPageLimit }: ProductsTableProps) {
    const [orderBy, setOrderBy] = useState<keyof Product | "localization" | "quantity">("shortName");
    const [order, setOrder] = useState<Order>("asc");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState("");

    const inputColors = {
        icon: darkMode ? '#a1a1aa' : '#52525b',
        label: darkMode ? '#d4d4d8' : '#3f3f46',
        text: darkMode ? '#e4e4e7' : '#27272a',
        placeholder: darkMode ? '#71717a' : '#a1a1aa',
        border: darkMode ? '#3f3f46' : '#d4d4d8',
        focus: '#22c55e',
    };

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = products?.filter((product) => {
            const matchesName = product.shortName.toLowerCase().includes(lowerSearch) ||
                product.fullName.toLowerCase().includes(lowerSearch);
            const matchesInventory = product.inventories?.some(inv => inv.location.toLowerCase().includes(lowerSearch));

            return matchesName || matchesInventory;
        }) || [];

        setFilteredProducts(filtered);
    }, [products, searchTerm]);

    const handleSort = (property: keyof Product | "localization" | "quantity") => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        let valueA: any;
        let valueB: any;

        if (orderBy === "localization") {
            valueA = a.inventories?.[0]?.location;
            valueB = b.inventories?.[0]?.location;
        } else if (orderBy === "quantity") {
            valueA = a.inventories?.reduce((acc, curr) => acc + curr.quantity, 0) || 0;
            valueB = b.inventories?.reduce((acc, curr) => acc + curr.quantity, 0) || 0;
        } else {
            valueA = a[orderBy as keyof Product];
            valueB = b[orderBy as keyof Product];
        }

        if (valueA == null) return 1;
        if (valueB == null) return -1;

        if (typeof valueA === "number" && typeof valueB === "number") {
            return order === "asc" ? valueA - valueB : valueB - valueA;
        }

        return order === "asc"
            ? String(valueA).toLowerCase().localeCompare(String(valueB).toLowerCase())
            : String(valueB).toLowerCase().localeCompare(String(valueA).toLowerCase());
    });

    return (
        <div className="flex flex-col h-[80vh] rounded-xl overflow-hidden m-4 gap-4">
            <div className="flex w-full p-2 gap-2">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border-shadow-lg border-2 transition-colors w-full ${darkMode
                    ? 'bg-zinc-800  '
                    : 'bg-white border-zinc-200'
                    }`}>
                    <Search className={`h-5 w-5 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou localização..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`flex-1 bg-transparent outline-none text-sm placeholder-zinc-400 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'
                            }`}
                    />
                </div>
                <div className="flex w-50">
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel
                            id="pageLimit-label"
                            sx={{
                                color: inputColors.label,
                                '&.Mui-focused': {
                                    color: inputColors.focus,
                                },
                            }}>Cargo</InputLabel>
                        <Select
                            labelId="pageLimit-label"
                            value={pageLimit}
                            onChange={(e) => setPageLimit(e.target.value)}
                            label="Cargo"
                            sx={{
                                color: inputColors.text,
                                '& ~ .MuiInputLabel-root': {
                                    color: inputColors.label,
                                },
                                '&.Mui-focused ~ .MuiInputLabel-root': {
                                    color: inputColors.focus,
                                },
                                '& .MuiSelect-icon': {
                                    color: inputColors.icon,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: inputColors.border,
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: inputColors.focus,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: inputColors.focus,
                                },
                            }}
                        >
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
                <TableContainer className="flex h-full border border-zinc-200 overflow-y-auto rounded-xl">
                    <Table
                        sx={{
                            '& .MuiTableCell-root': {
                                borderBottom: `1px solid ${darkMode ? '#3f3f46' : '#e4e4e7'
                                    }`,
                            },
                        }}
                        className="h-fit"
                    >
                        <TableHead
                            sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: darkMode ? '#27272a' : '#f5f5f5',
                                zIndex: 1,
                                '& .MuiTableCell-root': {
                                    color: darkMode ? '#d4d4d8' : '#3f3f46',
                                },
                                '& .MuiTableSortLabel-root': {
                                    color: darkMode ? '#d4d4d8' : '#3f3f46',
                                    '&:hover': {
                                        color: darkMode ? '#e4e4e7' : '#27272a',
                                    },
                                    '&.Mui-active': {
                                        color: darkMode ? '#d4d4d8' : '#3f3f46',
                                    },
                                },
                                '& .MuiTableSortLabel-icon': {
                                    color: darkMode ? '#a1a1aa' : '#52525b',
                                },
                                '& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon': {
                                    color: darkMode ? '#d4d4d8' : '#3f3f46',
                                },
                            }}
                        >
                            <TableRow>
                                <TableCell sortDirection={orderBy === "shortName" ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === "shortName"}
                                        direction={orderBy === "shortName" ? order : "asc"}
                                        onClick={() => handleSort("shortName")}
                                    >
                                        Nome Curto
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell sortDirection={orderBy === "fullName" ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === "fullName"}
                                        direction={orderBy === "fullName" ? order : "asc"}
                                        onClick={() => handleSort("fullName")}
                                    >
                                        Nome Completo
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell sortDirection={orderBy === "unitMeasure" ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === "unitMeasure"}
                                        direction={orderBy === "unitMeasure" ? order : "asc"}
                                        onClick={() => handleSort("unitMeasure")}
                                    >
                                        Unidade de Medida
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell sortDirection={orderBy === "quantMin" ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === "quantMin"}
                                        direction={orderBy === "quantMin" ? order : "asc"}
                                        onClick={() => handleSort("quantMin")}
                                    >
                                        Qtd. Mínima
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={orderBy === "localization" ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === "localization"}
                                        direction={orderBy === "localization" ? order : "asc"}
                                        onClick={() => handleSort("localization")}
                                    >
                                        Localização
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={orderBy === "quantity" ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === "quantity"}
                                        direction={orderBy === "quantity" ? order : "asc"}
                                        onClick={() => handleSort("quantity")}
                                    >
                                        Quantidade
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell>
                                    Abrir
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sortedProducts.length > 0 ? (
                                sortedProducts.map((product) => (
                                    <React.Fragment key={product.id}>
                                        <TableRow
                                            className={`${darkMode ? 'hover:bg-lime-900/20' : 'hover:bg-lime-50'} transition-colors cursor-pointer`}
                                        >
                                            <TableCell style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}
                                                onClick={() => setSelectedId(product.id)}
                                            >
                                                {product.shortName}
                                            </TableCell>
                                            <TableCell style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}
                                                onClick={() => setSelectedId(product.id)}
                                            >
                                                {product.fullName}
                                            </TableCell>
                                            <TableCell style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}
                                                onClick={() => setSelectedId(product.id)}
                                            >
                                                {product.unitMeasure}
                                            </TableCell>
                                            <TableCell style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}
                                                onClick={() => setSelectedId(product.id)}
                                            >
                                                {product.quantMin}
                                            </TableCell>
                                            <TableCell style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}
                                                onClick={() => setSelectedId(product.id)}
                                            >
                                                {product?.inventories && product.inventories.length > 0
                                                    ? Array.from(new Set(product.inventories.map(inv => inv.location))).join(", ")
                                                    : null}
                                            </TableCell>
                                            <TableCell style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}
                                                onClick={() => setSelectedId(product.id)}
                                            >
                                                {product.inventories?.reduce((acc, curr) => acc + curr.quantity, 0) || 0}
                                            </TableCell>
                                            <TableCell
                                                style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}
                                                onClick={() => {
                                                    if (selectedProduct === product.id) {
                                                        setSelectedProduct('')
                                                    } else {
                                                        setSelectedProduct(product.id)
                                                    }
                                                }}
                                            >
                                                <div className="flex text-zinc-700  h-8 w-9 rounded-sm items-center justify-center">
                                                    <ChevronRight className={`${selectedProduct === product.id && 'rotate-90'} transition-all ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`} />
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {selectedProduct === product.id && (
                                            <TableRow>
                                                <TableCell colSpan={7} style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}>
                                                    <div className="flex w-full  justify-between items-center">
                                                        <div className="flex flex-col text-xl">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-bold">Quantidade Total :</p>
                                                                <p className="">
                                                                    {product.inventories?.reduce((total, prod) => total + prod.quantity, 0)}
                                                                </p>
                                                            </div>
                                                            {product.inventories?.map((item) => (
                                                                <div className="flex gap-2" key={item.id}>
                                                                    <p className="font-bold">{item.location}</p>
                                                                    <p >{item.quantity}</p>
                                                                </div>
                                                            )
                                                            )}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <img
                                                                src={`/api/barcode?text=${product.id}`}
                                                                alt={`Código de barras de ${product.shortName}`}
                                                                className="h-40"
                                                            />
                                                            <Tooltip arrow title={`Imprimir ${product.fullName}`}>
                                                                <button
                                                                    onClick={() => handlePrintPdf([{ product, quantity: 1 }])}
                                                                    className="bg-lime-500 h-10 w-10 rounded text-white cursor-pointer"
                                                                >
                                                                    <PrintIcon />
                                                                </button>
                                                            </Tooltip>

                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment >
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography color="text.secondary">Nenhum produto encontrado.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}