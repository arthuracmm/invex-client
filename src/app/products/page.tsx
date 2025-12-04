"use client";

import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
    const [title, setTitle] = useState<string>('Pagina Inicial')

    const [sidebarOpen, setSidebarOpen] = useState<boolean | null>(null);
    const [activeTab, setActiveTab] = useState<string>('products');
    const [module, setModule] = useState<string>('stock');

    const [isMounted, setIsMounted] = useState(false);

    const token = Cookies.get("token");
    const router = useRouter()

    useEffect(() => {
        setIsMounted(true);
        if (!token) {
            router.push('/');
        }
    }, [token, router]);

    if (!token) {
        return null;
    }
    
    if (!isMounted) {
        return null;
    }

    return (
        <MainLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            title={title}
            setTitle={setTitle}
            module={module}
            setModule={setModule}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
        />
    )
}