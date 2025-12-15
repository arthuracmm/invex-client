'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Loading from '../components/Loading';
import HomeContent from '../components/home/HomeContent';
import ProductContent from '../components/products/ProductsContent';
import EntryContent from '../components/entry/EntryContent';
import OutputContent from '../components/output/OutputContent';
import SettingsContent from '../components/settings/SettingContent';
import Sidebar from '../components/sidebar/Sidebar';
import NotificationsContent from '../components/notifications/NotificationContent';

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
    const [darkMode, setDarkMode] = useState<boolean | null>(null);

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return <HomeContent refreshKey={refreshKey} darkMode={darkMode}/>;
            case "products":
                return <ProductContent darkMode={darkMode}/>;
            case "entry":
                return <EntryContent darkMode={darkMode} />;
            case "output":
                return <OutputContent darkMode={darkMode}/>;
            case "settings":
                return <SettingsContent darkMode={darkMode}/>;
            case "notifications":
                return <NotificationsContent darkMode={darkMode}/>;
            default:
                return null;
        }
    };


    return (
        <div className={`flex w-full min-h-screen max-h-screen overflow-hidden gap-1 p-1 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-100'} transition-colors`}>
            <aside className={` ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'} border rounded-xl transition-colors`}>
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setTitle={setTitle}
                    module={module}
                    setModule={setModule}
                    setRefreshKey={setRefreshKey}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />
            </aside>
            <main className={`flex-1 flex flex-col overflow-hidden border ${darkMode ? 'border-zinc-700' : 'border-zinc-200 '} rounded-xl transition-colors`}>
                <section className={`w-full h-full overflow-hidden ${darkMode ? 'text-white bg-zinc-800' : 'text-zinc-700  bg-white'} transition-colors`}>
                    {pathname.includes(activeTab) ? renderContent() : <Loading />}
                </section>
            </main>
        </div>
    );
}