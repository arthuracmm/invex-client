'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
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
    const [refreshKey, setRefreshKey] = useState(0);

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return <HomeContent refreshKey={refreshKey}/>;
            default:
                return null;
        }
    };


    return (
        <div className="flex w-full min-h-screen max-h-screen overflow-hidden gap-1 p-1 bg-zinc-100">
            <aside className="bg-white border border-zinc-200 rounded-xl">
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
            <main className="flex-1 flex flex-col overflow-hidden border-t border-x border-zinc-200 rounded-xl">
                <section className='w-full h-full overflow-hidden text-zinc-700  bg-white border border-zinc-200'>
                    {pathname.includes(activeTab) ? renderContent() : <Loading />}
                </section>
            </main>
        </div>
    );
}