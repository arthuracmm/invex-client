"use client";

import React, { useState, useEffect } from "react";
import { Product } from "../../types/Products";
import {
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
import { ChevronRight } from "lucide-react";
import handlePrintPdf from "@/src/utils/HandlePrint";

type Order = "asc" | "desc";

interface ProductsTableProps {
    products: Product[];
    darkMode: boolean | null
}

export default function ProductsTable({ products, darkMode }: ProductsTableProps) {
    const [orderBy, setOrderBy] = useState<keyof Product | "localization" | "quantity">("shortName");
    const [order, setOrder] = useState<Order>("asc");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>('');

    useEffect(() => {
        setFilteredProducts(products || []);
    }, [products]);

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
        <div className="flex h-full rounded-xl overflow-hidden overflow-y-auto m-4">
            <TableContainer>
                <Table>
                    <TableHead
                        style={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: darkMode ? "#52525b" : "#f5f5f5",
                            zIndex: 1
                        }}
                        sx={darkMode ? {
                            "& .MuiTableCell-root": {
                                color: "gray",
                            },
                            "& .MuiTableSortLabel-root": {
                                color: "white",
                            },
                            "& .MuiTableSortLabel-root:hover": {
                                color: "white",
                            },
                            "& .MuiTableSortLabel-root.Mui-active": {
                                color: "white",
                            },
                            "& .MuiTableSortLabel-icon": {
                                color: "white !important",
                            }
                        } : {}}
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
                                        className="hover:bg-lime-50 transition-colors cursor-pointer"
                                        onClick={() => {
                                            if (selectedProduct === product.id) {
                                                setSelectedProduct('')
                                            } else {
                                                setSelectedProduct(product.id)
                                            }
                                        }}
                                    >
                                        <TableCell className="text-white">{product.shortName}</TableCell>
                                        <TableCell>{product.fullName}</TableCell>
                                        <TableCell>{product.unitMeasure}</TableCell>
                                        <TableCell>{product.quantMin}</TableCell>
                                        <TableCell>
                                            {product?.inventories && product.inventories.length > 0
                                                ? Array.from(new Set(product.inventories.map(inv => inv.location))).join(", ")
                                                : null}
                                        </TableCell>
                                        <TableCell>
                                            {product.inventories?.reduce((acc, curr) => acc + curr.quantity, 0) || 0}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex text-zinc-700  h-8 w-9 rounded-sm items-center justify-center">
                                                <ChevronRight className={`${selectedProduct === product.id && 'rotate-90'} transition-all`} />
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {selectedProduct === product.id && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
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
    );
}