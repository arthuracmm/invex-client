"use client";

import ForestIcon from '@mui/icons-material/Forest';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import { Tooltip } from '@mui/material';

interface MessagesDashboardProps {
    darkMode: boolean | null
}

export default function MessagesDashboard({ darkMode }: MessagesDashboardProps) {
    return (
        <div className="flex flex-1 flex-col items-center gap-8">
            <div className="flex w-full justify-center gap-6">
                <Tooltip title={'Total de mensagens enviadas pelo sistema'} arrow>
                    <div className={`flex items-center border ${darkMode ? 'border-zinc-600' : 'border-zinc-300'} border-zinc-300 rounded-xl gap-4 overflow-hidden w-full`}>
                            <div className={`flex ${darkMode ? 'bg-lime-500' : 'bg-lime-300'} h-full aspect-square justify-center items-center`}>
                            <ForestIcon sx={{ fontSize: 70 }}  />
                        </div>
                        <div className="flex flex-col items-start m-4">
                            <h1 className='font-extrabold text-4xl num-font'>130</h1>
                            <h2 className="font-bold text-sm text-zinc-400">Total de produtos no estoque</h2>
                        </div>
                    </div>
                </Tooltip>

                <Tooltip title={'Total de mensagens respondidas pelos pacientes'} arrow>
                    <div className={`flex items-center border ${darkMode ? 'border-zinc-600' : 'border-zinc-300'} border-zinc-300 rounded-xl gap-4 overflow-hidden w-full`}>
                         <div className={`flex ${darkMode ? 'bg-lime-500' : 'bg-lime-300'} h-full aspect-square justify-center items-center`}>
                            <LowPriorityIcon sx={{ fontSize: 70 }} />
                        </div>
                        <div className="flex flex-col items-start m-4">
                            <h1 className='font-extrabold text-4xl num-font'>10<span className='font-light text-2xl'>/Arruda</span></h1>
                            <h2 className="font-bold text-sm text-zinc-400">Produto com menor quantidade</h2>
                        </div>
                    </div>
                </Tooltip>

                <Tooltip title={'Total de mensagens não respondidas pelos pacientes'} arrow>
                    <div className={`flex items-center border ${darkMode ? 'border-zinc-600' : 'border-zinc-300'} border-zinc-300 rounded-xl gap-4 overflow-hidden w-full`}>
                         <div className={`flex ${darkMode ? 'bg-lime-500' : 'bg-lime-300'} h-full aspect-square justify-center items-center`}>
                            <LowPriorityIcon sx={{ fontSize: 70 }} />
                        </div>
                        <div className="flex flex-col items-start m-4">
                            <h1 className='font-extrabold text-4xl num-font'>10<span className='font-light text-2xl'>/Arruda</span></h1>
                            <h2 className="font-bold text-sm text-zinc-400">Produto com menor quantidade</h2>
                        </div>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}
