// ThemeContext.js - Create this as src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or default to false
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? JSON.parse(saved) : false;
    });

    // Save theme preference to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    // Toggle between light and dark mode
    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    // Theme object with all the colors and styles
    const theme = {
        isDarkMode,
        colors: {
            background: isDarkMode ? '#1a1a1a' : '#f8f9fa',
            cardBackground: isDarkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            text: isDarkMode ? '#e0e0e0' : '#333',
            textSecondary: isDarkMode ? '#b0b0b0' : '#666',
            accent: '#4ECDC4',
            accentSecondary: '#FFB347',
            border: isDarkMode ? 'rgba(78, 205, 196, 0.2)' : 'rgba(78, 205, 196, 0.15)',
            overlay: isDarkMode
                ? 'linear-gradient(to right, rgba(26, 26, 26, 0.35), rgba(26, 26, 26, 0))'
                : 'linear-gradient(to right, rgba(250,250,250,0.35), rgba(250,250,250,0))',
            // Decorative gradient for mobile/sidebars in light mode. Use a softer gradient that
            // preserves the original look; in dark mode we prefer a solid translucent bg.
            mobileMenuBg: isDarkMode
                ? 'linear-gradient(to right, rgba(26,26,26,0.95), rgba(26,26,26,0.85))'
                : 'linear-gradient(135deg, #fff 80%, #f7eaff 100%)'
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};