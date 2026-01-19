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
import { Product } from "@/src/types/Products";
import { dateConverter } from "@/src/utils/TextUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Users } from "@/src/types/Users";
import { AntSwitch } from "@/src/ui/AntSwitch";

type Order = "asc" | "desc";

interface UsersTableProps {
    users: Users[];
    darkMode: boolean | null
    setSelectedUser: React.Dispatch<React.SetStateAction<Users | null>>
}

export default function UsersTable({ users, darkMode, setSelectedUser }: UsersTableProps) {
    const [orderBy, setOrderBy] = useState<keyof Users | ''>("");
    const [order, setOrder] = useState<Order>("asc");
    const [sortedUsers, setSortedUsers] = useState<Users[]>([]);

    useEffect(() => {
        setSortedUsers(users || []);
    }, [users]);

    const handleSort = (property: keyof Users) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedData = [...sortedUsers].sort((a, b) => {
        let valueA: any;
        let valueB: any;

        valueA = a[orderBy as keyof Users];
        valueB = b[orderBy as keyof Users];

        if (valueA < valueB) {
            return order === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
            return order === "asc" ? 1 : -1;
        }
        return 0;
    });

    const translateRole = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Administrador'
            case 'user':
                return 'Usuario'
            default:
                return role
        }
    }

    return (
        <div className="flex m-4 flex-1 h-[80vh] justify-between flex-col gap-4 rounded-xl overflow-hidden overflow-y-auto">
            <TableContainer className={`border ${darkMode ? 'border-zinc-800' : 'border-zinc-300 '} rounded-xl h-full`}>
                <Table
                    sx={{
                        '& .MuiTableCell-root': {
                            borderBottom: `1px solid ${darkMode ? '#3f3f46' : '#e4e4e7'
                                }`,
                        },
                    }}
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
                            <TableCell sortDirection={orderBy === "fullName" ? order : false}>
                                <TableSortLabel
                                    active={orderBy === "fullName"}
                                    direction={orderBy === "fullName" ? order : "asc"}
                                    onClick={() => handleSort("fullName")}
                                >
                                    Nome Completo
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sortDirection={orderBy === "email" ? order : false}>
                                <TableSortLabel
                                    active={orderBy === "email"}
                                    direction={orderBy === "email" ? order : "asc"}
                                    onClick={() => handleSort("email")}
                                >
                                    Email
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sortDirection={orderBy === "role" ? order : false}>
                                <TableSortLabel
                                    active={orderBy === "role"}
                                    direction={orderBy === "role" ? order : "asc"}
                                    onClick={() => handleSort("role")}
                                >
                                    Cargo
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sortDirection={orderBy === "isActive" ? order : false}>
                                <TableSortLabel
                                    active={orderBy === "isActive"}
                                    direction={orderBy === "isActive" ? order : "asc"}
                                    onClick={() => handleSort("isActive")}
                                >
                                    Ativo
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
                            sortedData.map((user) => (
                                <TableRow
                                    className={`${darkMode ? 'hover:bg-lime-900/20' : 'hover:bg-lime-50'} transition-colors cursor-pointer`}
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <TableCell style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}>
                                        {user.fullName}
                                    </TableCell>
                                    <TableCell style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}>
                                        {user.email}
                                    </TableCell>
                                    <TableCell style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}>
                                        {translateRole(user.role)}
                                    </TableCell>
                                    <TableCell style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}>
                                        <AntSwitch checked={user.isActive} />
                                    </TableCell>
                                    <TableCell style={{ color: darkMode ? '#d4d4d8' : '#3f3f46' }}>
                                        {new Date(user.createdAt).toLocaleString('pt-BR')}
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
        </div >
    );
}