import React, { useEffect, useRef, useState } from 'react';
import ProfilePhoto from '../ProfilePhoto';
import { FaGithub, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';

const SidebarContent = ({ compact = false }) => {
    const { theme } = useTheme();
    const taglineRef = useRef(null);
    const [useShortHistory, setUseShortHistory] = useState(false);
    const [isHoveringName, setIsHoveringName] = useState(false);

    useEffect(() => {
        const el = taglineRef.current;
        if (!el) return;

        const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight);
        const maxOneLineHeight = lineHeight * 1.8;

        if (el.clientHeight > maxOneLineHeight) {
            setUseShortHistory(true);
        }
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
        <>
            {/* Inject keyframes */}
            <style>
                {`
                @keyframes blueGreenText {
                    0% {
                        color: #0055ffff;
                    }
                    100% {
                        color: #14815eff;
                    }
                }
                `}
            </style>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    textAlign: 'center',
                    fontFamily: theme.fonts?.base || 'sans-serif'
                }}
            >
                <ProfilePhoto />

                <h1
                    style={nameStyle}
                    onMouseEnter={() => setIsHoveringName(true)}
                    onMouseLeave={() => setIsHoveringName(false)}
                    onClick={() => {
                        window.location.href = '/ramya';
                    }}
                >
                    Ramya Iyer
                </h1>

                <div style={taglineStyle} ref={taglineRef}>
                    CS (AI) • Math • {useShortHistory ? "History" : "History Minor"}
                </div>

                <a href="mailto:ramya1@stanford.edu" style={emailStyle}>
                    ramya1@stanford.edu
                </a>

                <div style={socialLinksStyle}>
                    <a href="https://github.com/riyer8" style={socialLinkStyle}>
                        <FaGithub />
                    </a>
                    <a href="https://www.linkedin.com/in/ramya-i/" style={socialLinkStyle}>
                        <FaLinkedinIn />
                    </a>
                    <a href="mailto:ramya1@stanford.edu" style={socialLinkStyle}>
                        <FaEnvelope />
                    </a>
                </div>
            </div>
        </>
    );
};

export default SidebarContent;
