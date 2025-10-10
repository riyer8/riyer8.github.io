import React, { useState, useEffect, use } from 'react';
import { StatusWidget, ProfilePhoto, ThemeToggle } from '../../components';
import MobileSidebar from '../Sidebar/MobileSidebar';
import BookshelfSection from './BookshelfSection';
import { useTheme } from '../../context/ThemeContext';
import { FaBars } from 'react-icons/fa';

const MainContent = () => {
    const { theme } = useTheme();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
        isDesktop: window.innerWidth > 1024,
        shouldCollapseSidebar: window.innerWidth <= 900 // New breakpoint for sidebar collapse
    });

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setScreenSize({
                width,
                isMobile: width <= 768,
                isTablet: width > 768 && width <= 1024,
                isDesktop: width > 1024,
                shouldCollapseSidebar: width <= 900 // Collapse sidebar earlier to prevent cutoff
            });
        };

        const debouncedResize = (() => {
            let timeoutId;
            return () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(checkScreenSize, 150);
            };
        })();

        checkScreenSize();
        window.addEventListener('resize', debouncedResize);
        return () => window.removeEventListener('resize', debouncedResize);
    }, []);

    const { shouldCollapseSidebar } = screenSize;

    const openMobileSidebar = () => setIsMobileSidebarOpen(true);
    const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

    // Responsive sizing utility
    const getResponsiveSize = (mobileSize, tabletSize, desktopSize) => {
        if (screenSize.shouldCollapseSidebar) return mobileSize;
        if (screenSize.isTablet) return tabletSize;
        return desktopSize;
    };

    const contentStyle = {
        flex: 1,
        padding: getResponsiveSize('1rem', '2rem 4rem', '3rem 6rem 3rem 3rem'),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        position: 'relative',
        transition: 'none',
        maxWidth: '100%', // Prevent horizontal overflow
        boxSizing: 'border-box'
    };

    const mobileHeaderStyle = {
        display: shouldCollapseSidebar ? 'flex' : 'none',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '2rem 2rem 1.5rem 2rem',
        borderBottom: `1px solid ${theme.colors.border}`,
        marginBottom: '2rem',
        width: '100%',
        transition: 'none',
        boxSizing: 'border-box',
    };

    const hamburgerStyle = {
        fontSize: '1.8rem',
        color: theme.colors.accent,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: '0.5rem',
        marginRight: '0.5rem',
        transition: 'none',
    };

    const brandStyle = {
        fontSize: '1.2rem',
        fontWeight: 600,
        color: theme.colors.accent,
        marginLeft: '0.5rem'
    };

    const sectionStyle = { 
        maxWidth: getResponsiveSize('100%', '700px', '800px'),
        width: '100%',
        textAlign: 'center',
        transition: 'none',
        boxSizing: 'border-box'
    };

    const headingStyle = {
        fontSize: getResponsiveSize('1.8rem', '2.2rem', '2.5rem'),
        fontWeight: 600,
        color: theme.colors.text,
        marginBottom: '1.5rem',
        lineHeight: 1.2,
        transition: 'none'
    };

    // ...existing code...

    return (
        <>
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <div style={contentStyle}>
                {/* Mobile Header */}
                <div style={mobileHeaderStyle}>
                    <button
                        style={hamburgerStyle}
                        onClick={openMobileSidebar}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        aria-label="Open sidebar"
                    >
                        <FaBars />
                    </button>
                </div>

                {/* Main Content */}
                <div style={sectionStyle}>
                    <h2 style={headingStyle}>
                        Revamp Coming Soon! 🎉
                    </h2>
                    <StatusWidget />
                </div>

                {/* Bookshelf Section */}
                <BookshelfSection screenSize={screenSize} />
            </div>

            {/* Mobile Sidebar Slide-in */}
            {shouldCollapseSidebar && (
                <MobileSidebar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />
            )}
        </>
    );
};

export default MainContent;