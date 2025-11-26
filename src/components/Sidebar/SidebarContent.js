import React, { useState, useEffect, useRef } from 'react';
import ProfilePhoto from '../ProfilePhoto';
import { FaGithub, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const currentActivities = [
    "building AI agents 🤖",
    "researching about PCOS 🧬",
    "planning my senior courses 🎓",
    "creating this website 💻",
    "reading a book at a SF cafe ☕️",
    "thinking about consumer products 🛍️",
    "hiking at the Stanford Dish 🌳"
];

const SidebarContent = ({ compact = false }) => {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    const fullText = currentActivities[currentIndex];

    useEffect(() => {
        const blink = setInterval(() => {
            setCursorVisible(v => !v);
        }, 500);
        return () => clearInterval(blink);
    }, []);

    useEffect(() => {
        if (isPaused) return;

        const typingSpeed = isDeleting
            ? 50 + Math.random() * 20
            : 35 + Math.random() * 25;

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayText.length < fullText.length) {
                    setDisplayText(fullText.slice(0, displayText.length + 1));
                } else {
                    setIsPaused(true);
                    setTimeout(() => {
                        setIsPaused(false);
                        setIsDeleting(true);
                    }, 1000);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setCurrentIndex((currentIndex + 1) % currentActivities.length);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, isPaused, fullText, currentIndex]);

    useEffect(() => {
        const interval = setInterval(() => {
            instantAdvance();
        }, 15000);

        return () => clearInterval(interval);
    });

    const instantAdvance = () => {
        setIsPaused(false);
        setIsDeleting(false);
        setDisplayText("");
        setCurrentIndex((i) => (i + 1) % currentActivities.length);
    };

    const handleActivityClick = () => {
        instantAdvance();
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
        cursor: "pointer",
        userSelect: "none",
        textAlign: "center",
        whiteSpace: "normal",
        wordWrap: "break-word",
        maxWidth: "90%",
        margin: "0 auto",
        lineHeight: 1.4,
        transition: "opacity 0.3s ease",
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
                    <span style={{
                        opacity: cursorVisible ? 1 : 0.2,
                        transition: "opacity 0.2s ease"
                    }}>
                        |
                    </span>
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
