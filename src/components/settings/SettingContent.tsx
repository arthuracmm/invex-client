"use client";

import { Divider, InputAdornment, OutlinedInput } from "@mui/material";
import { useEffect, useState } from 'react';
import KeyboardIcon from '@mui/icons-material/Keyboard';

interface SettingsContentProps {
    darkMode: boolean | null
}

export default function SettingsContent({ darkMode }: SettingsContentProps) {

    const [shortcut, setShorcut] = useState<string>('')
    const [radioChecked, setRadioChecked] = useState<boolean>(false);

    const inputColors = {
        icon: darkMode ? '#a1a1aa' : '#52525b',
        label: darkMode ? '#d4d4d8' : '#3f3f46',
        text: darkMode ? '#e4e4e7' : '#27272a',
        placeholder: darkMode ? '#71717a' : '#a1a1aa',
        border: darkMode ? '#3f3f46' : '#d4d4d8',
        focus: '#22c55e',
    };

    useEffect(() => {
        const savedState = localStorage.getItem("shortcut");
        if (!savedState) {
            setShorcut("");
        } else {
            setShorcut(savedState);
        }
    }, []);

    useEffect(() => {
        if (shortcut) {
            localStorage.setItem("shortcut", shortcut);
        }
    }, [shortcut]);


    const [waitingKey, setWaitingKey] = useState(false);

    useEffect(() => {
        if (!waitingKey) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
            setShorcut(key);
            setWaitingKey(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);

    }, [waitingKey]);

    return (
        <div className="flex h-full flex-col ">
            <div className="flex w-full md:justify-between items-center justify-center ">
                <h1 className={`hidden md:flex text-4xl p-4 px-10 my-5 font-extrabold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Configurações</h1>
            </div>

            <Divider />

            <div className="flex flex-col gap-2 m-8">
                <h1 className="font-semibold">Atalho para a abertura de movimentações</h1>
                <OutlinedInput
                    value={waitingKey ? "" : shortcut}
                    readOnly
                    onClick={() => setWaitingKey(true)}
                    startAdornment={
                        <InputAdornment position="start">
                            <KeyboardIcon
                                sx={{
                                    mr: 1,
                                    color: inputColors.icon,
                                }}
                            />
                        </InputAdornment>
                    }
                    sx={{
                        color: inputColors.text,

                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: inputColors.border,
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: inputColors.focus,
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: inputColors.focus,
                        },

                        '& .MuiInputBase-input::placeholder': {
                            color: inputColors.placeholder,
                            opacity: 1,
                        },
                    }}
                />
            </div>
            <div className="flex flex-col h-full">
                {waitingKey && (
                    <div className="absolute left-0 top-0 w-full h-full 
                    flex items-center justify-center
                    bg-lime-900/50 backdrop-blur-sm text-white text-2xl
                    rounded-md pointer-events-none font-bold gap-4"
                    >
                        <KeyboardIcon sx={{ fontSize: 50 }} />
                        <p>Pressione uma tecla…</p>
                    </div>
                )}
            </div>
        </div>
    )
}