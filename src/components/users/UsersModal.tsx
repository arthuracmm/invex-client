import { useState, useEffect } from "react";
import {
    TextField,
    Modal,
    Divider,
    Alert,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import Select from "@mui/material/Select";
import { X } from "lucide-react";
import ParkIcon from '@mui/icons-material/Park';
import DescriptionIcon from '@mui/icons-material/Description';
import MeasureIcon from '@mui/icons-material/Scale';
import { Users } from "@/src/types/Users";
import { usersService } from "@/src/service/users/usersService";
import { useAuth } from "@/src/context/AuthContext";

interface UsersModalProps {
    open: boolean;
    onClose: () => void;
    darkMode: boolean | null;
    selectedUser: Users | null
    fetchUsers: () => void;
}

export default function UsersModal({ open, onClose, darkMode, selectedUser, fetchUsers }: UsersModalProps) {
    if (!selectedUser) return
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [fullName, setFullName] = useState<string>(selectedUser.fullName);
    const [email, setEmail] = useState<string>(selectedUser.email);
    const [role, setRole] = useState<string>(selectedUser.role);
    const [isActive, setIsActive] = useState<boolean>(selectedUser.isActive);

    const inputColors = {
        icon: darkMode ? '#a1a1aa' : '#52525b',
        label: darkMode ? '#d4d4d8' : '#3f3f46',
        text: darkMode ? '#e4e4e7' : '#27272a',
        placeholder: darkMode ? '#71717a' : '#a1a1aa',
        border: darkMode ? '#3f3f46' : '#d4d4d8',
        focus: '#22c55e',
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await usersService.update(selectedUser.id, {
                fullName: fullName,
                email: email,
                role: role,
                isActive: isActive
            });
            onClose();
        } catch (err: any) {
            console.error("Erro ao criar produto:", err);
            if (err.response?.status === 409) {
                setError("Produto já existe. Verifique o nome curto ou completo.");
            } else {
                setError("Falha ao criar produto. Verifique os dados e tente novamente.");
            }
        } finally {
            setLoading(false);
            fetchUsers()
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center text-zinc-700">
            <div className={`flex flex-col ${darkMode ? 'bg-zinc-800' : 'bg-white'} shadow-2xl md:w-[60%] md:h-[70%] rounded-2xl outline-none overflow-hidden relative pb-12 md:pb-0`}>
                <div className="flex p-8 px-10 w-full md:justify-between justify-center items-center ">
                    <h1 className={`md:text-3xl text-2xl font-bold ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Editar Usuario</h1>
                    <button
                        onClick={onClose}
                        className="cursor-pointer hover:bg-emerald-50 rounded-full p-2 transition-colors box-content"
                    >
                        <X className={`${darkMode ? 'text-zinc-200' : 'text-zinc-700'} hidden md:flex`} />
                    </button>
                </div>
                <Divider />

                <div className="flex flex-1 overflow-hidden">
                    <div className="hidden md:flex w-full items-center justify-center">
                        <img src="images/newUsers.svg" alt="Novo Produto" className="h-full" />
                    </div>

                    <div className="flex p-4 w-full justify-center items-center">
                        <div className="p-4 space-y-4 w-full">
                            {error && <Alert severity="error">{error}</Alert>}
                            <div className=" flex flex-col gap-4">
                                <TextField
                                    label="Nome Completo"
                                    name="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    fullWidth
                                    disabled={user?.role !== 'admin'}
                                    required
                                    inputProps={{ maxLength: 3 }}
                                    InputProps={{
                                        startAdornment: <ParkIcon
                                            sx={{
                                                mr: 1,
                                                color: inputColors.icon,
                                            }}
                                        />
                                    }}
                                    sx={{
                                        '& label': {
                                            color: inputColors.label,
                                        },
                                        '& label.Mui-focused': {
                                            color: inputColors.focus,
                                        },
                                        '& .MuiInputBase-input': {
                                            color: inputColors.text,
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                            color: inputColors.placeholder,
                                            opacity: 1,
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: inputColors.border,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: inputColors.focus,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: inputColors.focus,
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    label="Email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                    required
                                    disabled={user?.role !== 'admin'}
                                    InputProps={{
                                        startAdornment: <MeasureIcon sx={{ mr: 1, color: inputColors.icon }} />
                                    }}
                                    sx={{
                                        '& label': {
                                            color: inputColors.label,
                                        },
                                        '& label.Mui-focused': {
                                            color: inputColors.focus,
                                        },
                                        '& .MuiInputBase-input': {
                                            color: inputColors.text,
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                            color: inputColors.placeholder,
                                            opacity: 1,
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: inputColors.border,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: inputColors.focus,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: inputColors.focus,
                                            },
                                        },
                                    }}
                                />

                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel
                                        id="role-label"
                                        sx={{
                                            color: inputColors.label,
                                            '&.Mui-focused': {
                                                color: inputColors.focus,
                                            },
                                        }}>Cargo</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        label="Cargo"
                                        disabled={user?.role !== 'admin'}
                                        sx={{
                                            color: inputColors.text,
                                            '& ~ .MuiInputLabel-root': {
                                                color: inputColors.label,
                                            },
                                            '&.Mui-focused ~ .MuiInputLabel-root': {
                                                color: inputColors.focus,
                                            },
                                            '& .MuiSelect-icon': {
                                                color: inputColors.icon,
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: inputColors.border,
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: inputColors.focus,
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: inputColors.focus,
                                            },
                                        }}
                                    >
                                        <MenuItem value="">Nenhum</MenuItem>
                                        <MenuItem value="user">Usuario</MenuItem>
                                        <MenuItem value="admin">Administrador</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex absolute gap-4 bottom-4 right-4">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="bg-lime-100 p-2 px-6 rounded cursor-pointer font-semibold hover:font-black transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !fullName || !email || !role || !isActive}
                        className="bg-lime-500 p-2 px-6 rounded cursor-pointer text-white font-semibold hover:font-black transition-all disabled:opacity-50"
                    >
                        {loading ? <CircularProgress size={24} /> : "Atualizar"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
