import { CircularProgress } from "@mui/material";
import React from "react";

interface GradientCircularProgressProps {
    size?: number;
}

export default function GradientCircularProgress({size} : GradientCircularProgressProps) {
    return (
        <React.Fragment>
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#00BC7D" />
                        <stop offset="100%" stopColor="#1F3D33" />
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress size={size || 80} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
        </React.Fragment>
    );
}