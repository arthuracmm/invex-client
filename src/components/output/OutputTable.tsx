"use client";

import { useState, useEffect } from "react";
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
import { Movimentation } from "@/src/types/Movimentation";
import { Product } from "@/src/types/Products";
import { dateConverter } from "@/src/utils/TextUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Order = "asc" | "desc";

interface OutputTableProps {
    movimentation: Movimentation[];
    darkMode: boolean | null
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number
    pageSize: number
    handleOpenModal: (product: Product) => void;
}

export default function OutputTable({ movimentation, darkMode, currentPage, setCurrentPage, totalPages, pageSize, handleOpenModal}: OutputTableProps) {
    const [orderBy, setOrderBy] = useState<keyof Movimentation | "shortName" | "fullName" | ''>("");
    const [order, setOrder] = useState<Order>("asc");
    const [sortedMovimentations, setSortedMovimentations] = useState<Movimentation[]>([]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    useEffect(() => {
        setSortedMovimentations(movimentation || []);
    }, [movimentation]);

    const handleSort = (property: keyof Movimentation | "shortName" | "fullName") => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedData = [...sortedMovimentations].sort((a, b) => {
        let valueA: any;
        let valueB: any;

        if (orderBy === "shortName") {
            valueA = a.product?.shortName || "";
            valueB = b.product?.shortName || "";
        } else if (orderBy === "fullName") {
            valueA = a.product?.fullName || "";
            valueB = b.product?.fullName || "";
        } else {
            valueA = a[orderBy as keyof Movimentation];
            valueB = b[orderBy as keyof Movimentation];
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
        <div className="flex flex-1 h-full justify-between flex-col gap-4 rounded-xl overflow-hidden overflow-y-auto">
            <TableContainer className="border border-zinc-300 rounded-xl h-full">
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

                            <TableCell sortDirection={orderBy === "user" ? order : false}>
                                <TableSortLabel
                                    active={orderBy === "user"}
                                    direction={orderBy === "user" ? order : "asc"}
                                    onClick={() => handleSort("user")}
                                >
                                    Usuário
                                </TableSortLabel>
                            </TableCell>


                            <TableCell sortDirection={orderBy === "createdAt" ? order : false}>
                                <TableSortLabel
                                    active={orderBy === "createdAt"}
                                    direction={orderBy === "createdAt" ? order : "asc"}
                                    onClick={() => handleSort("createdAt")}
                                >
                                    Criado em
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sortedData.length > 0 ? (
                            sortedData.map((movimentation) => (
                                <TableRow
                                    className="hover:bg-lime-50 transition-colors cursor-pointer"
                                    key={movimentation.id}
                                    onClick={() => handleOpenModal(movimentation.product)}
                                >
                                    <TableCell>
                                        {movimentation.product?.shortName}
                                    </TableCell>
                                    <TableCell>
                                        {movimentation.product?.fullName}
                                    </TableCell>
                                    <TableCell>
                                        {movimentation.quantity}
                                    </TableCell>
                                    <TableCell>
                                        {movimentation.location}
                                    </TableCell>
                                    <TableCell>
                                        {movimentation.user.fullName}
                                    </TableCell>
                                    <TableCell>
                                        {dateConverter(movimentation.createdAt)}
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
            <div className="flex w-full justify-center">
                <div className="flex justify-center items-center gap-2 border border-zinc-300 w-fit rounded-xl overflow-hidden num-font">

                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="p-2 border-r border-zinc-300 hover:bg-lime-500 hover:text-white transition-colors disabled:text-zinc-300 disabled:hover:bg-zinc-200 cursor-pointer disabled:cursor-not-allowed"
                    >
                        <ChevronLeft />
                    </button>

                    <p className="w-16 font-bold text-center ">
                        {currentPage}
                        <span className="font-normal text-zinc-400">/{Math.ceil(totalPages / pageSize)}</span>
                    </p>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(totalPages / pageSize)}
                        className="p-2 border-l border-zinc-300 hover:bg-lime-500 hover:text-white transition-colors disabled:text-zinc-300 disabled:hover:bg-zinc-200 cursor-pointer disabled:cursor-not-allowed"
                    >
                        <ChevronRight />
                    </button>

                </div>
            </div>
        </div>
    );
}