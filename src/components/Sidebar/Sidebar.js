import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SidebarContent from './SidebarContent';

const Sidebar = () => {
    const { theme } = useTheme();
    const [shouldCollapseSidebar, setShouldCollapseSidebar] = useState(false);
    // ...existing code...

    useEffect(() => {
        const checkScreenSize = () => {
            setShouldCollapseSidebar(window.innerWidth <= 900); // Same breakpoint as MainContent
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // ...existing code...

    const sidebarStyle = {
        width: '20%',
        padding: '5rem 2rem 2rem 6rem',
        display: shouldCollapseSidebar ? 'none' : 'flex', // Hide when collapsed
        flexDirection: 'column',
        justifyContent: 'flex-start',
        background: 'transparent',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.3s ease'
    };

    const overlayStyle = {
        position: 'absolute',
        inset: 0,
        background: theme.colors.overlay,
        zIndex: -1
    };

    // ...existing code...

    return (
        <div style={sidebarStyle}>
            <div style={overlayStyle}></div>
            <SidebarContent compact={false} />
        </div>
    );
};

export default Sidebar;