"use client";

import { Chip, Divider, InputAdornment, OutlinedInput } from "@mui/material";
import { useEffect, useState } from 'react';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { NotificationsService } from "@/src/service/notifications/notificationsService";
import { Notifications } from "@/src/types/Notifications";
import Loading from "../Loading";
import { AntSwitch } from "@/src/ui/AntSwitch";
import { dateConverter } from "@/src/utils/TextUtils";

interface NotificationsContentProps {
    darkMode: boolean | null
}

export default function NotificationsContent({ darkMode }: NotificationsContentProps) {

    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(20)

    const [notifications, setNotifications] = useState<Notifications[] | []>([])

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await NotificationsService.getAll(currentPage, pageSize)
            setNotifications(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 500);
        }
    };

    const handleUpdate = async (id: string, read: boolean) => {
        setLoading(true)
        try {
            await NotificationsService.update({
                read: !read
            }, id)
        } catch (error) {
            console.error("Failed to update data", error);
        } finally {
            setTimeout(() => {
                setLoading(false)
                fetchData()
            }, 500);
        }
    }

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);

    return (
        <div className="flex h-full flex-col ">
            <div className="flex w-full md:justify-between items-center justify-center ">
                <h1 className={`hidden md:flex text-4xl p-4 px-10 my-5 font-extrabold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Notificações</h1>
            </div>

            <Divider />

            {loading ? (
                <Loading />
            ) : (
                <div className="flex flex-col m-4 gap-2 overflow-y-auto pr-2">
                    {notifications.map((not) => (
                        <div className={`flex w-full items-center justify-between border ${darkMode ? 'border-zinc-800' : 'border-zinc-200'} p-4 rounded-xl`}>
                            <div className="flex gap-2 items-center">
                                <p className="flex gap-1 font-bold">
                                    {not.message.split(' ')[0]}
                                    <span className="font-normal">
                                        {not.message.split(' ').slice(1).join(' ')}
                                    </span>
                                </p>
                                <Chip label={dateConverter(not.createdAt)} sx={{ backgroundColor: darkMode ? '#3f6212' : '#d9f99d', color: darkMode ? '#e4e4e7' : '#3f3f46' }} />
                            </div>
                            <AntSwitch checked={not.read} onClick={() => handleUpdate(not.id, not.read)} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}