// src/context/ThemeContext.js
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
    // Initialize theme from localStorage or default to light mode
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? JSON.parse(saved) : false;
    });

    // Persist theme preference
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

            /* Overlays */
            overlay: isDarkMode
                ? 'linear-gradient(to right, rgba(26,26,26,0.35), rgba(26,26,26,0))'
                : 'linear-gradient(to right, rgba(250,250,250,0.35), rgba(250,250,250,0))',

            mobileMenuBg: isDarkMode
                ? 'linear-gradient(to right, rgba(26,26,26,0.95), rgba(26,26,26,0.85))'
                : 'linear-gradient(135deg, #ffffff 80%, #f7eaff 100%)',

            /* Background-only decorative accents */
            backgroundAccentPrimary: isDarkMode
                ? 'rgba(78, 205, 196, 0.08)'
                : 'rgba(78, 205, 196, 0.12)',

            backgroundAccentSecondary: isDarkMode
                ? 'rgba(255, 179, 71, 0.06)'
                : 'rgba(255, 179, 71, 0.10)',

            backgroundAccentSoft: isDarkMode
                ? 'rgba(78, 205, 196, 0.03)'
                : 'rgba(78, 205, 196, 0.05)',
        },

        fonts: {
            base: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            heading: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
