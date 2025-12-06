"use client";

import { useState, useEffect } from "react";
import { Product, Inventory } from "../../types/Products";
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

interface EntryTableProps {
    inventories: Inventory[];
    onSelectProduct: (product: Product) => void;
    darkMode: boolean | null
}

export default function EntryTable({ inventories, onSelectProduct, darkMode }: EntryTableProps) {
    const [orderBy, setOrderBy] = useState<keyof Inventory | "shortName" | "fullName">("shortName");
    const [order, setOrder] = useState<Order>("asc");
    const [sortedInventories, setSortedInventories] = useState<Inventory[]>([]);

    useEffect(() => {
        setSortedInventories(inventories || []);
    }, [inventories]);

    const handleSort = (property: keyof Inventory | "shortName" | "fullName") => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedData = [...sortedInventories].sort((a, b) => {
        let valueA: any;
        let valueB: any;

        if (orderBy === "shortName") {
            valueA = a.product?.shortName || "";
            valueB = b.product?.shortName || "";
        } else if (orderBy === "fullName") {
            valueA = a.product?.fullName || "";
            valueB = b.product?.fullName || "";
        } else {
            valueA = a[orderBy as keyof Inventory];
            valueB = b[orderBy as keyof Inventory];
        }

        if (valueA < valueB) {
            return order === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
            return order === "asc" ? 1 : -1;
        }
        return 0;
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

                            <TableCell sortDirection={orderBy === "quantity" ? order : false}>
                                <TableSortLabel
                                    active={orderBy === "quantity"}
                                    direction={orderBy === "quantity" ? order : "asc"}
                                    onClick={() => handleSort("quantity")}
                                >
                                    Quantidade
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sortDirection={orderBy === "location" ? order : false}>
                                <TableSortLabel
                                    active={orderBy === "location"}
                                    direction={orderBy === "location" ? order : "asc"}
                                    onClick={() => handleSort("location")}
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
                        {sortedData.length > 0 ? (
                            sortedData.map((inventory) => (
                                <TableRow
                                    className="hover:bg-lime-50 transition-colors cursor-pointer"
                                    key={inventory.id}
                                >
                                    <TableCell>
                                        {inventory.product?.shortName}
                                    </TableCell>
                                    <TableCell>
                                        {inventory.product?.fullName}
                                    </TableCell>
                                    <TableCell>
                                        {inventory.quantity}
                                    </TableCell>
                                    <TableCell>
                                        {inventory.location}
                                    </TableCell>

                                    <TableCell onClick={() => inventory.product && onSelectProduct(inventory.product)}>
                                        <Tooltip arrow title={'Adicionar Estoque'}>
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
                                    <Typography color="text.secondary">Nenhum registro de entrada encontrado.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}