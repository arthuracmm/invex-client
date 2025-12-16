"use client";

import PieChart from "../../ui/PieChart";
import { Dashboard } from "@/src/types/Dashboard";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import OutputIcon from '@mui/icons-material/Output';
import LoginIcon from '@mui/icons-material/Login';

interface PieChartsDashboardsProps {
    refreshKey: number;
    darkMode: boolean | null;
    dashboard: Dashboard | null
}


export default function PieChartsDashboards({ refreshKey, darkMode, dashboard }: PieChartsDashboardsProps) {
    const chartsData = [
        {
            name: 'Maior Quantidade',
            icon: <TrendingUpIcon sx={{ fontSize: 30 }} />,
            data: dashboard?.greater.map((item) => ({
                name: item.product.fullName,
                value: item.totalQuantity,
            })),
            colors: ['#52E600', '#56BB1F', '#E6D800', '#E68310', '#E62E10'],
        },
        {
            name: 'Menor Quantidade',
            icon: <TrendingDownIcon sx={{ fontSize: 30 }} />,
            data: dashboard?.smaller.map((item) => ({
                name: item.product.fullName,
                value: item.totalQuantity,
            })),
            colors: ['#52E600', '#56BB1F', '#E6D800', '#E68310', '#E62E10'],
        },
        {
            name: 'Maior Entrada',
            icon: <LoginIcon sx={{ fontSize: 30 }} />,
            data: dashboard?.topEntry.map((item) => ({
                name: item.product.fullName,
                value: Number(item.total),
            })),
            colors: ['#52E600', '#56BB1F', '#E6D800', '#E68310', '#E62E10'],
        },
        {
            name: 'Maior Saída',
            icon: <OutputIcon sx={{ fontSize: 30 }} />,
            data: dashboard?.topOutput.map((item) => ({
                name: item.product.fullName,
                value: Number(item.total),
            })),
            colors: ['#52E600', '#56BB1F', '#E6D800', '#E68310', '#E62E10'],
        }
    ];

    return (
        <div className="flex flex-1 flex-col items-center gap-8">
            <div className="flex w-full justify-center gap-6 ">
                {chartsData.map((chart, index) => (
                    <div key={index} className={`flex flex-col items-center border ${darkMode ? 'border-zinc-800' : 'border-zinc-300'} rounded-xl w-full pt-4 pb-2 relative transition-colors`}>
                        <div className={`flex absolute left-0 top-0 ${darkMode ? 'bg-lime-700 text-zinc-300' : 'bg-lime-100 text-lime-500'} p-4 rounded-br-xl rounded-tl-xl transition-colors`}>
                            {chart.icon}
                        </div>
                        <h2 className="font-bold text-lg">{chart.name}</h2>

                        <PieChart
                            name={chart.name}
                            data={chart.data ?? []}
                            colors={chart.colors}
                            refreshKey={refreshKey}
                        />

                        <div className="flex flex-wrap space-x-5 items-center justify-center">
                            {chart.data?.map((item, index) => (
                                <div className="flex items-center gap-2" key={item.name || index}>
                                    <div
                                        className="flex w-3 h-3 rounded"
                                        style={{ backgroundColor: chart.colors[index % chart.colors.length] }}
                                    />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
