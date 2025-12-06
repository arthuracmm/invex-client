"use client";

import { useState, useEffect } from "react";
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
import EditNoteIcon from '@mui/icons-material/EditNote';

type Order = "asc" | "desc";

interface ProductsTableProps {
    products: Product[];
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
    darkMode: boolean | null
}

export default function ProductsTable({ products, setSelectedProduct, darkMode }: ProductsTableProps) {
    const [orderBy, setOrderBy] = useState<keyof Product | "localization">("shortName");
    const [order, setOrder] = useState<Order>("asc");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
        setFilteredProducts(products || []);
    }, [products]);

    const handleSort = (property: keyof Product | "localization") => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const valueA: any = orderBy === "localization" ? a.inventories?.[0]?.location : a[orderBy as keyof Product];
        const valueB: any = orderBy === "localization" ? b.inventories?.[0]?.location : b[orderBy as keyof Product];

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

                            <TableCell>
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sortedProducts.length > 0 ? (
                            sortedProducts.map((product) => (
                                <TableRow
                                    className="hover:bg-lime-50 transition-colors cursor-pointer"
                                    key={product.id}
                                >
                                    <TableCell onClick={() => setSelectedProduct(product)}>
                                        {product.shortName}
                                    </TableCell>
                                    <TableCell onClick={() => setSelectedProduct(product)}>
                                        {product.fullName}
                                    </TableCell>
                                    <TableCell onClick={() => setSelectedProduct(product)}>
                                        {product.unitMeasure}
                                    </TableCell>
                                    <TableCell onClick={() => setSelectedProduct(product)}>
                                        {product.quantMin}
                                    </TableCell>
                                    <TableCell onClick={() => setSelectedProduct(product)}>
                                        {product?.inventories && product.inventories.length > 0 ? (
                                            product.inventories.length === 1 ?
                                                product.inventories[0]?.location :
                                                product.inventories.map((local, index) => (
                                                    local.location +
                                                    (index < (product.inventories?.length || 0) - 1 ? ', ' : '')
                                                )).join('')
                                        ) : null}
                                    </TableCell>
                                    <TableCell onClick={() => setSelectedProduct(product)}>
                                        <Tooltip arrow title={'Editar produto'}>
                                            <div className="flex bg-lime-500 text-white h-8 w-9 rounded-sm items-center justify-center">
                                                <EditNoteIcon sx={{ fontSize: 20 }} />
                                            </div>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
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