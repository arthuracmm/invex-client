"use client";

import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import { useState } from 'react';
import PieChart from '../../ui/PieChart';

interface FoulsDashboardProps {
    refreshKey: number
    darkMode:boolean | null
}

export default function FoulsDashboard({ refreshKey,darkMode }: FoulsDashboardProps) {

    const [totalScheduling, setTotalScheduling] = useState<number>(132);
    const [totalPresence, setTotalPresence] = useState<number>(34);
    const [totalFouls, setTotalFouls] = useState<number>(0);
    const [totalRescheduling, setTotalRescheduling] = useState<number>(0);
    const [noInformation, setNoInformation] = useState<number>(totalScheduling - totalPresence - totalFouls - totalRescheduling);

    const chartsData =
    {
        name: 'Distribuição de Faltas',
        icon: <NoMeetingRoomIcon />,
        data: [
            { name: 'Total de agendamentos', value: totalScheduling },
            { name: 'Presenças', value: totalPresence },
            { name: 'Faltas', value: totalFouls },
            { name: 'Reagendamentos', value: totalRescheduling },
            { name: 'Sem Informação', value: noInformation },
        ],
        colors: ['#FF6B6B', '#4ECDC4', '#556270', '#FFD93D', '#6A4C93']
    }


    return (
        <div className="flex flex-1 items-center gap-8 pb-4">
            <div className="grid grid-cols-6 w-full h-full justify-center gap-6 ">
                <div className={`flex items-center border ${darkMode ? 'border-zinc-800' : 'border-zinc-300'} transition-colors rounded-xl gap-4 overflow-hidden w-full justify-center border-l-5 border-b-5 border-l-lime-500 border-b-lime-500 col-span-3`}>
                    <div className="flex flex-col items-center m-4">
                        <h1 className='font-extrabold text-4xl num-font'>{totalScheduling}</h1>
                        <h2 className="font-bold text-sm text-zinc-400">Total de agendamentos</h2>
                    </div>
                </div>

                <div className={`flex items-center border ${darkMode ? 'border-zinc-800' : 'border-zinc-300'} transition-colors rounded-xl gap-4 overflow-hidden w-full justify-center border-l-5 border-b-5 border-l-lime-500 border-b-lime-500 col-span-3`}>
                    <div className="flex flex-col items-center m-4">
                        <h1 className='font-extrabold text-4xl num-font'>{totalPresence}</h1>
                        <h2 className="font-bold text-sm text-zinc-400">Presenças</h2>
                    </div>
                </div>

                <div className={`flex items-center border ${darkMode ? 'border-zinc-800' : 'border-zinc-300'} transition-colors rounded-xl gap-4 overflow-hidden w-full justify-center border-l-5 border-b-5 border-l-lime-500 border-b-lime-500 col-span-2`}>
                    <div className="flex flex-col items-center m-4">
                        <h1 className='font-extrabold text-4xl num-font'>{totalFouls}</h1>
                        <h2 className="font-bold text-sm text-zinc-400">Faltas</h2>
                    </div>
                </div>
                <div className={`flex items-center border ${darkMode ? 'border-zinc-800' : 'border-zinc-300'} transition-colors rounded-xl gap-4 overflow-hidden w-full justify-center border-l-5 border-b-5 border-l-lime-500 border-b-lime-500 col-span-2`}>
                    <div className="flex flex-col items-center m-4">
                        <h1 className='font-extrabold text-4xl num-font'>{totalRescheduling}</h1>
                        <h2 className="font-bold text-sm text-zinc-400">Reagendamentos</h2>
                    </div>
                </div>
                <div className={`flex items-center border ${darkMode ? 'border-zinc-800' : 'border-zinc-300'} transition-colors rounded-xl gap-4 overflow-hidden w-full justify-center border-l-5 border-b-5 border-l-lime-500 border-b-lime-500 col-span-2`}>
                    <div className="flex flex-col items-center m-4">
                        <h1 className='font-extrabold text-4xl num-font'>{noInformation}</h1>
                        <h2 className="font-bold text-sm text-zinc-400">Sem Informação</h2>
                    </div>
                </div>
            </div>
            <div className={`flex flex-col w-[60%] items-center border ${darkMode ? 'border-zinc-800' : 'border-zinc-300'} rounded-xl pt-4 relative`}>
                <div className={`flex absolute left-0 top-0 ${darkMode ? 'bg-lime-700 text-zinc-300' : 'bg-lime-100 text-lime-500'} p-4 rounded-br-xl rounded-tl-xl`}>
                    {chartsData.icon}
                </div>
                <h2 className="font-bold text-lg">{chartsData.name}</h2>
                <div className="flex w-full justify-center gap-10">
                    <PieChart name={chartsData.name} data={chartsData.data} colors={chartsData.colors} refreshKey={refreshKey} />
                    <div className="flex flex-col items-start justify-center">
                        {chartsData.data
                            .filter((item) => item.value > 0)
                            .map((item, index) => (
                                <div className="flex items-center gap-2" key={item.name}>
                                    <div
                                        className="flex w-3 h-3 rounded"
                                        style={{ backgroundColor: chartsData.colors[index] }}
                                    />
                                    <p className="text-sm num-font">{item.name}</p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
