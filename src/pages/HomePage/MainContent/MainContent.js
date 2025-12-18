import React, { useState, useEffect } from 'react';
import StatusWidget from '../StatusWidget/StatusWidget';
import MobileSidebar from '../Sidebar/MobileSidebar';
import BookshelfSection from './BookshelfSection';
import QuoteWidget from '../QuoteWidget/QuoteWidget';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';
import { FaBars } from 'react-icons/fa';
import Footer from '../Footer/Footer';

const MainContent = () => {
    const { theme } = useTheme();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
        isDesktop: window.innerWidth > 1024,
        shouldCollapseSidebar: window.innerWidth <= 900,
    });

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setScreenSize({
                width,
                isMobile: width <= 768,
                isTablet: width > 768 && width <= 1024,
                isDesktop: width > 1024,
                shouldCollapseSidebar: width <= 900,
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

    /* =======================
       Layout Styles
    ======================== */

    const pageLayoutStyle = {
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
    };

    const mainColumnStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const centeredContentStyle = {
        width: '100%',
        maxWidth: '900px',
        padding: shouldCollapseSidebar ? '1.25rem' : '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
    };

    const mobileHeaderStyle = {
        display: shouldCollapseSidebar ? 'flex' : 'none',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '1.5rem 0 2rem',
        width: '100%',
        boxSizing: 'border-box',
    };

    const hamburgerStyle = {
        fontSize: '1.8rem',
        color: theme.colors.accent,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: '0.5rem',
        transition: 'transform 0.2s ease',
    };

    const sectionStyle = {
        width: '100%',
        maxWidth: '800px',
        marginBottom: '2.5rem',
        textAlign: 'center',
    };

    const headingStyle = {
        fontSize: shouldCollapseSidebar ? '1.9rem' : '2.5rem',
        fontWeight: 600,
        color: theme.colors.text,
        marginBottom: '1.6rem',
        lineHeight: 1.2,
    };

    /* Center text inside buttons for BookshelfSection */
    const bookshelfButtonWrapperStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        width: '100%',
    };

    const bookshelfButtonStyle = {
        width: '100%',
        maxWidth: '300px',
        textAlign: 'center',
        padding: '0.8rem 1.2rem',
        borderRadius: '8px',
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.cardBackground,
        color: theme.colors.text,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    };

    return (
        <>
            <div style={pageLayoutStyle}>
                {/* MAIN COLUMN */}
                <div style={mainColumnStyle}>
                    {/* CENTERED CONTENT */}
                    <div style={centeredContentStyle}>
                        <div style={mobileHeaderStyle}>
                            <button
                                style={hamburgerStyle}
                                onClick={openMobileSidebar}
                                aria-label="Open sidebar"
                            >
                                <FaBars />
                            </button>
                        </div>

                        <div style={sectionStyle}>
                            <h2 style={headingStyle}>Welcome to my mind!</h2>
                            <StatusWidget />
                            <QuoteWidget />
                        </div>

                        <BookshelfSection screenSize={screenSize} buttonWrapperStyle={bookshelfButtonWrapperStyle} buttonStyle={bookshelfButtonStyle} />
                    </div>

                    {/* FULL-WIDTH FOOTER */}
                    <Footer />
                </div>

                {/* SIDEBAR OVERLAY (mobile only) */}
                {shouldCollapseSidebar && (
                    <MobileSidebar
                        isOpen={isMobileSidebarOpen}
                        onClose={closeMobileSidebar}
                    />
                )}
            </div>
        </>
    );
};

export default MainContent;