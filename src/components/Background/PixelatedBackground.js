import React from 'react';
import { useTheme } from '../ThemeContext/ThemeContext';

const PixelatedBackground = () => {
    const { theme } = useTheme();

    const backgroundStyle = {
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundColor: theme.colors.background,
        transition: 'background-color 0.3s ease'
    };

    const gridStyle = {
        position: 'absolute',
        inset: 0,
        backgroundImage: `
            linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px),
            linear-gradient(0deg, ${theme.colors.border} 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px, 40px 40px',
        backgroundPosition: '0 0, 0 0',
        opacity: theme.isDarkMode ? 0.28 : 0.45
    };

    const colorOverlayStyle = {
        position: 'absolute',
        inset: 0,
        backgroundImage: `
            radial-gradient(
                ellipse at 20% 30%,
                ${theme.colors.backgroundAccentPrimary} 0%,
                transparent 55%
            ),
            radial-gradient(
                ellipse at 80% 70%,
                ${theme.colors.backgroundAccentSecondary} 0%,
                transparent 55%
            )
        `,
        backgroundSize: '140% 140%, 140% 140%',
        backgroundPosition: '0% 0%, 100% 100%',
        animation: 'colorFloat 45s ease-in-out infinite'
    };

    return (
        <>
            <style>
                {`
                @keyframes colorFloat {
                    0% {
                        background-position: 0% 0%, 100% 100%;
                        opacity: 0.95;
                    }
                    50% {
                        background-position: 6% 4%, 94% 96%;
                        opacity: 1;
                    }
                    100% {
                        background-position: 0% 0%, 100% 100%;
                        opacity: 0.95;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .pixel-color {
                        animation: none !important;
                    }
                }
                `}
            </style>

            <div style={backgroundStyle}>
                <div style={gridStyle} />
                <div className="pixel-color" style={colorOverlayStyle} />
            </div>
        </>
    );
};

export default PixelatedBackground;