"use client";

import { useEffect } from "react";

interface ShortcutListenerProps {
  keyTrigger?: string; 
  onShortcut: () => void;
}

export default function ShortcutListener({ keyTrigger, onShortcut }: ShortcutListenerProps) {
  
  useEffect(() => {
    const finalKey = keyTrigger || localStorage.getItem("shortcut");
    if (!finalKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedKey = e.key.length === 1 ? e.key.toUpperCase() : e.key;

      if (pressedKey === finalKey) {
        onShortcut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);

  }, [keyTrigger, onShortcut]);

  return null;
}
