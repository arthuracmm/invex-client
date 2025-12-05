import { useState } from "react";
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
} from "@mui/material";
import { ProductService } from "../../service/products/productService";
import { InventoryService } from "../../service/inventory/inventoryService";
import { Product } from "../../types/Products";

interface AddProductModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddProductModal({ open, onClose, onSuccess }: AddProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        shortName: "",
        fullName: "",
        unitMeasure: "",
        quantMin: 0,
        location: "",
        initialQuantity: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantMin" || name === "initialQuantity" ? Number(value) : value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {

            const productData = {
                shortName: formData.shortName,
                fullName: formData.fullName,
                unitMeasure: formData.unitMeasure,
                quantMin: formData.quantMin,
            };
            const createdProduct = await ProductService.create(productData);

            if (createdProduct && createdProduct.id) {
                await InventoryService.create({
                    productId: createdProduct.id,
                    quantity: formData.initialQuantity,
                    location: formData.location,
                });
            }

            onSuccess();
            onClose();

            setFormData({
                shortName: "",
                fullName: "",
                unitMeasure: "",
                quantMin: 0,
                location: "",
                initialQuantity: 0,
            });
        } catch (err: any) {
            console.error("Error creating product:", err);
            if (err.response && err.response.status === 409) {
                setError("Produto já existe. Verifique o nome curto ou completo.");
            } else {
                setError("Falha ao criar produto. Verifique os dados e tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Adicionar Novo Produto</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Nome Curto"
                            name="shortName"
                            value={formData.shortName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Unidade de Medida"
                            name="unitMeasure"
                            value={formData.unitMeasure}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Nome Completo"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Qtd. Mínima"
                            name="quantMin"
                            type="number"
                            value={formData.quantMin}
                            onChange={handleChange}
                            fullWidth
                            required
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
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Quantidade Inicial"
                            name="initialQuantity"
                            type="number"
                            value={formData.initialQuantity}
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
