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
import { Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { AuthService } from "@/src/service/auth/authService";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isMounted, setIsMounted] = useState(false);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', secretKey: '' });

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



    async function handleRegister() {
        if (!registerData.name || !registerData.email || !registerData.password || !registerData.secretKey) {
            setToast({ open: true, message: 'Preencha todos os campos', severity: 'warning' });
            return;
        }

        setIsRegistering(true);
        try {
            const { user } = await AuthService.register(registerData);
            login(user);
            setToast({ open: true, message: 'Conta criada com sucesso!', severity: 'success' });
            setOpenRegisterModal(false);
            setTimeout(() => {
                router.push("/home");
            }, 500);
        } catch (err) {
            console.error(err);
            setToast({ open: true, message: 'Erro ao criar conta. Email pode já estar em uso.', severity: 'error' });
        } finally {
            setIsRegistering(false);
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
                    <div className="mt-4 text-center">
                        <p className="text-zinc-500 text-sm">Ainda não tem conta?</p>
                        <button
                            onClick={() => setOpenRegisterModal(true)}
                            className="text-[#96bdff] font-bold text-sm hover:underline cursor-pointer"
                        >
                            Crie agora
                        </button>
                    </div>
                </div>

            </div>



            <Dialog open={openRegisterModal} onClose={() => setOpenRegisterModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Criar Nova Conta</DialogTitle>
                <DialogContent>
                    <div className="flex flex-col gap-4 mt-2">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
                            <input
                                type="text"
                                placeholder="Seu Nome"
                                className="border border-zinc-300 rounded-lg p-2 focus:outline-none focus:border-[#96bdff]"
                                value={registerData.name}
                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                className="border border-zinc-300 rounded-lg p-2 focus:outline-none focus:border-[#96bdff]"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-1">Senha</label>
                            <input
                                type="password"
                                placeholder="******"
                                className="border border-zinc-300 rounded-lg p-2 focus:outline-none focus:border-[#96bdff]"
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Código de Convite</label>
                        <input
                            type="text"
                            placeholder="Chave de registro"
                            className="border border-zinc-300 rounded-lg p-2 focus:outline-none focus:border-[#96bdff]"
                            value={registerData.secretKey}
                            onChange={(e) => setRegisterData({ ...registerData, secretKey: e.target.value })}
                        />
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRegisterModal(false)} color="inherit">Cancelar</Button>
                    <Button onClick={handleRegister} variant="contained" sx={{ bgcolor: '#96bdff', ':hover': { bgcolor: '#7ea4e6' } }} disabled={isRegistering}>
                        {isRegistering ? <Loader2Icon className="animate-spin w-5 h-5" /> : 'Cadastrar'}
                    </Button>
                </DialogActions>
            </Dialog>

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
        </div >
    );
}