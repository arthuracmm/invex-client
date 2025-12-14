import jsPDF from "jspdf";
import { Product } from "../types/Products";

type PrintItem = {
    product: Product;
    quantity: number;
};

export default async function handlePrintStockPdf(
    items: PrintItem[]
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

    let isFirstPage = true;

    for (const item of items) {
        const qrBase64 = await imageToBase64(
            `/api/barcode?text=${item.product.id}`
        );

        for (let i = 0; i < item.quantity; i++) {
            if (!isFirstPage) doc.addPage();
            isFirstPage = false;

            doc.setFontSize(8);
            doc.text(`${item.product.shortName} - ${item.product.fullName}`, width / 2, 6, {
                align: "center",
            });

            const qrSize = 20;
            const qrX = (width - qrSize) / 2;
            const qrY = 8;

            doc.addImage(qrBase64, "PNG", qrX, qrY, qrSize, qrSize);
        }
    }

    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
}
