import jsPDF from "jspdf";
import { Product } from "../types/Products";

type PrintItem = {
    product: Product;
    quantity: number;
};

export default async function handlePrintStockPdf(
    items: PrintItem[]
) {
    const width = 100;  // 10 cm = 100 mm
    const height = 70;  // 7 cm = 70 mm

    const doc = new jsPDF({
        orientation: "landscape",  // Isso define que a impressão será no formato horizontal
        unit: "mm",  // A unidade é em milímetros
        format: [width, height],  // Definindo o tamanho da página
    });

    const imageToBase64 = async (url: string): Promise<string> => {
        const response = await fetch(url);
        const blob = await response.blob();

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    };

    let isFirstPage = true;

    for (const item of items) {
        const qrBase64 = await imageToBase64(
            `/api/barcode?text=${item.product.id}`
        );

        for (let i = 0; i < item.quantity; i++) {   
            if (!isFirstPage) doc.addPage();
            isFirstPage = false;

            // Adicionando o nome do produto
            doc.setFontSize(8);
            doc.text(`${item.product.shortName} - ${item.product.fullName}`, width / 2, 6, {
                align: "center",
            });

            const qrSize = 60;  // Tamanho do QR code (em mm)
            const qrX = (width - qrSize) / 2;  // Centralizando o QR code
            const qrY = 10;  // Posição Y do QR code

            doc.addImage(qrBase64, "PNG", qrX, qrY, qrSize, qrSize);  // Adicionando a imagem do QR code
        }
    }

    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
}
