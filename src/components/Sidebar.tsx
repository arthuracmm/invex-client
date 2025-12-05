"use client";

import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import YardIcon from '@mui/icons-material/Yard';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import OutboundIcon from '@mui/icons-material/Outbound';
import OutboundOutlinedIcon from '@mui/icons-material/OutboundOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import { ChevronRight, Router } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Avatar, Chip, Divider, Popover, Tooltip } from '@mui/material';
import { LogOut } from 'lucide-react';

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

    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            logout();
            router.push('/');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    const getInitials = (fullName: string) => {
        if (!fullName) return '';
        const names = fullName.trim().split(' ');
        const firstInitial = names[0]?.[0] || '';
        const secondInitial = names[1]?.[0] || '';
        return `${firstInitial}${secondInitial}`.toUpperCase();
    };

    const userName = user?.fullName ?? '';
    const initials = getInitials(userName);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;

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
            name: 'Estoque',
            label: 'stock',
            icon: <InventoryIcon />,
            iconOutlined: <Inventory2OutlinedIcon />,
            children: [
                {
                    name: 'Produtos',
                    title: 'Gestão dos agendamentos dos pacientes',
                    label: 'products',
                    icon: <YardIcon />,
                    iconOutlined: <YardOutlinedIcon />
                },
                {
                    name: 'Entrada',
                    title: 'Gestão de agenda dos profissionais',
                    label: 'entry',
                    icon: <AddCircleIcon />,
                    iconOutlined: <AddCircleOutlineOutlinedIcon />
                },
                {
                    name: 'Saida',
                    title: 'Gestão de agenda dos profissionais',
                    label: 'output',
                    icon: <OutboundIcon />,
                    iconOutlined: <OutboundOutlinedIcon />
                }
            ]
        },
    ]


    return (
        <div className={`flex flex-col ${sidebarOpen ? 'w-80' : 'w-24'} h-full overflow-hidden text-zinc-700 transition-all`}>
            <div className={`flex ${!sidebarOpen && 'flex-col'} justify-between m-4 items-center gap-4 transition-all`}>
                {sidebarOpen ? (
                    <img src="images/akin-NR-icon.png" alt="" className="object-center h-10 w-fit" />
                ) : (
                    <img src="images/akin-NR-icon.png" alt="" className="object-center h-10 w-fit" />
                )}

                <button
                    className='cursor-pointer hover:bg-lime-100 h-10 w-10 rounded-xl transition-colors'
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
                                ${(activeTab === i.label || module === i.label) ? 'bg-lime-100 text-lime-600 border-lime-300' : 'border-zinc-300'}
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
                                                        borderColor: activeTab === i.label ? '#bef264' : undefined,
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
                                            ${activeTab === item.label ? 'bg-lime-100 text-lime-600 border-lime-300 ' : 'border-zinc-300'}
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
                                                        borderColor: activeTab === item.label ? '#bef264' : undefined,
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
            <div className="flex flex-1 h-full w-full p-2 px-4 items-end">
                <div className="flex items-center cursor-pointer justify-between w-full gap-4">
                    {user?.establishment && (
                        <>
                            <Chip
                                component='button'
                                label={user.establishment.name}
                                onClick={handleClick}
                            />
                            <Popover
                                id={id}
                                open={openPopover}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                sx={{ mt: 1 }}
                            >
                                <div className="flex flex-col text-xs gap-2 text-zinc-700">
                                    <div className="flex gap-2 items-center justify-center w-full mt-4">
                                        <p className='font-bold text-lg'>{user.establishment.name}</p>
                                    </div>
                                    <Divider sx={{ my: 1 }} />
                                    <div className="flex flex-col gap-2 mx-3 mb-3">
                                        <div className="flex gap-2 items-center">
                                            <AlternateEmailIcon />
                                            <p>{user.establishment.email}</p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <WorkspacesIcon />
                                            <p>{user.establishment.type}</p>
                                        </div>
                                        <div className="flex gap-2 items-center ">
                                            <LocationPinIcon />
                                            <p>
                                                {user.establishment.adress}, {' '}
                                                {user.establishment.number}, {' '}
                                                {user.establishment.neighborhood}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <LocationCityIcon />
                                            <p>{user.establishment.city}</p>
                                        </div>
                                    </div>
                                </div>
                            </Popover>
                        </>
                    )}
                    <div className={`flex w-full justify-between items-center ${!sidebarOpen && 'flex-col gap-4 mb-2'}`}>
                        <Tooltip title={user?.email} arrow>
                            <Avatar
                                sx={{
                                    bgcolor: '#bef264',
                                    color: '#3f3f46',
                                    ':hover': {
                                        bgcolor: '#a3e635',
                                    },
                                }}
                            >
                                {initials}
                            </Avatar>
                        </Tooltip>
                        <p className={`${sidebarOpen ? 'flex' : 'hidden'}`}>
                            {userName}
                        </p>
                        <button
                            onClick={handleLogout}
                            className='text-zinc-700 hover:text-red-800 hover:transition-colors cursor-pointer'
                            aria-label="Logout"
                            title="Logout"
                        >
                            <LogOut />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}