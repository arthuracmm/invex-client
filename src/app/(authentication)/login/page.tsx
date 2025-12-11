"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import Divider from '@mui/material/Divider';
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';
import HttpsIcon from '@mui/icons-material/Https';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { VisibilityOff } from "@mui/icons-material";
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from "../../../context/AuthContext";
import { Alert, Snackbar } from "@mui/material";
import { AuthService } from "@/src/service/auth/authService";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isMounted, setIsMounted] = useState(false);
    
    const [toast, setToast] = useState<{ open: boolean; message: string, severity: 'success' | 'error' | 'info' | 'warning'; }>({
        open: false,
        message: '',
        severity: 'info'
    });
    
    useEffect(() => {
        setIsMounted(true);
        setViewPassword(false);
    }, []);

    if (!isMounted) {
        return null;
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { user } = await AuthService.login({ email, password });
            login(user);
            setToast({ open: true, message: 'Login realizado com sucesso', severity: 'success' });
            setTimeout(() => {
                router.push("/home");
            }, 500);
        } catch (err: any) {
            console.log(err)
            setToast({ open: true, message: 'Email e/ou senhas incorreto(s)', severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    }



    const handleCloseToast = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setToast(prev => ({ ...prev, open: false }));
    };

    return (
        <div className="flex w-full h-screen items-center justify-center bg-zinc-100">
            <div className="flex shadow-xl max-w-200 items-center justify-center  rounded-xl bg-white">
                <div className="flex flex-col gap-6 p-10 px-25 justify-between">
                    <div className="flex w-full justify-center mb-4">
                        <img src="images/akin-NR.png" alt="logo nossa" className="w-[40%]" />
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3 flex w-full flex-col">
                            <label htmlFor="email" className="mb-1 font-semibold text-sm text-gray-700">
                                Email
                            </label>
                            <div className="flex bg-white border border-zinc-300 text-zinc-700 rounded-lg text-sm relative overflow-hidden">
                                <Person4OutlinedIcon className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2" sx={{ width: 20 }} />
                                <input
                                    id="email"
                                    placeholder="joao.silva@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    className="bg-white p-3 pl-10 w-full h-full border-none focus:outline-none min-w-50"
                                />
                            </div>
                        </div>

                        <div className="mb-2 flex w-full flex-col">
                            <label htmlFor="password" className="mb-1 font-semibold text-sm text-gray-700">
                                Senha
                            </label>
                            <div className="flex bg-white border border-zinc-300 text-zinc-700 rounded-lg text-sm relative overflow-hidden">
                                <HttpsIcon className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2" sx={{ width: 20 }} />
                                <input
                                    id="password"
                                    type={viewPassword ? "text" : "password"}
                                    placeholder="******"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className="bg-white p-3 pl-9 w-full h-full border-none focus:outline-none"
                                />
                                <a onClick={() => { setViewPassword(!viewPassword) }} className="cursor-pointer">
                                    {
                                        !viewPassword ? (
                                            <VisibilityIcon className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2" sx={{ width: 20 }} />
                                        ) : (
                                            <VisibilityOff className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2" sx={{ width: 20 }} />
                                        )
                                    }

                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col pt-6">
                            <button
                                disabled={isLoading}
                                className="flex h-12 w-full font-semibold items-center justify-center uppercase text-sm  bg-[#96bdff] hover:bg-[#96bdff] text-white transition-colors cursor-pointer rounded-lg"
                                type="submit"
                                style={{
                                    backgroundImage: isLoading
                                        ? 'none'
                                        : `linear-gradient(90deg, #1ed83dff, #3dbdf0ff, #00BD7E, #1F3D33`,
                                    backgroundSize: '200% 100%',
                                    backgroundPosition: 'left',
                                    transition: 'background-position 0.5s ease',
                                    backgroundColor: isLoading ? '#00BC7D' : undefined,
                                }}
                                onMouseEnter={e => {
                                    if (!isLoading) {
                                        e.currentTarget.style.backgroundPosition = 'right';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isLoading) {
                                        e.currentTarget.style.backgroundPosition = 'left';
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <LoginIcon />
                                        Entrar
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </div>
    );
}