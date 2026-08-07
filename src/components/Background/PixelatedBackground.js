import React, { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext/ThemeContext';

const PixelatedBackground = () => {
    const { theme } = useTheme();
    const canvasRef = useRef(null);
    const animRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const mouse = { x: 0, y: 0 };
        const targetMouse = { x: 0, y: 0 };

        const handleMouseMove = (e) => {
            targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            targetMouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const blobs = Array.from({ length: 6 }, () => ({
            baseX: Math.random() * window.innerWidth,
            baseY: Math.random() * window.innerHeight,
            radius: Math.random() * 180 + 140,
            phase: Math.random() * Math.PI * 2,
            depth: Math.random() * 0.6 + 0.4,
        }));

        const lerp = (a, b, t) => a + (b - a) * t;

        const draw = () => {
            time += 0.0015;

            mouse.x = lerp(mouse.x, targetMouse.x, 0.05);
            mouse.y = lerp(mouse.y, targetMouse.y, 0.05);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.filter = 'blur(40px)';

            blobs.forEach((b, i) => {
                const t = time + b.phase;

                const movement = 60 * b.depth;

                let x = b.baseX + Math.sin(t * 0.2 * b.depth) * movement;
                let y = b.baseY + Math.cos(t * 0.2 * b.depth) * movement;

                const parallaxStrength = 100;
                x += mouse.x * parallaxStrength * b.depth;
                y += mouse.y * parallaxStrength * b.depth;

                const opacity = 0.03 + Math.sin(t * 0.4) * 0.015;

                const hueShift = Math.sin(time * 0.1 + i) * 10;

                const base = theme.isDarkMode
                    ? [180 + hueShift, 200, 255]
                    : [100, 120 + hueShift, 220];

                const color = `${base[0]}, ${base[1]}, ${base[2]}`;

                const grad = ctx.createRadialGradient(x, y, 0, x, y, b.radius);
                grad.addColorStop(0, `rgba(${color}, ${opacity})`);
                grad.addColorStop(1, `rgba(${color}, 0)`);

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, b.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            const lightX = canvas.width / 2 + mouse.x * canvas.width * 0.5;
            const lightY = canvas.height / 2 + mouse.y * canvas.height * 0.5;

            const lightRadius = 300;

            const lightGradient = ctx.createRadialGradient(
                lightX,
                lightY,
                0,
                lightX,
                lightY,
                lightRadius
            );

            lightGradient.addColorStop(0, 'rgba(255,255,255, 0.08)');
            lightGradient.addColorStop(0.4, 'rgba(255,255,255, 0.04)');
            lightGradient.addColorStop(1, 'rgba(255,255,255, 0)');

            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = lightGradient;
            ctx.beginPath();
            ctx.arc(lightX, lightY, lightRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';

            ctx.filter = 'none';

            animRef.current = requestAnimationFrame(draw);
        };

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReduced) {
            animRef.current = requestAnimationFrame(draw);
        }

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [theme.isDarkMode]);

    const backgroundStyle = {
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundColor: theme.colors.background,
        transition: 'background-color 0.3s ease',
    };

    const gridStyle = {
        position: 'absolute',
        inset: 0,
        backgroundImage: `
            linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px),
            linear-gradient(0deg, ${theme.colors.border} 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: theme.isDarkMode ? 0.28 : 0.45,
    };

    const colorOverlayStyle = {
        position: 'absolute',
        inset: 0,
        backgroundImage: `
            radial-gradient(ellipse at 20% 30%, ${theme.colors.backgroundAccentPrimary} 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, ${theme.colors.backgroundAccentSecondary} 0%, transparent 55%)
        `,
        backgroundSize: '140% 140%, 140% 140%',
        backgroundPosition: '0% 0%, 100% 100%',
        animation: 'colorFloat 60s ease-in-out infinite',
    };

    const vignetteStyle = {
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, transparent 55%, ${
            theme.isDarkMode ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.10)'
        } 100%)`,
        pointerEvents: 'none',
    };

    const canvasStyle = {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
    };

    return (
        <>
            <style>{`
                @keyframes colorFloat {
                    0%   { background-position: 0% 0%, 100% 100%; opacity: 0.95; }
                    50%  { background-position: 6% 4%, 94% 96%;  opacity: 1;    }
                    100% { background-position: 0% 0%, 100% 100%; opacity: 0.95; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .pixel-color {
                        animation: none !important;
                    }
                }
            `}</style>

            <div style={backgroundStyle}>
                <div style={gridStyle} />
                <div className="pixel-color" style={colorOverlayStyle} />
                <canvas ref={canvasRef} style={canvasStyle} />
                <div style={vignetteStyle} />
            </div>
        </>
    );
};

export default PixelatedBackground;