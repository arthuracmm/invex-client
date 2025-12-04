"use client";

import { Divider } from "@mui/material";
import { useState } from 'react';
import DateRangePicker from "../../ui/DateRangePicker";
import PieChartsDashboards from "./PieChartsDashboards";
import MessagesDashboard from "./MessagesDashboard";
import FoulsDashboard from "./FoulsDashboard";

interface HomeContentProps {
    refreshKey: number
}

export default function HomeContent({ refreshKey }: HomeContentProps) {

    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    const handleDateChange = (newRange: any) => {
        setDateRange(newRange);
        console.log('Intervalo de datas:', newRange);
    };

    return (
        <div className="flex h-full flex-col ">
            <div className="flex p-4 px-8 my-5 w-full justify-between items-center ">
                <h1 className="text-4xl font-extrabold text-zinc-700">Dashboards</h1>
                <div className="flex">
                    <DateRangePicker onChange={handleDateChange} />
                </div>
            </div>

            <Divider />
            <div className="flex flex-col gap-5 h-full overflow-y-auto overflow-x-hidden pr-3 ml-8 mr-3 pt-5">
                <MessagesDashboard />
                <PieChartsDashboards refreshKey={refreshKey} />
                <FoulsDashboard refreshKey={refreshKey}/>
            </div>
        </div>
    )
}