import React from 'react';
import { useTheme } from '../ThemeContext/ThemeContext';
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
        color: theme.colors.text,
        backdropFilter: 'blur(10px)',
        transition: 'box-shadow 0.25s ease, background 0.25s ease',
        zIndex: 1001,
        boxShadow: theme.isDarkMode
            ? '0 4px 14px rgba(0, 0, 0, 0.3)'
            : '0 4px 14px rgba(0, 0, 0, 0.12)',
        padding: 0
    };

    const iconWrapperStyle = {
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.25s ease',
        transform: 'scale(1)',
    };

    const sunStyle = {
        fontSize: '1.25rem',      // slightly larger
        transform: 'translateY(1px)', // optical centering
    };

    const moonStyle = {
        fontSize: '1.15rem',
    };

    return (
        <button
            style={buttonStyle}
            onClick={toggleTheme}
            onMouseEnter={(e) => {
                e.currentTarget.querySelector('.icon-wrapper').style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.querySelector('.icon-wrapper').style.transform = 'scale(1)';
            }}
            title={theme.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div className="icon-wrapper" style={iconWrapperStyle}>
                {theme.isDarkMode ? (
                    <FaSun style={sunStyle} />
                ) : (
                    <FaMoon style={moonStyle} />
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;
