import React, { useState, useEffect } from 'react';
import ProfilePhoto from '../ProfilePhoto';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const Sidebar = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const sidebarStyle = {
        width: '20%',
        padding: '5rem 2rem 2rem 6rem',
        display: isMobile ? 'none' : 'flex', // Hide on mobile
        flexDirection: 'column',
        justifyContent: 'flex-start',
        background: 'transparent',
        borderRight: '1px solid rgba(78, 205, 196, 0.15)',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.3s ease'
    };

    const overlayStyle = {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(250,250,250,0.35), rgba(250,250,250,0))', 
        zIndex: -1
    };

    const nameStyle = {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#333',
        marginBottom: '0.5rem'
    };

    const taglineStyle = {
        fontSize: '1rem',
        color: '#666',
        lineHeight: 1.5,
        marginBottom: '0.5rem'
    };

    const emailStyle = {
        color: '#4ECDC4',
        textDecoration: 'none',
        fontSize: '0.95rem',
        marginBottom: '2rem',
        display: 'inline-block'
    };

    const socialLinksStyle = {
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem'
    };

    const socialLinkStyle = {
        color: '#666',
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
                <div style={taglineStyle}>Working on exciting things!</div>
                <a href="mailto:ramya1@stanford.edu" style={emailStyle}>ramya1@stanford.edu</a>
            </div>

            <div style={socialLinksStyle}>
                <a href="https://github.com/riyer8" style={socialLinkStyle} title="GitHub"><FaGithub /></a>
                <a href="https://www.linkedin.com/in/ramya-i/" style={socialLinkStyle} title="LinkedIn"><FaLinkedinIn /></a>
                <a href="mailto:ramya1@stanford.edu" style={socialLinkStyle} title="Email">💌</a>
                <a href="#" style={socialLinkStyle} title="Surprise Me">✨</a>
            </div>
        </div>
    );
};

export default Sidebar;