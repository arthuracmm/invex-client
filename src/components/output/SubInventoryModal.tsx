
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    CircularProgress,
    Alert,
    Autocomplete,
} from "@mui/material";
import { InventoryService } from "../../service/inventory/inventoryService";
import { Product } from "../../types/Products";
import { MovimentationService } from "@/src/service/movimentation/movimentationService";
import { useAuth } from "@/src/context/AuthContext";

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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {product ? `Remover Estoque - ${product.shortName}` : "Nova Saída de Estoque"}
            </DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12 }}>
                        <Autocomplete
                            options={products}
                            getOptionLabel={(option) => `${option.shortName} - ${option.fullName}`}
                            value={selectedProduct}
                            onChange={(_, newValue) => setSelectedProduct(newValue)}
                            disabled={!!product}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Produto"
                                    placeholder="Pesquise por nome..."
                                    fullWidth
                                    required={!product}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Quantidade"
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{
                                min: 0,
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Localização"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={loading}>
                    Cancelar
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Adicionar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
