import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';
import { FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';

const Footer = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const footerRef = useRef(null);
    const [visible, setVisible] = useState(false);

    // Scroll reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.15 }
        );

        if (footerRef.current) observer.observe(footerRef.current);
        return () => observer.disconnect();
    }, []);

    const footerStyle = {
        width: '100%',
        marginTop: '3rem',
        padding: '5rem 1.5rem 4.5rem',
        borderTop: `1px solid ${theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2.6rem',
        textAlign: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',

        // scroll animation
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
    };

    // Soft animated background wash
    const backgroundGlowStyle = {
        position: 'absolute',
        inset: 0,
        background: `
            radial-gradient(
                60% 40% at 50% 0%,
                ${theme.colors.accent}22,
                transparent 70%
            )
        `,
        animation: 'footerGlow 12s ease-in-out infinite',
        zIndex: 0,
        pointerEvents: 'none',
    };

    const contentStyle = {
        position: 'relative',
        zIndex: 1,
        maxWidth: '640px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    };


    const titleStyle = {
        fontSize: '2.25rem',
        fontWeight: 600,
        letterSpacing: '-0.03em',
        color: theme.colors.text,
        lineHeight: 1.2,
    };

    const subtitleStyle = {
        fontSize: '1rem',
        color: theme.colors.textSecondary || theme.colors.subtleText,
        maxWidth: '520px',
        lineHeight: 1.6,
        marginTop: '-0.6rem',
    };

    const buttonRowStyle = {
        display: 'flex',
        gap: '1.2rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '0.6rem',
    };

    const baseButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.55rem',
        padding: '0.95rem 1.65rem',
        fontSize: '0.95rem',
        fontWeight: 500,
        borderRadius: '999px',
        cursor: 'pointer',
        transition: 'all 0.28s ease',
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.cardBackground,
        color: theme.colors.text,
    };

    const primaryButtonStyle = {
        ...baseButtonStyle,
        background: `linear-gradient(
            135deg,
            ${theme.colors.accent},
            ${theme.colors.accentSecondary || theme.colors.accent}
        )`,
        color: '#fff',
        border: 'none',
        boxShadow: `0 12px 34px ${theme.colors.accent}44`,
    };

    const iconStyle = {
        fontSize: '0.9em',
        position: 'relative',
        top: '1px',
        transition: 'transform 0.25s ease',
    };

    const hoverIn = (e, isPrimary = false) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = isPrimary
            ? `0 18px 48px ${theme.colors.accent}66`
            : `0 12px 28px ${theme.colors.shadow}`;

        const icon = e.currentTarget.querySelector('svg');
        if (icon) icon.style.transform = 'translateX(4px)';
    };

    const hoverOut = (e, isPrimary = false) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isPrimary
            ? `0 12px 34px ${theme.colors.accent}44`
            : 'none';

        const icon = e.currentTarget.querySelector('svg');
        if (icon) icon.style.transform = 'translateX(0)';
    };

    return (
        <footer ref={footerRef} style={footerStyle}>
            <div style={backgroundGlowStyle} />

            <div style={contentStyle}>
                <h2 style={titleStyle}>Always looking to talk to cool people</h2>

                <p style={subtitleStyle}>
                    Please say hello!
                </p>

                <div style={buttonRowStyle}>
                    <button
                        style={primaryButtonStyle}
                        onClick={() => {
                            window.location.href = 'mailto:ramya1@stanford.edu';
                        }}
                        onMouseEnter={(e) => hoverIn(e, true)}
                        onMouseLeave={(e) => hoverOut(e, true)}
                    >
                        Email me 💌
                        <FaExternalLinkAlt style={iconStyle} />
                    </button>

                    <button
                        style={baseButtonStyle}
                        onClick={() => navigate('/ramya')}
                        onMouseEnter={hoverIn}
                        onMouseLeave={hoverOut}
                    >
                        Learn about me
                        <FaArrowRight style={iconStyle} />
                    </button>
                </div>
            </div>

            {/* Local keyframes (safe, scoped) */}
            <style>
                {`
                    @keyframes footerGlow {
                        0% { opacity: 0.5; transform: translateY(0); }
                        50% { opacity: 0.8; transform: translateY(6px); }
                        100% { opacity: 0.5; transform: translateY(0); }
                    }
                `}
            </style>
        </footer>
    );
};

export default Footer;
