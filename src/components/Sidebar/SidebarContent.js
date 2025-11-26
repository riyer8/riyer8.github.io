import React, { useState, useEffect } from 'react';
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
    const [displayText, setDisplayText] = useState("");
    const [typingIndex, setTypingIndex] = useState(0);
    const fullText = currentActivities[currentActivityIndex];

    useEffect(() => {
        if (typingIndex < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayText(fullText.slice(0, typingIndex + 1));
                setTypingIndex(typingIndex + 1);
            }, 40);

            return () => clearTimeout(timeout);
        }
    }, [typingIndex, fullText]);

    const handleActivityClick = () => {
        const nextIndex = (currentActivityIndex + 1) % currentActivities.length;
        setCurrentActivityIndex(nextIndex);
        setDisplayText("");
        setTypingIndex(0);
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
        userSelect: 'none',
        textAlign: 'center',
        whiteSpace: 'pre',
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
                    title="click to cycle!"
                >
                    {displayText}
                    <span style={{ opacity: 0.6 }}>|</span> {/* blinking cursor */}
                </div>
            </div>
            <div style={socialLinksStyle}>
                <a href="https://github.com/riyer8" style={socialLinkStyle}><FaGithub /></a>
                <a href="https://www.linkedin.com/in/ramya-i/" style={socialLinkStyle}><FaLinkedinIn /></a>
                <a href="mailto:ramya1@stanford.edu" style={socialLinkStyle}><FaEnvelope /></a>
            </div>
        </div>
    );
};

export default SidebarContent;
