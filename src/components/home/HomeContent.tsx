"use client";

import { Divider } from "@mui/material";
import { useState } from 'react';
import DateRangePicker from "../../ui/DateRangePicker";
import PieChartsDashboards from "./PieChartsDashboards";
import MessagesDashboard from "./MessagesDashboard";
import FoulsDashboard from "./FoulsDashboard";

interface HomeContentProps {
    refreshKey: number
    darkMode: boolean | null
}

export default function HomeContent({ refreshKey, darkMode }: HomeContentProps) {

    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    const handleDateChange = (newRange: any) => {
        setDateRange(newRange);
        console.log('Intervalo de datas:', newRange);
    };

    const today = new Date();
    const monthName = today.toLocaleString('pt-BR', { month: 'long' });

    const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();

    return (
        <div className="flex h-full flex-col ">
            <div className="flex w-full md:justify-between items-center justify-center ">
                <h1 className={`hidden md:flex text-4xl p-4 px-10 my-5 font-extrabold ${darkMode ? 'text-white' : 'text-zinc-700'}`}>Dashboards</h1>
                <h1 className={`flex md:hidden text-4xl p-4 px-10 font-extrabold ${darkMode ? 'text-white' : 'text-zinc-700'}`}>Resiarte</h1>
                
                <div className="hidden md:flex h-full w-full items-center justify-end pr-10">
                    <h1 className='font-extrabold text-4xl num-font'>Ultimo mês<span className='font-light text-2xl'>/{formattedMonth}</span></h1>
                </div>
            </div>

            <Divider />
            <div className="hidden md:flex flex-col gap-5 h-full overflow-y-auto overflow-x-hidden pr-3 ml-4  pt-5">
                <MessagesDashboard darkMode={darkMode} />
                <PieChartsDashboards refreshKey={refreshKey} darkMode={darkMode} />
                <FoulsDashboard refreshKey={refreshKey} darkMode={darkMode} />
            </div>

            <div className="flex md:hidden flex-col gap-5 h-full overflow-y-auto overflow-x-hidden m-4 items-center justify-center">
                <img src="images/akin-NR.png" alt="" className="object-center w-[80%] aspect-square" />
                <p className="text-center text-xs text-zinc-500">Selecione um item no menu ao lado para prosseguir.</p>
            </div>
        </div>
    )
}