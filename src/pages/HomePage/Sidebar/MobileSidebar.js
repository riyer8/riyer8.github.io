import { useEffect } from 'react';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';
import SidebarContent from './SidebarContent';

const MobileSidebar = ({ isOpen, onClose }) => {
    const { theme } = useTheme();
    
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            const scrollY = window.scrollY;
            document.addEventListener('keydown', handleKeyDown);

            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10));

            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';

            window.scrollTo(0, scrollY);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isOpen, onClose]);

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: theme.isDarkMode
            ? 'rgba(0,0,0,0.6)'
            : 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(2px)',
        zIndex: 2000,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 0.25s ease',
    };


    const sidebarStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '80vw',
        maxWidth: '360px',
        height: '100vh',

        background: theme.colors.cardBackground,
        padding: '5rem 2rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',

        borderRight: `1px solid ${theme.colors.border}`,
        boxShadow: theme.isDarkMode
            ? 'inset 0 0 0 1px rgba(255,255,255,0.02)'
            : 'none',

        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.35s cubic-bezier(.77,.2,.05,1)',

        zIndex: 2100,
        boxSizing: 'border-box',
        fontFamily: theme.fonts?.base || 'var(--font-ui)',
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

    return (
        <>
            <div style={overlayStyle} onClick={onClose} aria-hidden="true" />
            <aside style={sidebarStyle} aria-label="Ramya Iyer profile and navigation" aria-hidden={!isOpen}>
                <button
                    style={closeBtnStyle}
                    onClick={onClose}
                    title="Close sidebar"
                    aria-label="Close sidebar"
                >
                    ×
                </button>

                <SidebarContent compact />
            </aside>
        </>
    );
};

export default MobileSidebar;
