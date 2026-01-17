"use client";

import { Divider } from "@mui/material";
import { useEffect, useState } from 'react';
import PieChartsDashboards from "./PieChartsDashboards";
import MessagesDashboard from "./MessagesDashboard";
import { InventoryService } from "@/src/service/inventory/inventoryService";
import { Dashboard } from "@/src/types/Dashboard";
import Loading from "../Loading";

interface HomeContentProps {
    refreshKey: number
    darkMode: boolean | null
}

export default function HomeContent({ refreshKey, darkMode }: HomeContentProps) {
    const [loading, setLoading] = useState(false);
    const [dashboard, setDashboard] = useState<Dashboard | null>(null)

    const fetchData = async () => {
        setLoading(true);
        try {
            const dashboardData = await InventoryService.dashboard();

            setDashboard(dashboardData);
            console.log(dashboardData)
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [formattedMonth, setFormattedMonth] = useState("");

    useEffect(() => {
        const today = new Date();
        const monthName = today.toLocaleString('pt-BR', { month: 'long' });
        setFormattedMonth(monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase());
    }, []);

    return (
        <div className="flex h-full flex-col ">
            <div className="flex w-full md:justify-between items-center justify-center ">
                <h1 className={`hidden md:flex text-4xl p-4 px-10 my-5 font-extrabold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Dashboards</h1>
                <h1 className={`flex md:hidden text-4xl p-4 px-10 font-extrabold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Resiarte</h1>

                <div className="hidden md:flex h-full w-full items-center justify-end pr-10">
                    <h1 className='font-extrabold text-4xl num-font'>Ultimo mês<span className='font-light text-2xl'>/{formattedMonth}</span></h1>
                </div>
            </div>

            <Divider />
            <div className="hidden md:flex flex-col gap-5 overflow-y-auto overflow-x-hidden pr-3 ml-4  pt-5">
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <MessagesDashboard dashboard={dashboard} darkMode={darkMode} />
                        <PieChartsDashboards dashboard={dashboard} refreshKey={refreshKey} darkMode={darkMode} />
                    </>
                )}
            </div>

            <div className="flex md:hidden flex-col gap-5 h-full overflow-y-auto overflow-x-hidden m-4 items-center justify-center">
                <img src="images/akin-NR.png" alt="" className="object-center w-[80%] aspect-square" />
                <p className="text-center text-xs text-zinc-500">Selecione um item no menu ao lado para prosseguir.</p>
            </div>
        </div>
    )
}