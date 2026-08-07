import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const theme = {
        isDarkMode,

        colors: {
            /* Core surfaces */
            background: isDarkMode ? '#1a1a1a' : '#f8f9fa',
            cardBackground: isDarkMode
                ? 'rgba(40, 40, 40, 0.9)'
                : 'rgba(255, 255, 255, 0.9)',

            /* Text */
            text: isDarkMode ? '#e0e0e0' : '#333333',
            textSecondary: isDarkMode ? '#b0b0b0' : '#666666',

            /* Brand accents (DO NOT animate icons with these) */
            accent: '#4ECDC4',
            accentSecondary: '#FFB347',

            /* Borders / UI chrome */
            border: isDarkMode
                ? 'rgba(78, 205, 196, 0.2)'
                : 'rgba(78, 205, 196, 0.15)',

            /* Background-only decorative accents */
            backgroundAccentPrimary: isDarkMode
                ? 'rgba(78, 205, 196, 0.08)'
                : 'rgba(78, 205, 196, 0.12)',

            backgroundAccentSecondary: isDarkMode
                ? 'rgba(255, 179, 71, 0.06)'
                : 'rgba(255, 179, 71, 0.10)',
        },

        fonts: {
            brand: '"Playfair Display", Georgia, "Times New Roman", serif',
            base: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            heading: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        }
    };

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--font-brand', theme.fonts.brand);
        root.style.setProperty('--font-ui', theme.fonts.base);
    }, [theme.fonts.brand, theme.fonts.base]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
