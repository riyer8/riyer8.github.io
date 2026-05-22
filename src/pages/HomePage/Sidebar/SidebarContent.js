import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePhoto from '../ProfilePhoto';
import { FaGithub, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { RiTwitterXLine } from 'react-icons/ri';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';

const SidebarContent = ({ compact = false }) => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const taglineRef = useRef(null);
    const containerRef = useRef(null);
    const [fontSize, setFontSize] = useState(16); // default 16px

    const [isHoveringName, setIsHoveringName] = useState(false);

    // Dynamically shrink tagline to fit one line
    useEffect(() => {
        const adjustFontSize = () => {
            if (!taglineRef.current || !containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            let newFontSize = 16; // start font size
            taglineRef.current.style.fontSize = `${newFontSize}px`;

            while (taglineRef.current.scrollWidth > containerWidth && newFontSize > 10) {
                newFontSize -= 1;
                taglineRef.current.style.fontSize = `${newFontSize}px`;
            }

            setFontSize(newFontSize);
        };

        adjustFontSize();
        window.addEventListener('resize', adjustFontSize);

        return () => window.removeEventListener('resize', adjustFontSize);
    }, []);

    const nameStyle = {
        fontSize: compact ? '2rem' : '2rem',
        fontWeight: 700,
        color: isHoveringName ? undefined : theme.colors.text,
        marginBottom: '0.5rem',
        marginTop: compact ? '1rem' : undefined,
        textAlign: 'center',
        cursor: 'pointer',
        animation: isHoveringName ? 'blueGreenText 2s linear infinite alternate' : 'none',
        transition: 'color 1s ease',
    };

    const taglineStyle = {
        fontSize: `${fontSize}px`,
        color: theme.colors.textSecondary,
        lineHeight: 1.5,
        marginBottom: '0.5rem',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const emailStyle = {
        color: theme.colors.accent,
        textDecoration: 'none',
        fontSize: '0.95rem',
        marginBottom: compact ? '1.2rem' : '1rem',
        display: 'inline-block',
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
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <>
            <style>
                {`
                @keyframes blueGreenText {
                    0% { color: #0055ffff; }
                    100% { color: #14815eff; }
                }
                `}
            </style>

            <div
                ref={containerRef}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: compact ? 'flex-start' : 'center',
                    width: '100%',
                    textAlign: 'center',
                    fontFamily: theme.fonts?.base || 'sans-serif',
                }}
            >
                <ProfilePhoto />

                <h1
                    style={nameStyle}
                    onMouseEnter={() => setIsHoveringName(true)}
                    onMouseLeave={() => setIsHoveringName(false)}
                    onClick={() => navigate('/ramya')}
                >
                    Ramya Iyer
                </h1>

                <div ref={taglineRef} style={taglineStyle}>
                    CS (AI) • Math • History Minor
                </div>

                <a href="mailto:ramya1@stanford.edu" style={emailStyle}>
                    ramya1@stanford.edu
                </a>

                <div style={socialLinksStyle}>
                    <a
                        href="https://github.com/riyer8"
                        style={socialLinkStyle}
                        onMouseEnter={e => (e.currentTarget.style.color = theme.colors.accent)}
                        onMouseLeave={e => (e.currentTarget.style.color = theme.colors.textSecondary)}
                    >
                        <FaGithub />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/ramya-i/"
                        style={socialLinkStyle}
                        onMouseEnter={e => (e.currentTarget.style.color = theme.colors.accent)}
                        onMouseLeave={e => (e.currentTarget.style.color = theme.colors.textSecondary)}
                    >
                        <FaLinkedinIn />
                    </a>
                    <a
                        href="https://x.com/ramya_iyer1"
                        style={socialLinkStyle}
                        onMouseEnter={e => (e.currentTarget.style.color = theme.colors.accent)}
                        onMouseLeave={e => (e.currentTarget.style.color = theme.colors.textSecondary)}
                    >
                        <RiTwitterXLine />
                    </a>
                    <a
                        href="mailto:ramya1@stanford.edu"
                        style={socialLinkStyle}
                        onMouseEnter={e => (e.currentTarget.style.color = theme.colors.accent)}
                        onMouseLeave={e => (e.currentTarget.style.color = theme.colors.textSecondary)}
                    >
                        <FaEnvelope />
                    </a>
                </div>
            </div>
        </>
    );
};

export default SidebarContent;