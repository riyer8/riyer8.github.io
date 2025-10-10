import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    const buttonStyle = {
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: theme.colors.cardBackground,
        border: `1px solid ${theme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1.2rem',
        color: theme.colors.text,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        zIndex: 1001,
        boxShadow: theme.isDarkMode 
            ? '0 4px 15px rgba(0, 0, 0, 0.3)' 
            : '0 4px 15px rgba(0, 0, 0, 0.1)'
    };

    const iconStyle = {
        transition: 'transform 0.3s ease'
    };

    return (
        <button
            style={buttonStyle}
            onClick={toggleTheme}
            onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = theme.isDarkMode 
                    ? '0 6px 20px rgba(0, 0, 0, 0.4)' 
                    : '0 6px 20px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = theme.isDarkMode 
                    ? '0 4px 15px rgba(0, 0, 0, 0.3)' 
                    : '0 4px 15px rgba(0, 0, 0, 0.1)';
            }}
            title={theme.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div style={iconStyle}>
                {theme.isDarkMode ? <FaSun /> : <FaMoon />}
            </div>
        </button>
    );
};

export default ThemeToggle;