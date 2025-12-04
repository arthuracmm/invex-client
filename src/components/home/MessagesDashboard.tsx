"use client";

import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import { Tooltip } from '@mui/material';
import { useState } from 'react';

export default function MessagesDashboard() {

    const [totalMessages, setTotalMessages] = useState<number>(1453);
    const [repliedMessages, setRepliedMessages] = useState<number>(1094);
    const [unansweredMessages, setUnansweredMessages] = useState<number>(totalMessages - repliedMessages);
    const [messagesSent, setMessagesSent] = useState<number>(1211);

    const calculatePercent = (value: number, total: number) => {
        if (total === 0) return 0;
        return ((value / total) * 100).toFixed(0);
    }

    return (
        <div className="flex flex-1 flex-col items-center gap-8">
            <div className="flex w-full justify-center gap-6">
                <Tooltip title={'Total de mensagens enviadas pelo sistema'} arrow>
                    <div className="flex items-center border border-zinc-300 rounded-xl gap-4 overflow-hidden w-full">
                        <div className="flex bg-emerald-300 h-full aspect-square justify-center items-center">
                            <ChatBubbleIcon sx={{ fontSize: 70 }} />
                        </div>
                        <div className="flex flex-col items-start m-4">
                            <h1 className='font-extrabold text-4xl num-font'>{totalMessages}</h1>
                            <h2 className="font-bold text-sm text-zinc-400">Total de mensagens</h2>
                        </div>
                    </div>
                </Tooltip>

                <Tooltip title={'Total de mensagens respondidas pelos pacientes'} arrow>
                    <div className="flex items-center border border-zinc-300 rounded-xl gap-4 overflow-hidden w-full">
                        <div className="flex bg-emerald-300 h-full aspect-square justify-center items-center">
                            <MarkChatReadIcon sx={{ fontSize: 70 }} />
                        </div>
                        <div className="flex flex-col items-start m-4">
                            <h1 className='font-extrabold text-4xl num-font'>{repliedMessages}<span className='font-light text-2xl'>/{calculatePercent(repliedMessages, totalMessages)}%</span></h1>
                            <h2 className="font-bold text-sm text-zinc-400">Respondidas</h2>
                        </div>
                    </div>
                </Tooltip>

                <Tooltip title={'Total de mensagens não respondidas pelos pacientes'} arrow>
                    <div className="flex items-center border border-zinc-300 rounded-xl gap-4 overflow-hidden w-full">
                        <div className="flex bg-emerald-300 h-full aspect-square justify-center items-center">
                            <SpeakerNotesOffIcon sx={{ fontSize: 70 }} />
                        </div>
                        <div className="flex flex-col items-start m-4">
                            <h1 className='font-extrabold text-4xl num-font'>{unansweredMessages}<span className='font-light text-2xl'>/{calculatePercent(unansweredMessages, totalMessages)}%</span></h1>
                            <h2 className="font-bold text-sm text-zinc-400">Não Respondidas</h2>
                        </div>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}
