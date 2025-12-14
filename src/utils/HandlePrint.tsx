import { Product } from "../types/Products";
import jsPDF from "jspdf";

export default async function handlePrintPdf(
    product: Product,
    copies: number = 1
) {
    const width = 50;
    const height = 30;

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [width, height],
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

    const qrBase64 = await imageToBase64(
        `/api/barcode?text=${product.id}`
    );

    for (let i = 0; i < copies; i++) {
        if (i > 0) doc.addPage();

        doc.setFontSize(8);
        doc.text(`${product.shortName} - ${product.fullName}`, width / 2, 6, {
            align: "center",
        });

        const qrSize = 20;
        const qrX = (width - qrSize) / 2;
        const qrY = 8;

        doc.addImage(qrBase64, "PNG", qrX, qrY, qrSize, qrSize);
    }

    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
}
