"use client";

import PieChart from "../../ui/PieChart";
import TimerIcon from '@mui/icons-material/Timer';
import Person4Icon from '@mui/icons-material/Person4';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import FactCheckIcon from '@mui/icons-material/FactCheck';

interface PieChartsDashboardsProps {
    refreshKey: number
    darkMode: boolean | null
}


export default function PieChartsDashboards({ refreshKey, darkMode }: PieChartsDashboardsProps) {
    const chartsData = [
        {
            name: 'Total de Produtos',
            icon: <TimerIcon sx={{ fontSize: 30 }} />,
            data: [
                { name: '5 Minutos', value: 1048 },
                { name: '10 Minutos', value: 735 },
                { name: '40+ Minutos', value: 580 },
                { name: '1 Hora', value: 210 },
                { name: '2+ Horas', value: 100 },
            ],
            colors: ['#52E600', '#56BB1F', '#E6D800', '#E68310', '#E62E10'],
        },
        {
            name: 'Tipo de Usuário',
            icon: <Person4Icon sx={{ fontSize: 30 }} />,
            data: [
                { name: 'Admin', value: 150 },
                { name: 'Cliente', value: 800 },
                { name: 'Fornecedor', value: 320 },
                { name: 'Gestor', value: 220 },
                { name: 'Paciente', value: 220 },
            ],
            colors: ['#52E600', '#56BB1F', '#E6D800', '#E68310', '#E62E10'],
        },
        {
            name: 'Status de Tarefas',
            icon: <AutoModeIcon sx={{ fontSize: 30 }} />,
            data: [
                { name: 'Concluídas', value: 400 },
                { name: 'Pendentes', value: 230 },
                { name: 'Andamento', value: 150 },
                { name: 'Atrasadas', value: 50 },
                { name: 'Não realizado', value: 35 }
            ],
            colors: ['#52E600', '#56BB1F', '#E6D800', '#E68310', '#E62E10'],
        },
        {
            name: 'Taxa de presença',
            icon: <FactCheckIcon sx={{ fontSize: 30 }} />,
            data: [
                { name: 'Concluídas', value: 400 },
                { name: 'Pendentes', value: 230 },
                { name: 'Andamento', value: 150 },
                { name: 'Atrasadas', value: 50 },
                { name: 'Não realizado', value: 35 }
            ],
            colors: ['#52E600', '#56BB1F', '#E6D800', '#E68310', '#E62E10'],
        },
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
                        <PieChart name={chart.name} data={chart.data} colors={chart.colors} refreshKey={refreshKey} />
                        <div className="flex flex-wrap space-x-5 items-center justify-center">
                            {chart.data.map((item, index) => (
                                <div className="flex items-center gap-2" key={item.name}>
                                    <div
                                        className="flex w-3 h-3 rounded"
                                        style={{ backgroundColor: chart.colors[index] }}
                                    />
                                    <p className="text-sm num-font">{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
