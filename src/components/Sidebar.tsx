"use client";

import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import TokenIcon from '@mui/icons-material/Token';
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TaskIcon from '@mui/icons-material/Task';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';

import { Divider, Tooltip } from '@mui/material';
import { ChevronRight, Router } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Automations } from '@/types/EstablishmentData';
import Cookies from "js-cookie";

import axios from 'axios';

interface SidebarProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    sidebarOpen: boolean | null;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    module: string;
    setModule: React.Dispatch<React.SetStateAction<string>>;
    setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

export default function Sidebar({ activeTab, setActiveTab, setTitle, module, setModule, setRefreshKey, sidebarOpen, setSidebarOpen }: SidebarProps) {
    useEffect(() => {
        const savedState = localStorage.getItem("sidebarOpen");
        if (savedState !== null) {
            setSidebarOpen(savedState === "true");
        }
    }, []);

    useEffect(() => {
        if (sidebarOpen !== null) {
            localStorage.setItem("sidebarOpen", sidebarOpen.toString());
        }
    }, [sidebarOpen]);

    const [automationsData, setAutomations] = useState<Automations[] | null>(null)

    const router = useRouter();
    const { user } = useAuth()

    const fetchAutomations = async () => {
        if (!user) return null
        const token = Cookies.get("token");
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/establishment/${user?.establishment.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            console.log(response.data.automations)
            setAutomations(response.data.automations);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user?.establishment) fetchAutomations();
    }, [user?.establishment]);

    const items = [
        {
            type: 'item',
            name: 'Home',
            title: 'Pagina Inicial',
            label: 'home',
            icon: <HomeIcon />,
            iconOutlined: <HomeOutlinedIcon />
        },
        {
            type: 'module',
            name: 'Agendamento',
            label: 'schedule',
            icon: <WatchLaterIcon />,
            iconOutlined: <WatchLaterOutlinedIcon />,
            children: [
                {
                    name: 'Agendamentos',
                    title: 'Gestão dos agendamentos dos pacientes',
                    label: 'schedulings',
                    icon: <MoreTimeIcon />,
                    iconOutlined: <MoreTimeIcon />
                },
                {
                    name: 'Calendário',
                    title: 'Gestão de agenda dos profissionais',
                    label: 'calendar',
                    icon: <CalendarMonthIcon />,
                    iconOutlined: <CalendarMonthOutlinedIcon />
                }
            ]
        },
        {
            type: 'module',
            name: 'Gestão',
            label: 'management',
            icon: <TokenIcon />,
            iconOutlined: <TokenOutlinedIcon />,
            children: [
                {
                    name: 'Credenciais Automações',
                    title: 'Gestão das credenciais do estabelecimento',
                    label: 'credentials',
                    icon: <SettingsSuggestIcon />,
                    iconOutlined: <SettingsSuggestOutlinedIcon />
                },
                {
                    name: 'Usuários',
                    title: 'Gestão dos usuários',
                    label: 'users',
                    icon: <PeopleAltIcon />,
                    iconOutlined: <PeopleAltOutlinedIcon />
                }
            ]
        },
        ...(automationsData?.some(item => item.name === 'agenda-siresp') ? [{
            type: 'module',
            name: 'SIRESP',
            label: 'agenda-siresp',
            icon: <ViewAgendaIcon />,
            iconOutlined: <ViewAgendaOutlinedIcon />,
            children: [
                {
                    name: 'Agendamento Tarefas',
                    title: 'Agenda geral dos pacientes SIRESP',
                    label: 'general-siresp',
                    icon: <EventNoteIcon />,
                    iconOutlined: <EventNoteOutlinedIcon />
                },
                {
                    name: 'Dados Tarefas',
                    title: 'Dados das tarefas SIRESP',
                    label: 'task-data-siresp',
                    icon: <TaskIcon />,
                    iconOutlined: <TaskOutlinedIcon />
                },
            ]
        }] : []),
        ...(automationsData?.some(item => item.name === 'agenda-ame') ? [{
            type: 'module',
            name: 'AME',
            label: 'agenda-ame',
            icon: <ViewAgendaIcon />,
            iconOutlined: <ViewAgendaOutlinedIcon />,
            children: [
                {
                    name: 'Agendamento Tarefas',
                    title: 'Agenda geral dos pacientes AME',
                    label: 'general-ame',
                    icon: <EventNoteIcon />,
                    iconOutlined: <EventNoteOutlinedIcon />
                }
            ]
        }] : [])
    ]


    return (
        <div className={`flex flex-col ${sidebarOpen ? 'w-80' : 'w-24'} h-full overflow-hidden text-zinc-700 transition-all`}>
            <div className={`flex ${!sidebarOpen && 'flex-col'} justify-between m-4 items-center gap-4 transition-all`}>
                {sidebarOpen ? (
                    <img src="images/santaBotTextLow.png" alt="" className="object-center h-10 w-fit" />
                ) : (
                    <img src="images/santaBotIcon.png" alt="" className="object-center h-10 w-fit" />
                )}

                <button
                    className='cursor-pointer hover:bg-emerald-100 h-10 w-10 rounded-xl transition-colors'
                    onClick={() => {
                        setSidebarOpen(!sidebarOpen)
                        setRefreshKey(prev => prev + 1)
                    }
                    }>
                    {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                </button>
            </div>
            <Divider />
            <div className="flex flex-col gap-2 mt-5 m-4 items-center">
                {items.map((i) => (
                    <div className="flex flex-col w-full" key={i.label}>
                        <div
                            className={`flex w-full p-2 rounded-lg gap- cursor-pointer transition-all border 
                                ${(activeTab === i.label || module === i.label) ? 'bg-emerald-100 text-emerald-600 border-emerald-300' : 'border-zinc-300'}
                                ${sidebarOpen ? 'w-full' : 'w-0 justify-center'}
                                `}
                            onClick={() => {
                                if (i.type === 'module') {
                                    if (module !== i.label) {
                                        setModule(i.label)
                                    } else {
                                        setModule('')
                                    }
                                } else {
                                    setModule('')
                                    setActiveTab(i.label)
                                    if (i.title) {
                                        setTitle(i.title)
                                        router.push(`/${i.label}`)
                                    } else {
                                        router.push(`/${i.label}`)
                                    }
                                }
                            }
                            }
                        >
                            <Tooltip title={!sidebarOpen && i.name} arrow key={i.label}>
                                <div className={`flex w-full  items-center 
                                    ${i.type === 'module' && 'justify-between'}
                                    ${(i.type === 'item' && !sidebarOpen) && 'justify-center'}
                                    `}>
                                    <div className="flex h-full gap-2">
                                        {(activeTab === i.label || module === i.label) ? i.icon : i.iconOutlined}

                                        {sidebarOpen && (
                                            <>
                                                <Divider
                                                    orientation='vertical'
                                                    sx={{
                                                        borderColor: activeTab === i.label ? '#6ee7b7' : undefined,
                                                    }}
                                                />
                                                <p>{i.name}</p>
                                            </>
                                        )}
                                    </div>
                                    {i.type === 'module' && (
                                        <ChevronRight size={18} className={`${module === i.label ? 'rotate-90' : ''} transition-all ml-auto`} />
                                    )}
                                </div>
                            </Tooltip>
                        </div>
                        <div className={`flex flex-col gap-2 ${module !== i.label ? 'h-0' : 'h-full'} transition-all overflow-hidden ${sidebarOpen && 'border-l border-zinc-300 pl-2 ml-2'}`}>
                            {i.children && (
                                i.children.map((item, index) => (
                                    <div
                                        key={item.label}
                                        className={`flex w-full rounded-lg gap-2 cursor-pointer transition-all overflow-hidden border p-2
                                            ${index === 0 && 'mt-2'}
                                            ${activeTab === item.label ? 'bg-emerald-100 text-emerald-600 border-emerald-300 ' : 'border-zinc-300'}
                                              ${sidebarOpen ? 'w-full' : 'w-0  justify-center'}
                                            `}
                                        onClick={() => {
                                            setActiveTab(item.label)
                                            setTitle(item.title)
                                            router.push(`/${item.label}`)
                                        }
                                        }
                                    >
                                        <Tooltip title={!sidebarOpen && item.name} arrow key={item.label}>
                                            {activeTab === item.label ? item.icon : item.iconOutlined}
                                        </Tooltip>
                                        {sidebarOpen && (
                                            <>
                                                <Divider
                                                    orientation='vertical'
                                                    sx={{
                                                        borderColor: activeTab === item.label ? '#6ee7b7' : undefined,
                                                    }}
                                                />
                                                <p>{item.name}</p>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div >
                ))}
            </div>
        </div >
    )
}