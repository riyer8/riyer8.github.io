import React, { useState } from 'react';
import ProfilePhoto from '../ProfilePhoto';
import { FaGithub, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const currentActivities = [
    "building AI applications 🤖",
    "researching about PCOS 🧬",
    "planning my senior courses 🎓",
    "creating this website 💻",
    "reading a book at a NY cafe ☕️",
    "thinking about consumer products 🛍️"
];

const SidebarContent = ({ compact = false }) => {
    const { theme } = useTheme();
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleActivityClick = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentActivityIndex((prevIndex) => (prevIndex + 1) % currentActivities.length);
            setIsTransitioning(false);
        }, 200);
    };

    const nameStyle = {
        fontSize: compact ? '2rem' : '2rem',
        fontWeight: 700,
        color: theme.colors.text,
        marginBottom: '0.5rem',
        marginTop: compact ? '1rem' : undefined,
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
        marginBottom: compact ? '1.2rem' : '1rem',
        display: 'inline-block',
        textAlign: 'center',
    };

    const currentlyLabelStyle = {
        fontSize: '0.9rem',
        color: theme.colors.textSecondary,
        marginBottom: '0.3rem',
        textAlign: 'center',
    };

    const activityTextStyle = {
        color: theme.colors.accent,
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'opacity 0.4s ease',
        opacity: isTransitioning ? 0 : 1,
        userSelect: 'none',
        textAlign: 'center',
    };

    const socialLinksStyle = {
        marginTop: compact ? '0.5rem' : '0rem',
        display: 'flex',
        gap: compact ? '1.2rem' : '1rem',
        justifyContent: 'center',
    };

    const socialLinkStyle = {
        color: theme.colors.textSecondary,
        fontSize: compact ? '1.4rem' : '1.2rem',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            textAlign: 'center',
        }}>
            <ProfilePhoto />
            <h1 style={nameStyle}>Ramya Iyer</h1>
            <div style={taglineStyle}>CS (AI) + Math @ Stanford</div>
            <a href="mailto:ramya1@stanford.edu" style={emailStyle}>ramya1@stanford.edu</a>
            <div style={{ marginBottom: compact ? '2rem' : '2rem', width: '100%' }}>
                <div style={currentlyLabelStyle}>I'm currently...</div>
                <div
                    style={activityTextStyle}
                    onClick={handleActivityClick}
                    onMouseEnter={e => e.target.style.opacity = '0.8'}
                    onMouseLeave={e => e.target.style.opacity = isTransitioning ? '0' : '1'}
                    title="click around!"
                >
                    {currentActivities[currentActivityIndex]}
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

export default SidebarContent;
