import React, { useState, useEffect } from 'react';
import ProfilePhoto from '../ProfilePhoto';
import { useTheme } from '../../context/ThemeContext';
import {FaGithub, FaLinkedinIn, FaEnvelope} from 'react-icons/fa';

const Sidebar = () => {
    const { theme } = useTheme();
    const [isMobile, setIsMobile] = useState(false);
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const currentActivities = [
        "building AI applications 🤖",
        "researching about PCOS 🧬",
        "planning my senior courses 🎓",
        "creating this website 💻",
        "reading a book at a NY cafe ☕️",
        "thinking about consumer products 🛍️"
    ];

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleActivityClick = () => {
        setIsTransitioning(true);
        
        setTimeout(() => {
            setCurrentActivityIndex((prevIndex) => 
                (prevIndex + 1) % currentActivities.length
            );
            setIsTransitioning(false);
        }, 200);
    };

    const sidebarStyle = {
        width: '20%',
        padding: '5rem 2rem 2rem 6rem',
        display: isMobile ? 'none' : 'flex',
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

    const nameStyle = {
        fontSize: '2rem',
        fontWeight: 700,
        color: theme.colors.text,
        marginBottom: '0.5rem'
    };

    const taglineStyle = {
        fontSize: '1rem',
        color: theme.colors.textSecondary,
        lineHeight: 1.5,
        marginBottom: '0.5rem'
    };

    const emailStyle = {
        color: theme.colors.accent,
        textDecoration: 'none',
        fontSize: '0.95rem',
        marginBottom: '1rem',
        display: 'inline-block'
    };

    const currentlyStyle = {
        marginBottom: '2rem'
    };

    const currentlyLabelStyle = {
        fontSize: '0.9rem',
        color: theme.colors.textSecondary,
        marginBottom: '0.3rem'
    };

    const activityTextStyle = {
        color: theme.colors.accent,
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'opacity 0.4s ease',
        opacity: isTransitioning ? 0 : 1,
        userSelect: 'none'
    };

    const socialLinksStyle = {
        marginTop: '0rem',
        display: 'flex',
        gap: '1rem'
    };

    const socialLinkStyle = {
        color: theme.colors.textSecondary,
        fontSize: '1.2rem',
        textDecoration: 'none',
        transition: 'color 0.3s ease'
    };

    return (
        <div style={sidebarStyle}>
            <div style={overlayStyle}></div>

            <ProfilePhoto />

            <div>
                <h1 style={nameStyle}>Ramya Iyer</h1>
                <div style={taglineStyle}>CS (AI) + Math @ Stanford</div>
                <a href="mailto:ramya1@stanford.edu" style={emailStyle}>ramya1@stanford.edu</a>

                <div style={currentlyStyle}>
                    <div style={currentlyLabelStyle}>I'm currently...</div>
                    <div 
                        style={activityTextStyle}
                        onClick={handleActivityClick}
                        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.target.style.opacity = isTransitioning ? '0' : '1'}
                        title="click around!"
                    >
                        {currentActivities[currentActivityIndex]}
                    </div>
                </div>
            </div>

            <div style={socialLinksStyle}>
                <a href="https://github.com/riyer8" style={socialLinkStyle} title="GitHub"><FaGithub /></a>
                <a href="https://www.linkedin.com/in/ramya-i/" style={socialLinkStyle} title="LinkedIn"><FaLinkedinIn /></a>
                <a href="mailto:ramya1@stanford.edu" style={socialLinkStyle} title="Email"><FaEnvelope/></a>
            </div>
        </div>
    );
};

export default Sidebar;