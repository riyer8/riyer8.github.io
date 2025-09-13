import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import SidebarContent from './SidebarContent';

const MobileSidebar = ({ isOpen, onClose }) => {
    const { theme } = useTheme();
    const [currentActivityIndex, setCurrentActivityIndex] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    const handleActivityClick = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentActivityIndex((prevIndex) => (prevIndex + 1) % currentActivities.length);
            setIsTransitioning(false);
        }, 200);
    };

    // Sidebar slide-in and overlay styles
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(30, 30, 30, 0.65)',
        zIndex: 2000,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 2s ease',
    };

    const sidebarStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '350px',
        maxWidth: '90vw',
        height: '100vh',
        background: theme.colors.sidebarBg || '#fff',
        boxShadow: '2px 0 24px rgba(0,0,0,0.18)',
        zIndex: 2100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2.5rem 2rem 2rem 2rem',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.35s cubic-bezier(.77,.2,.05,1)',
        borderTopRightRadius: '18px',
        borderBottomRightRadius: '18px',
        boxSizing: 'border-box',
        backgroundImage: 'linear-gradient(135deg, #fff 80%, #f7eaff 100%)',
    };

    const closeBtnStyle = {
        position: 'absolute',
        top: '1.2rem',
        right: '1.2rem',
        fontSize: '1.5rem',
        color: theme.colors.accent,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        zIndex: 2200,
        transition: 'color 0.2s',
    };

    const nameStyle = {
        fontSize: '2rem',
        fontWeight: 700,
        color: theme.colors.text,
        marginBottom: '0.5rem',
        marginTop: '1rem',
        textAlign: 'center',
    };

    const taglineStyle = {
        fontSize: '1rem',
        color: theme.colors.textSecondary,
        lineHeight: 1.5,
        marginBottom: '0.5rem',
        textAlign: 'center',
    };

    const emailStyle = {
        color: theme.colors.accent,
        textDecoration: 'none',
        fontSize: '0.95rem',
        marginBottom: '1.2rem',
        display: 'inline-block',
        textAlign: 'center',
    };

    const socialLinksStyle = {
        marginTop: '0.5rem',
        display: 'flex',
        gap: '1.2rem',
        justifyContent: 'center',
    };

    const socialLinkStyle = {
        color: theme.colors.textSecondary,
        fontSize: '1.4rem',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
    };

    return (
        <>
            <div style={overlayStyle} onClick={onClose} />
            <aside style={sidebarStyle}>
                <button style={closeBtnStyle} onClick={onClose} title="Close sidebar">×</button>
                <SidebarContent compact={true} />
            </aside>
        </>
    );
};

export default MobileSidebar;
