
import { useState, useEffect } from "react";
import {
    TextField,
    CircularProgress,
    Autocomplete,
    Modal,
    Divider,
} from "@mui/material";
import { Product } from "../../types/Products";
import { MovimentationService } from "@/src/service/movimentation/movimentationService";
import { useAuth } from "@/src/context/AuthContext";
import { X } from "lucide-react";
import ParkIcon from '@mui/icons-material/Park';
import NumbersIcon from '@mui/icons-material/Numbers';
import PlaceIcon from '@mui/icons-material/Place';

interface SubInventoryModalProps {
    open: boolean;
    onClose: () => void;
    product: Product | null;
    products: Product[];
    onSuccess: () => void;
}

export default function SubInventoryModal({ open, onClose, product, products, onSuccess }: SubInventoryModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { user } = useAuth()

    const [formData, setFormData] = useState({
        quantity: 0,
        location: "",
    });

    useEffect(() => {
        if (open) {
            setSelectedProduct(product);
            if (!product) {
                setFormData({
                    quantity: 0,
                    location: "",
                });
            }
        }
    }, [product, open]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    };

    if (!user) return

    const handleSubmit = async () => {
        if (!selectedProduct) {
            setError("Selecione um produto.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await MovimentationService.createOutput({
                userId: user.id,
                productId: selectedProduct.id,
                quantity: formData.quantity,
                location: formData.location
            });

            onSuccess();
            onClose();

            setFormData({
                quantity: 0,
                location: "",
            });
            setSelectedProduct(null);

        } catch (err: any) {
            console.error("Error adding inventory:", err);
            setError("Falha ao adicionar estoque. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            className="flex items-center justify-center text-zinc-700"
        >
            <div className="flex flex-col bg-white shadow-2xl md:w-[60%] md:h-[60%] rounded-2xl outline-none overflow-hidden relative pb-12 md:pb-0">
                <div className="flex p-8 px-10 w-full md:justify-between justify-center items-center ">
                    <h1 className="md:text-3xl text-2xl font-bold text-zinc-700">Nova saida do estoque</h1>
                    <button
                        onClick={() => {
                            onClose()
                        }
                        }
                        className="cursor-pointer hover:bg-emerald-50 rounded-full p-2 transition-colors box-content"
                    >
                        <X className="hidden md:flex" />
                    </button>
                </div>
                <Divider />

                <div className="flex flex-1 overflow-hidden">
                    <div className="hidden md:flex w-full items-center justify-center">
                        <img src="images/newOutput.svg" alt="a" className="h-full" />
                    </div>
                    <div className="flex p-2 w-full justify-center items-center">
                        <div className="p-4 space-y-4">
                            <div className="flex w-full gap-2 items-center">
                                <Autocomplete
                                    options={products}
                                    getOptionLabel={(option) => `${option.shortName} - ${option.fullName}`}
                                    value={selectedProduct}
                                    onChange={(_, newValue) => setSelectedProduct(newValue)}
                                    disabled={!!product}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Produto"
                                            placeholder="Pesquise por nome..."
                                            fullWidth
                                            required={!product}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <ParkIcon sx={{ mr: 1, color: 'action.active' }} />
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TextField
                                    label="Quantidade"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ min: 0 }}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <NumbersIcon sx={{ mr: 1, color: 'action.active' }} />
                                        )
                                    }}
                                />

                                <TextField
                                    label="Localização"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <PlaceIcon sx={{ mr: 1, color: 'action.active' }} />
                                        )
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
                        disabled={loading}
                        className="bg-lime-500 p-2 px-6 rounded cursor-pointer text-white font-semibold hover:font-black transition-all"
                    >
                        {loading ? <CircularProgress size={24} /> : "Adicionar"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
