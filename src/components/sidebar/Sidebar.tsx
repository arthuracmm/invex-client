"use client";

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Avatar, Chip, Divider, Popover, Tooltip } from '@mui/material';
import { LogOut } from 'lucide-react';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SelectContent from './SelectContent';
import { useAuth } from '@/src/context/AuthContext';
import SideBarItem, { SideBarArrayitems } from './SideBarItem';

interface SidebarProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    sidebarOpen: boolean | null;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    module: string;
    setModule: React.Dispatch<React.SetStateAction<string>>;
    setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
    darkMode: boolean | null
    setDarkMode: React.Dispatch<React.SetStateAction<boolean | null>>;
}


export default function Sidebar({ activeTab, setActiveTab, setTitle, setRefreshKey, sidebarOpen, setSidebarOpen, darkMode, setDarkMode }: SidebarProps) {

    const [serviceSelected, setServiceSelected] = useState<string>('')

    useEffect(() => {
        const savedState = localStorage.getItem("sidebarOpen");
        if (savedState !== null) {
            setSidebarOpen(savedState === "true");
        }
    }, []);

    useEffect(() => {
        const savedState = localStorage.getItem("darkMode");
        if (savedState !== null) {
            setDarkMode(savedState === "true");
        }
    }, []);

    useEffect(() => {
        if (sidebarOpen !== null) {
            localStorage.setItem("sidebarOpen", sidebarOpen.toString());
        }
    }, [sidebarOpen]);

    useEffect(() => {
        if (darkMode !== null) {
            localStorage.setItem("darkMode", darkMode.toString());
        }
    }, [darkMode]);

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

    return (
        <div className={`flex flex-col ${sidebarOpen ? 'w-80' : 'w-24'} h-full overflow-hidden ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}  transition-all`}>
            <div className={`flex ${!sidebarOpen && 'flex-col'} justify-between m-4 items-center gap-4 transition-all`}>
                {sidebarOpen ? (
                    <img src="images/akin-NR-icon.png" alt="" className={`object-center h-10 w-10 ${darkMode && 'bg-zinc-300 rounded-full'}`} />
                ) : (
                    <img src="images/akin-NR-icon.png" alt="" className="object-center h-10 w-10 " />
                )}

                <div className="hidden md:flex">
                    {sidebarOpen && (
                        <button
                            className={`cursor-pointer ${darkMode ? 'hover:bg-lime-900' : 'hover:bg-lime-100'} h-10 w-10 rounded-xl transition-colors`}
                            onClick={() => {
                                setDarkMode(!darkMode)
                                setRefreshKey(prev => prev + 1)
                            }
                            }>
                            {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
                        </button>
                    )}

                    <button
                        className={`cursor-pointer ${darkMode ? 'hover:bg-lime-900' : 'hover:bg-lime-100'} h-10 w-10 rounded-xl transition-colors`}
                        onClick={() => {
                            setSidebarOpen(!sidebarOpen)
                            setRefreshKey(prev => prev + 1)
                        }
                        }>
                        {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>
            <Divider />
            <div className="flex flex-col gap-2 m-4 items-center">
                <SelectContent
                    serviceSelected={serviceSelected}
                    setServiceSelected={setServiceSelected}
                    sidebarOpen={sidebarOpen}
                    darkMode={darkMode}
                />

                {SideBarArrayitems.filter((item) => item.service === serviceSelected).map((i) => (
                    <SideBarItem
                        key={i.label}
                        item={i}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        sidebarOpen={sidebarOpen}
                        darkMode={darkMode}
                        setTitle={setTitle}
                    />
                ))}

            </div>
            <div className="flex flex-1 h-full w-full p-2 px-4 items-end">
                <div className="flex items-center cursor-pointer justify-between w-full gap-4">
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
                            className={`${darkMode ? 'text-zinc-300 hover:text-red-400' : 'text-zinc-700 hover:text-red-800'} transition-colors cursor-pointer`}
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