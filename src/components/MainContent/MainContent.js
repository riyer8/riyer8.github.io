import React, { useState, useEffect } from 'react';
import { StatusWidget, ProfilePhoto, ThemeToggle } from '../../components';
import BookshelfSection from './BookshelfSection';
import { useTheme } from '../../context/ThemeContext';
import { FaGithub, FaLinkedinIn, FaBars } from 'react-icons/fa';

const MainContent = () => {
    const { theme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

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
        transition: 'padding 0.3s ease',
        maxWidth: '100%', // Prevent horizontal overflow
        boxSizing: 'border-box'
    };

    const mobileHeaderStyle = {
        display: shouldCollapseSidebar ? 'flex' : 'none',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2rem 2rem 1.5rem 2rem',
        borderBottom: `1px solid ${theme.colors.border}`,
        marginBottom: '2rem',
        width: '100%',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box'
    };

    const hamburgerStyle = {
        fontSize: '1.5rem',
        color: theme.colors.text,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: '0.5rem',
        marginRight: '0.5rem',
        transition: 'transform 0.3s ease'
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
        transition: 'max-width 0.3s ease',
        boxSizing: 'border-box'
    };

    const headingStyle = {
        fontSize: getResponsiveSize('1.8rem', '2.2rem', '2.5rem'),
        fontWeight: 600,
        color: theme.colors.text,
        marginBottom: '1.5rem',
        lineHeight: 1.2,
        transition: 'font-size 0.3s ease'
    };

    // Mobile menu styles
    const mobileMenuStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: theme.colors.mobileMenuBg,
        zIndex: 1000,
        display: isMobileMenuOpen ? 'flex' : 'none',
        flexDirection: 'column',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        opacity: isMobileMenuOpen ? 1 : 0,
        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box'
    };

    const mobileMenuHeaderStyle = {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '1rem',
        height: '60px'
    };

    const closeButtonStyle = {
        fontSize: '1.1rem',
        color: theme.colors.accent,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: '0.5rem 1rem',
        fontWeight: 500,
        transition: 'all 0.3s ease'
    };

    const mobileProfileStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flex: 1,
        paddingBottom: '4rem'
    };

    const mobileNameStyle = {
        fontSize: '1.8rem',
        fontWeight: 700,
        color: theme.colors.text,
        marginBottom: '0.5rem',
        marginTop: '1rem'
    };

    const mobileTaglineStyle = {
        fontSize: '1rem',
        color: theme.colors.textSecondary,
        lineHeight: 1.5,
        marginBottom: '0.5rem'
    };

    const mobileEmailStyle = {
        color: theme.colors.accent,
        textDecoration: 'none',
        fontSize: '0.95rem',
        marginBottom: '2rem',
        display: 'inline-block'
    };

    const mobileSocialLinksStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginTop: '1rem'
    };

    const mobileSocialLinkStyle = {
        color: theme.colors.textSecondary,
        fontSize: '1.5rem',
        textDecoration: 'none',
        transition: 'color 0.3s ease'
    };

    return (
        <>
            {/* Theme Toggle Button */}
            <ThemeToggle />
            
            <div style={contentStyle}>
                {/* Mobile Header */}
                <div style={mobileHeaderStyle}>
                    <div style={brandStyle}>
                        <button 
                            style={hamburgerStyle} 
                            onClick={toggleMobileMenu}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            <FaBars />
                        </button>
                    </div>
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

            {/* Mobile Menu Overlay */}
            {shouldCollapseSidebar && (
                <div style={mobileMenuStyle}>
                    <div style={mobileMenuHeaderStyle}>
                        <button 
                            style={closeButtonStyle} 
                            onClick={toggleMobileMenu}
                            onMouseEnter={(e) => e.target.style.transform = 'translateX(-3px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateX(0)'}
                        >
                            ← Back
                        </button>
                        <div></div>
                    </div>

                    <div style={mobileProfileStyle}>
                        <ProfilePhoto />
                        <h1 style={mobileNameStyle}>Ramya Iyer</h1>
                        <div style={mobileTaglineStyle}>CS (AI) + Math @ Stanford</div>
                        <div style={mobileTaglineStyle}>Working on exciting things!</div>
                        <a href="mailto:ramya1@stanford.edu" style={mobileEmailStyle}>ramya1@stanford.edu</a>
                        
                        <div style={mobileSocialLinksStyle}>
                            <a href="https://github.com/riyer8" style={mobileSocialLinkStyle} title="GitHub"><FaGithub /></a>
                            <a href="https://www.linkedin.com/in/ramya-i/" style={mobileSocialLinkStyle} title="LinkedIn"><FaLinkedinIn /></a>
                            <a href="mailto:ramya1@stanford.edu" style={mobileSocialLinkStyle} title="Email">💌</a>
                            <a href="#" style={mobileSocialLinkStyle} title="Surprise Me">✨</a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MainContent;