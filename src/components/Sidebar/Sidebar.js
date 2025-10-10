import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SidebarContent from './SidebarContent';

const Sidebar = () => {
    const { theme } = useTheme();
    const [shouldCollapseSidebar, setShouldCollapseSidebar] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setShouldCollapseSidebar(window.innerWidth <= 900); // Same breakpoint as MainContent
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);


    const sidebarStyle = {
        width: '20%',
        padding: '5rem 2rem 2rem 6rem',
        display: shouldCollapseSidebar ? 'none' : 'flex', // Hide when collapsed
        flexDirection: 'column',
        justifyContent: 'flex-start',
        background: shouldCollapseSidebar ? (theme.isDarkMode ? theme.colors.cardBackground : (theme.colors.mobileMenuBg || theme.colors.cardBackground)) : 'transparent',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        backdropFilter: shouldCollapseSidebar ? 'blur(10px)' : undefined,
        borderRight: shouldCollapseSidebar ? `1px solid ${theme.colors.border}` : 'none',
        transition: 'all 0.3s ease',
        boxShadow: theme.isDarkMode && shouldCollapseSidebar ? 'inset 0 0 0 1px rgba(255,255,255,0.02)' : undefined
    };

    const overlayStyle = {
        position: 'absolute',
        inset: 0,
        background: theme.colors.overlay,
        zIndex: -1,
        pointerEvents: 'none'
    };

    return (
        <div className="sidebar" style={sidebarStyle}>
            <SidebarContent compact={false} />
        </div>
    );
};

export default Sidebar;