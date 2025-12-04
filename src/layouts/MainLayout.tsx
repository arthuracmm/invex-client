'use client';

import { useState } from 'react';
import { Avatar, Chip, Divider, Popover, Tooltip } from '@mui/material';
import { LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Loading from '../components/Loading';
import HomeContent from '../components/home/HomeContent';

interface MainLayoutProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    sidebarOpen: boolean | null;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
    module: string;
    setModule: React.Dispatch<React.SetStateAction<string>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}

export default function MainLayout({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, module, setModule, title, setTitle }: MainLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);

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

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return <HomeContent />;
            default:
                return null;
        }
    };


    return (
        <div className="flex w-full min-h-screen max-h-screen overflow-hidden gap-4 p-2 bg-zinc-100">
            <aside className="bg-white border border-zinc-300 rounded-3xl">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setTitle={setTitle}
                    module={module}
                    setModule={setModule}
                    setRefreshKey={setRefreshKey}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
            </aside>
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex flex-col bg-white border border-zinc-300 rounded-3xl px-5">
                    <div className="flex justify-between items-center py-5 px-2">
                        <div className="flex flex-col md:flex-row items-center w-full">
                            <div className={`hidden md:flex w-full`}>
                                <p className='text-3xl opacity-80 font-bold'>
                                    {title}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center cursor-pointer gap-4">
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
                            <Tooltip title={user?.email} arrow>
                                <Avatar
                                    sx={{
                                        bgcolor: '#00bc7d',
                                        ':hover': {
                                            bgcolor: '#007a55',
                                        },
                                    }}
                                >
                                    {initials}
                                </Avatar>
                            </Tooltip>
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
                </header>

                <section className={`mt-4 w-full h-full overflow-hidden text-zinc-700 rounded-3xl bg-white border border-zinc-300`}>
                    {pathname.includes(activeTab) ? renderContent() : <Loading />}
                </section>
            </main>
        </div>
    );
}