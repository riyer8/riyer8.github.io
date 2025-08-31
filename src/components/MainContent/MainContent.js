import React, { useState, useEffect } from 'react';
import StatusWidget from '../StatusWidget';
import ProfilePhoto from '../ProfilePhoto';
import { FaGithub, FaLinkedinIn, FaBars, FaTimes } from 'react-icons/fa';

const MainContent = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const contentStyle = {
        flex: 1,
        padding: isMobile ? '1rem' : '3rem 6rem 3rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Changed from 'flex-start' to 'center'
        justifyContent: 'flex-start',
        minHeight: '100vh',
        position: 'relative',
        transition: 'padding 0.3s ease'
    };

    const mobileHeaderStyle = {
        display: isMobile ? 'flex' : 'none',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2rem 2rem 1.5rem 2rem', // Increased top and side padding
        borderBottom: '1px solid rgba(78, 205, 196, 0.15)',
        marginBottom: '2rem',
        width: '100%',
        transition: 'all 0.3s ease'
    };

    const hamburgerStyle = {
        fontSize: '1.5rem',
        color: '#333',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: '0.5rem',
        marginRight: '0.5rem', // Added right margin for the hamburger
        transition: 'transform 0.3s ease'
    };

    const mobileMenuStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(to right, rgba(250,250,250,0.95), rgba(250,250,250,0.85))',
        zIndex: 1000,
        display: isMobileMenuOpen ? 'flex' : 'none',
        flexDirection: 'column',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        opacity: isMobileMenuOpen ? 1 : 0,
        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'all 0.3s ease'
    };

    const mobileMenuHeaderStyle = {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '1rem',
        height: '60px' // Fixed header height
    };

    const closeButtonStyle = {
        fontSize: '1.1rem',
        color: '#4ECDC4',
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
        flex: 1, // Take up remaining space
        paddingBottom: '4rem' // Add some bottom padding
    };

    const mobileNameStyle = {
        fontSize: '1.8rem',
        fontWeight: 700,
        color: '#333',
        marginBottom: '0.5rem',
        marginTop: '1rem'
    };

    const mobileTaglineStyle = {
        fontSize: '1rem',
        color: '#666',
        lineHeight: 1.5,
        marginBottom: '0.5rem'
    };

    const mobileEmailStyle = {
        color: '#4ECDC4',
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
        color: '#666',
        fontSize: '1.5rem',
        textDecoration: 'none',
        transition: 'color 0.3s ease'
    };

    const sectionStyle = { 
        maxWidth: isMobile ? '100%' : '800px',
        width: '100%',
        textAlign: 'center', // Added to center the content within the section
        transition: 'max-width 0.3s ease'
    };

    const headingStyle = {
        fontSize: isMobile ? '2rem' : '2.5rem',
        fontWeight: 600,
        color: '#333',
        marginBottom: '1.5rem',
        lineHeight: 1.2,
        transition: 'font-size 0.3s ease'
    };

    const brandStyle = {
        fontSize: '1.2rem',
        fontWeight: 600,
        color: '#4ECDC4',
        marginLeft: '0.5rem' // Added left margin for the name
    };

    return (
        <>
            <div style={contentStyle}>
                {/* Mobile Header */}
                <div style={mobileHeaderStyle}>
                    <div style={brandStyle}>Ramya Iyer</div>
                    <button 
                        style={hamburgerStyle} 
                        onClick={toggleMobileMenu}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
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
            </div>

            {/* Mobile Menu Overlay */}
            {isMobile && (
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