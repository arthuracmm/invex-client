"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface MobileScannerProps {
    onDetected: (code: string) => void;
    onClose: () => void;
}

export default function MobileScanner({ onDetected, onClose }: MobileScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isScanningRef = useRef(false); // ref confiável
    const videoContainerId = "qr-reader-container";

    const [code, setCode] = useState('');

    useEffect(() => {
        const startScanner = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });

                const cameras = await Html5Qrcode.getCameras();
                const backCamera =
                    cameras.find((c) => c.label.toLowerCase().includes("back")) ||
                    cameras[cameras.length - 1];

                if (!backCamera) {
                    alert("Nenhuma câmera encontrada");
                    return;
                }

                scannerRef.current = new Html5Qrcode(videoContainerId, {
                    verbose: false,
                    formatsToSupport: [
                        Html5QrcodeSupportedFormats.QR_CODE,
                        Html5QrcodeSupportedFormats.CODE_128,
                        Html5QrcodeSupportedFormats.CODE_39,
                        Html5QrcodeSupportedFormats.EAN_13,
                        Html5QrcodeSupportedFormats.EAN_8,
                        Html5QrcodeSupportedFormats.UPC_A,
                        Html5QrcodeSupportedFormats.UPC_E,
                    ],
                });

                isScanningRef.current = true;
                await scannerRef.current.start(
                    { deviceId: { exact: backCamera.id } },
                    { fps: 10, qrbox: undefined },
                    async (decodedText) => {
                        if (scannerRef.current && isScanningRef.current) {
                            isScanningRef.current = false; // trava pra não chamar duas vezes
                            try {
                                await scannerRef.current.stop();
                            } catch { }
                            console.log("Código detectado: " + decodedText);
                            setCode(decodedText);
                            onDetected(decodedText);
                        }
                    },
                    (error) => {
                        // erros menores podem ser ignorados
                        console.warn("Erro de leitura:", error);
                    }
                );
            } catch (err) {
                console.error(err);
                alert("Não foi possível acessar a câmera.");
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && isScanningRef.current) {
                scannerRef.current.stop().catch(() => { });
                isScanningRef.current = false;
            }
        };
    }, [onDetected]);

    return (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
            <div className="relative aspect-video border border-white rounded-md overflow-hidden w-[90%]">
                <div id={videoContainerId} className="w-full h-full" />
                <div className="absolute rounded pointer-events-none" />
            </div>

            <button
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                onClick={onClose}
            >
                Fechar
            </button>
            <p className="bg-white mt-2 p-2 rounded">Código: {code}</p>
        </div>
    );
}
