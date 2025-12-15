"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface MobileScannerProps {
  onDetected: (code: string) => void;
  onClose: () => void;
}

export default function MobileScanner({ onDetected, onClose }: MobileScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const videoContainerId = "qr-reader-container";

  const [code, setCode] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Evita problemas de SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const startScanner = async () => {
      // Prevent multiple initializations
      if (scannerRef.current?.isScanning) return;

      try {
        // Só garante que o browser permita câmera
        await navigator.mediaDevices.getUserMedia({ video: true });

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

        await scannerRef.current.start(
          { facingMode: "environment" }, // câmera traseira
          { fps: 10, qrbox: undefined },
          async (decodedText) => {
            // Logic handled in callback
            if (isScanningRef.current) {
              isScanningRef.current = false;
              try {
                await scannerRef.current?.stop();
              } catch { }
              setCode(decodedText);
              onDetected(decodedText);
            }
          },
          (error) => {
            // console.warn("Erro de leitura:", error);
          }
        ).then(() => {
          // Delay activation logic
          setTimeout(() => {
            if (isMounted) isScanningRef.current = true;
          }, 1500);
        });

      } catch (err: any) {
        console.error("Erro ao iniciar scanner:", err);
        // Better error message
        alert(`Erro na câmera: ${err?.message || err}`);
      }
    };

    startScanner();

    return () => {
      // Cleanup logic
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(err => console.warn('Stop failed', err));
          scannerRef.current.clear();
        } catch (e) { }
      }
      isScanningRef.current = false;
    };
  }, [isMounted, onDetected]);

  if (!isMounted) return null; // evita SSR/hydration

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="relative aspect-video border border-white rounded-md overflow-hidden w-[90%]">
        <div id={videoContainerId} className="w-full h-full" />
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
