"use client";

import { useEffect, useRef, useState } from "react";

interface MobileScannerProps {
  onDetected: (code: string) => void;
  onClose: () => void;
}

export default function MobileScanner({ onDetected, onClose }: MobileScannerProps) {
  const scannerRef = useRef<any>(null);
  const containerId = "qr-reader";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const startScanner = async () => {
      try {
        // Import dinâmico CORRETO (não quebra o build)
        const { Html5Qrcode } = await import("html5-qrcode");

        if (!document.getElementById(containerId)) return;

        scannerRef.current = new Html5Qrcode(containerId);

     await scannerRef.current.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: { width: 320, height: 320 } },
  (decodedText: string) => {
    if (!active) return;
    active = false;
    stopScanner();
    onDetected(decodedText);
  },
  () => {}
);

      } catch (err: any) {
        console.error("Erro ao iniciar scanner:", err);
        setError("Erro ao acessar a câmera");
      }
    };

    const stopScanner = async () => {
      try {
        if (scannerRef.current?.isScanning) {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
        }
      } catch {}
    };

    startScanner();

    return () => {
      active = false;
      stopScanner();
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
      <div
        id={containerId}
        className="w-[90%] max-w-md aspect-video bg-black rounded"
      />

      {error && (
        <p className="text-red-500 mt-3 font-bold">{error}</p>
      )}

      <button
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        onClick={onClose}
      >
        Fechar
      </button>
    </div>
  );
}
