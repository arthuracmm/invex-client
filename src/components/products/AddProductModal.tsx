import { useState, useEffect } from "react";
import {
    TextField,
    CircularProgress,
    Modal,
    Divider,
    Alert,
} from "@mui/material";
import { X } from "lucide-react";
import ParkIcon from '@mui/icons-material/Park';
import DescriptionIcon from '@mui/icons-material/Description';
import MeasureIcon from '@mui/icons-material/Scale';
import NumbersIcon from '@mui/icons-material/Numbers';
import { ProductService } from "../../service/products/productService";
import { Product } from "../../types/Products";

interface AddProductModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    darkMode: boolean | null
}

export default function AddProductModal({ open, onClose, onSuccess, darkMode }: AddProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputColors = {
        icon: darkMode ? '#a1a1aa' : '#52525b',
        label: darkMode ? '#d4d4d8' : '#3f3f46',
        text: darkMode ? '#e4e4e7' : '#27272a',
        placeholder: darkMode ? '#71717a' : '#a1a1aa',
        border: darkMode ? '#3f3f46' : '#d4d4d8',
        focus: '#22c55e',
    };

    const [formData, setFormData] = useState({
        shortName: "",
        fullName: "",
        unitMeasure: "",
        quantMin: undefined,
    });

    useEffect(() => {
        if (!open) {
            setFormData({
                shortName: "",
                fullName: "",
                unitMeasure: "",
                quantMin: undefined,
            });
            setError(null);
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "quantMin" ? Number(value) :
                    name === "shortName" || name === "unitMeasure" ? value.toUpperCase() :
                        value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            await ProductService.create(formData as Product);
            onSuccess();
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
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center text-zinc-700">
            <div className={`flex flex-col ${darkMode ? 'bg-zinc-800' : 'bg-white'} shadow-2xl md:w-[60%] md:h-[60%] rounded-2xl outline-none overflow-hidden relative pb-12 md:pb-0`}>
                <div className="flex p-8 px-10 w-full md:justify-between justify-center items-center ">
                    <h1 className={`md:text-3xl text-2xl font-bold ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Adicionar Novo Produto</h1>
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
                        <img src="images/newProduct.svg" alt="Novo Produto" className="h-full" />
                    </div>

                    <div className="flex p-4 w-full justify-center items-center">
                        <div className="p-4 space-y-4 w-full">
                            {error && <Alert severity="error">{error}</Alert>}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TextField
                                    label="Nome Curto"
                                    name="shortName"
                                    value={formData.shortName}
                                    onChange={handleChange}
                                    fullWidth
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
                                    label="Unidade de Medida"
                                    name="unitMeasure"
                                    value={formData.unitMeasure}
                                    onChange={handleChange}
                                    fullWidth
                                    required
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

                                <TextField
                                    label="Nome Completo"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: <DescriptionIcon sx={{ mr: 1, color: inputColors.icon }} />
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
                                    label="Qtd. Mínima"
                                    name="quantMin"
                                    type="number"
                                    value={formData.quantMin}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    inputProps={{ min: 0 }}
                                    InputProps={{
                                        startAdornment: <NumbersIcon sx={{ mr: 1, color: inputColors.icon }} />
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
                        disabled={loading || !formData.shortName || !formData.fullName || !formData.unitMeasure}
                        className="bg-lime-500 p-2 px-6 rounded cursor-pointer text-white font-semibold hover:font-black transition-all disabled:opacity-50"
                    >
                        {loading ? <CircularProgress size={24} /> : "Adicionar"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
