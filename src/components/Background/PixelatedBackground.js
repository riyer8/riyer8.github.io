import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useTheme } from '../ThemeContext/ThemeContext';
import { getSeason, SEASON_PALETTES } from '../../features/seasonal/seasonPalettes';

const STAR_COUNT = 90;
const STAR_RGB = '232, 242, 255';
const FADE_RATE = 3.5;

const createStars = (width, height) =>
    Array.from({ length: STAR_COUNT }, () => {
        const bright = Math.random() < 0.08;
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: bright ? 4 + Math.random() * 2.2 : 1.4 + Math.random() * 1.1,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1.7,
            base: bright ? 1 : 0.72 + Math.random() * 0.28,
            bright,
        };
    });

const spawnShootingStar = (width, height) => {
    const life = 0.45 + Math.random() * 0.3;
    return {
        x: Math.random() * width * 0.65,
        y: Math.random() * height * 0.4,
        vx: 480 + Math.random() * 260,
        vy: 240 + Math.random() * 180,
        life,
        maxLife: life,
        length: 50 + Math.random() * 50,
    };
};

const PixelatedBackground = ({ embedded = false }) => {
    const { theme } = useTheme();
    const prefersReducedMotion = useReducedMotion();
    const [season] = useState(() => getSeason());
    const palette = SEASON_PALETTES[season][theme.isDarkMode ? 'dark' : 'light'];
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const isDarkModeRef = useRef(theme.isDarkMode);
    const reducedMotionRef = useRef(!!prefersReducedMotion);
    const blobBaseRef = useRef(palette.blobBase);
    const seasonRef = useRef(season);

    isDarkModeRef.current = theme.isDarkMode;
    reducedMotionRef.current = !!prefersReducedMotion;
    blobBaseRef.current = palette.blobBase;
    seasonRef.current = season;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let time = 0;
        let twinkleT = 0;
        let starOpacity = 0;
        let lastNow = performance.now();
        let stars = [];
        let shooting = null;
        let shootIn = 12 + Math.random() * 8;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = createStars(canvas.width, canvas.height);
        };
        resize();
        window.addEventListener('resize', resize);

        const mouse = { x: 0, y: 0 };
        const targetMouse = { x: 0, y: 0 };
        let mouseSeen = false;

        const handleMouseMove = (e) => {
            mouseSeen = true;
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

        // Seasonal animation particles — light mode only. Dark mode keeps
        // just the stars. "A touch more" visibility, per the approved
        // prototype: leaves are deliberately transparent (alpha ~0.3),
        // leaf piles are full, and spring is heavy on grass.
        const leaves = Array.from({ length: 16 }, () => ({
            baseX: Math.random() * window.innerWidth,
            baseY: Math.random() * window.innerHeight,
            size: 5 + Math.random() * 7,
            phase: Math.random() * Math.PI * 2,
            fallSpeed: 12 + Math.random() * 18,
            sway: 18 + Math.random() * 28,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 1.4,
            hue: 12 + Math.random() * 30,
            alpha: 0.26 + Math.random() * 0.12,
            // Pointer-interaction state: nudged offset, velocity,
            // how flat the leaf has landed, and whether it has been
            // disturbed since it last wrapped to the top.
            ox: 0,
            oy: 0,
            vx: 0,
            vy: 0,
            flat: 0,
            prevFall: null,
            disturbed: false,
        }));

        // Leaves already settled into piles along the bottom — drawn
        // from fixed positions so they don't flicker.
        const pileLeaves = Array.from({ length: 54 }, (_, i) => {
            const pile = i % 3;
            const pileX = window.innerWidth * (0.16 + pile * 0.34);
            return {
                x: pileX + (Math.random() - 0.5) * 150,
                y:
                    window.innerHeight -
                    6 -
                    Math.random() * Math.random() * 26,
                size: 6 + Math.random() * 8,
                rot: Math.random() * Math.PI * 2,
                hue: 12 + Math.random() * 30,
                alpha: 0.24 + Math.random() * 0.12,
                // Pointer-interaction state: nudged offset that
                // springs back into the pile.
                ox: 0,
                oy: 0,
            };
        });

        const flakes = Array.from({ length: 42 }, () => ({
            baseX: Math.random() * window.innerWidth,
            baseY: Math.random() * window.innerHeight,
            size: 1.5 + Math.random() * 2.5,
            phase: Math.random() * Math.PI * 2,
            fallSpeed: 14 + Math.random() * 22,
            sway: 8 + Math.random() * 18,
            alpha: 0.35 + Math.random() * 0.3,
        }));

        // Spring: lots of grass along the bottom, plus flowers that grow
        // on stems and bloom on a slow cycle.
        const grassBlades = Array.from({ length: 260 }, () => ({
            x: Math.random() * window.innerWidth,
            height: 16 + Math.random() * 40,
            phase: Math.random() * Math.PI * 2,
            lean: (Math.random() - 0.5) * 16,
            green: 110 + Math.random() * 60,
        }));

        // Four flower types at three heights — short, medium, tall —
        // so spring reads as a real mixed bed, not a row of clones.
        const flowers = Array.from({ length: 16 }, (_, i) => {
            const band = i % 3;
            const stem =
                band === 0
                    ? 24 + Math.random() * 12
                    : band === 1
                      ? 40 + Math.random() * 16
                      : 60 + Math.random() * 24;
            const type = ["daisy", "cluster", "tulip", "bell"][i % 4];
            const petalByType = {
                daisy: ["244, 114, 182", "255, 255, 255"],
                cluster: ["167, 139, 250", "244, 114, 182"],
                tulip: ["251, 146, 60", "248, 113, 113"],
                bell: ["56, 189, 248", "167, 139, 250"],
            }[type];
            return {
                x: 30 + Math.random() * (window.innerWidth - 60),
                stem,
                size: 5 + Math.random() * 4,
                phase: Math.random() * Math.PI * 2,
                type,
                petal: petalByType[Math.floor(Math.random() * petalByType.length)],
            };
        });

        const lerp = (a, b, t) => a + (b - a) * t;

        // Crisp 4-point sparkle — small star shapes, never circles.
        // The star loop already sets 'lighter' composite before drawing.
        const drawSparkle = (x, y, outerR, rgb, alpha) => {
            if (outerR <= 0 || alpha <= 0) return;
            const innerR = outerR * 0.2;
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const rad = i % 2 === 0 ? outerR : innerR;
                const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const px = x + Math.cos(a) * rad;
                const py = y + Math.sin(a) * rad;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
            ctx.fill();
        };

        // ---- Seasonal animation (light mode only) ----
        const drawLeafShape = (x, y, size, rot, hue, alpha) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rot);
            ctx.fillStyle = `hsla(${hue}, 78%, 55%, ${alpha})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, size, size * 0.45, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        const drawAutumn = (t) => {
            const h = canvas.height;
            // Cursor position in canvas pixels, the same way the star
            // repulsion derives it. Only once the mouse has actually
            // moved — before that, the smoothed mouse sits at the
            // centre and would shove leaves for no reason.
            const pointer = mouseSeen
                ? {
                      x: canvas.width / 2 + mouse.x * canvas.width * 0.5,
                      y: canvas.height / 2 + mouse.y * canvas.height * 0.5,
                  }
                : null;
            // Settled piles: a leaf near the cursor gets nudged away a
            // little, then springs back into the pile.
            pileLeaves.forEach((leaf) => {
                if (pointer) {
                    const dx = leaf.x - pointer.x;
                    const dy = leaf.y - pointer.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 80 && dist > 0.01) {
                        const push = (80 - dist) / 80;
                        // Same kick feel: mostly sideways, barely any lift.
                        leaf.ox += (dx / dist) * push * 2.5;
                        leaf.oy += (dy / dist) * push * 0.7;
                    }
                }
                leaf.ox = Math.max(-24, Math.min(24, leaf.ox * 0.9));
                leaf.oy = Math.max(-16, Math.min(16, leaf.oy * 0.9));
                drawLeafShape(
                    leaf.x + leaf.ox,
                    leaf.y + leaf.oy,
                    leaf.size,
                    leaf.rot,
                    leaf.hue,
                    leaf.alpha
                );
            });
            // Falling leaves: slow, swaying, transparent. One near the
            // cursor gets pushed away like the dark-mode stars, then
            // gravity pulls it down and it lands flat on the ground
            // until it wraps back to the top.
            leaves.forEach((leaf, i) => {
                const fall = (leaf.baseY + t * leaf.fallSpeed) % (h + 30);
                // Reset the interaction state when the leaf wraps.
                if (leaf.prevFall !== null && fall < leaf.prevFall) {
                    leaf.ox = 0;
                    leaf.oy = 0;
                    leaf.vx = 0;
                    leaf.vy = 0;
                    leaf.flat = 0;
                    leaf.disturbed = false;
                }
                leaf.prevFall = fall;
                const x =
                    leaf.baseX +
                    Math.sin(t * 0.4 + leaf.phase) * leaf.sway +
                    Math.sin(t * 0.13 + i) * 12;
                const y = fall - 15;
                if (pointer) {
                    const dx = x - pointer.x;
                    const dy = y - pointer.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 100 && dist > 0.01) {
                        const push = (100 - dist) / 100;
                        // Kick, not launch: mostly sideways, only a
                        // whisper of vertical, and no upward lift at all.
                        leaf.vx += (dx / dist) * push * 1.6;
                        leaf.vy += (dy / dist) * push * 0.35;
                        // Never let a leaf fly up fast.
                        leaf.vy = Math.max(leaf.vy, -1.2);
                        leaf.disturbed = true;
                    }
                }
                if (leaf.disturbed) {
                    // Stronger gravity so a kicked leaf comes back
                    // down to the bottom quickly.
                    leaf.vy += 0.22;
                    leaf.vx *= 0.94;
                    leaf.vy *= 0.96;
                    leaf.ox += leaf.vx;
                    leaf.oy += leaf.vy;
                    // Cap how far up a leaf can ever go.
                    leaf.ox = Math.max(-40, Math.min(40, leaf.ox));
                    leaf.oy = Math.max(-30, leaf.oy);
                }
                // Land + flatten at the bottom.
                const groundY = h - 12;
                if (y + leaf.oy >= groundY) {
                    leaf.oy = groundY - y;
                    leaf.vy = 0;
                    leaf.vx *= 0.8;
                    leaf.flat = Math.min(1, leaf.flat + 0.08);
                } else if (leaf.flat > 0) {
                    leaf.flat = Math.max(0, leaf.flat - 0.02);
                }
                // Spinning slows as the leaf flattens, ending horizontal.
                const rot =
                    (leaf.rot + t * leaf.rotSpeed) * (1 - leaf.flat);
                drawLeafShape(
                    x + leaf.ox,
                    y + leaf.oy,
                    leaf.size,
                    rot,
                    leaf.hue,
                    leaf.alpha
                );
            });
        };

        const drawSnowman = (x, groundY, scale) => {
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            const circles = [
                { r: 26 * scale, y: groundY - 26 * scale },
                { r: 19 * scale, y: groundY - 62 * scale },
                { r: 13 * scale, y: groundY - 90 * scale },
            ];
            circles.forEach((c) => {
                ctx.beginPath();
                ctx.arc(x, c.y, c.r, 0, Math.PI * 2);
                ctx.fill();
            });
            // Eyes + carrot nose + teal scarf.
            ctx.fillStyle = "rgba(40, 40, 40, 0.9)";
            ctx.beginPath();
            ctx.arc(x - 5 * scale, groundY - 94 * scale, 1.8, 0, Math.PI * 2);
            ctx.arc(x + 5 * scale, groundY - 94 * scale, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(251, 146, 60, 0.9)";
            ctx.beginPath();
            ctx.moveTo(x, groundY - 90 * scale);
            ctx.lineTo(x + 12 * scale, groundY - 87 * scale);
            ctx.lineTo(x, groundY - 84 * scale);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "rgba(78, 205, 196, 0.9)";
            ctx.fillRect(x - 14 * scale, groundY - 78 * scale, 28 * scale, 5 * scale);
        };

        const drawWinter = (t) => {
            const h = canvas.height;
            const w = canvas.width;
            // Snow ground + snow piles along the bottom. No trees —
            // just the snowmen.
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillRect(0, h - 46, w, 46);
            ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
            [0.12, 0.42, 0.68, 0.92].forEach((fx) => {
                ctx.beginPath();
                ctx.ellipse(w * fx, h - 46, 120, 26, 0, Math.PI, Math.PI * 2);
                ctx.fill();
            });
            drawSnowman(w * 0.24, h - 46, 0.85);
            drawSnowman(w * 0.72, h - 46, 1);
            flakes.forEach((flake) => {
                const fall = (flake.baseY + t * flake.fallSpeed) % (h + 10);
                const x = flake.baseX + Math.sin(t * 0.5 + flake.phase) * flake.sway;
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.alpha})`;
                ctx.beginPath();
                ctx.arc(x, fall - 5, flake.size, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const drawSpring = (t) => {
            const h = canvas.height;
            // Grass: many blades swaying along the bottom.
            grassBlades.forEach((blade) => {
                const sway = Math.sin(t * 0.7 + blade.phase) * 4;
                ctx.strokeStyle = "rgba(74, 160, 90, 0.32)";
                ctx.lineWidth = 1.6;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(blade.x, h);
                ctx.quadraticCurveTo(
                    blade.x + blade.lean * 0.4 + sway,
                    h - blade.height * 0.6,
                    blade.x + blade.lean + sway,
                    h - blade.height
                );
                ctx.stroke();
            });
            // Flowers: stem + two leaves + five petals + centre, blooming
            // slowly open and closed on a long cycle.
            flowers.forEach((flower) => {
                const bloom = 0.65 + 0.35 * Math.sin(t * 0.25 + flower.phase);
                const topY = h - flower.stem;
                ctx.strokeStyle = "rgba(74, 160, 90, 0.4)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(flower.x, h);
                ctx.lineTo(flower.x, topY);
                ctx.stroke();
                ctx.fillStyle = "rgba(74, 160, 90, 0.35)";
                ctx.beginPath();
                ctx.ellipse(flower.x - 5, h - flower.stem * 0.45, 6, 2.6, -0.5, 0, Math.PI * 2);
                ctx.ellipse(flower.x + 5, h - flower.stem * 0.65, 6, 2.6, 0.5, 0, Math.PI * 2);
                ctx.fill();
                const size = flower.size;
                if (flower.type === "cluster") {
                    // Round clustered blossom: tiny dots around a centre.
                    ctx.fillStyle = `rgba(${flower.petal}, 0.6)`;
                    for (let p = 0; p < 6; p++) {
                        const a = (p / 6) * Math.PI * 2;
                        ctx.beginPath();
                        ctx.arc(
                            flower.x + Math.cos(a) * size * 0.5 * bloom,
                            topY + Math.sin(a) * size * 0.5 * bloom,
                            size * 0.28 * bloom,
                            0,
                            Math.PI * 2
                        );
                        ctx.fill();
                    }
                    ctx.fillStyle = "rgba(250, 204, 21, 0.6)";
                    ctx.beginPath();
                    ctx.arc(flower.x, topY, size * 0.22 * bloom, 0, Math.PI * 2);
                    ctx.fill();
                } else if (flower.type === "tulip") {
                    // Tulip cup.
                    ctx.fillStyle = `rgba(${flower.petal}, 0.55)`;
                    ctx.beginPath();
                    ctx.moveTo(flower.x - size * 0.5 * bloom, topY + size * 0.5);
                    ctx.quadraticCurveTo(
                        flower.x - size * 0.6 * bloom,
                        topY - size * 0.6 * bloom,
                        flower.x,
                        topY - size * 0.7 * bloom
                    );
                    ctx.quadraticCurveTo(
                        flower.x + size * 0.6 * bloom,
                        topY - size * 0.6 * bloom,
                        flower.x + size * 0.5 * bloom,
                        topY + size * 0.5
                    );
                    ctx.closePath();
                    ctx.fill();
                } else if (flower.type === "bell") {
                    // Tiny bell hanging from the stem top.
                    ctx.fillStyle = `rgba(${flower.petal}, 0.55)`;
                    ctx.beginPath();
                    ctx.moveTo(flower.x - size * 0.3 * bloom, topY - size * 0.7 * bloom);
                    ctx.quadraticCurveTo(
                        flower.x,
                        topY - size * 0.9 * bloom,
                        flower.x + size * 0.3 * bloom,
                        topY - size * 0.7 * bloom
                    );
                    ctx.lineTo(flower.x + size * 0.55 * bloom, topY);
                    ctx.lineTo(flower.x - size * 0.55 * bloom, topY);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Daisy: five petals + yellow centre.
                    ctx.fillStyle = `rgba(${flower.petal}, 0.55)`;
                    for (let p = 0; p < 5; p++) {
                        const a = (p / 5) * Math.PI * 2 + flower.phase;
                        const px = flower.x + Math.cos(a) * size * 0.62 * bloom;
                        const py = topY + Math.sin(a) * size * 0.62 * bloom;
                        ctx.beginPath();
                        ctx.ellipse(px, py, size * 0.55 * bloom, size * 0.34 * bloom, a, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.fillStyle = "rgba(250, 204, 21, 0.6)";
                    ctx.beginPath();
                    ctx.arc(flower.x, topY, size * 0.32 * bloom, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        };

        const drawSummer = (t) => {
            const h = canvas.height;
            const w = canvas.width;
            // One faint slow swell, like waves gently crashing — the
            // layered bands are gone, the background is just quietly
            // dynamic now.
            const swell = { y: 0.55, amp: 12, speed: 0.2, color: "45, 212, 191", alpha: 0.06 };
            const baseY = h * swell.y;
            ctx.beginPath();
            ctx.moveTo(0, baseY);
            for (let x = 0; x <= w; x += 12) {
                const y =
                    baseY +
                    Math.sin(x * 0.008 + t * swell.speed) * swell.amp +
                    Math.sin(x * 0.02 - t * swell.speed * 0.7) * 3;
                ctx.lineTo(x, y);
            }
            for (let x = w; x >= 0; x -= 12) {
                const y =
                    baseY +
                    14 +
                    Math.sin(x * 0.008 + t * swell.speed) * swell.amp +
                    Math.sin(x * 0.02 - t * swell.speed * 0.7) * 3;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = `rgba(${swell.color}, ${swell.alpha})`;
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            for (let x = 0; x <= w; x += 12) {
                const y =
                    baseY +
                    Math.sin(x * 0.008 + t * swell.speed) * swell.amp +
                    Math.sin(x * 0.02 - t * swell.speed * 0.7) * 3;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            // Plain sand strip + small quiet sandcastles, soft wash
            // sliding over their bases.
            ctx.fillStyle = "rgba(244, 214, 160, 0.55)";
            ctx.fillRect(0, h - 52, w, 52);
            const castle = (cx, s) => {
                ctx.fillStyle = "rgba(232, 196, 138, 0.9)";
                ctx.beginPath();
                ctx.moveTo(cx - 22 * s, h - 52);
                ctx.lineTo(cx - 14 * s, h - 52 - 26 * s);
                ctx.lineTo(cx + 14 * s, h - 52 - 26 * s);
                ctx.lineTo(cx + 22 * s, h - 52);
                ctx.closePath();
                ctx.fill();
                ctx.fillRect(cx - 3 * s, h - 52 - 40 * s, 6 * s, 14 * s);
                ctx.fillStyle = "rgba(244, 114, 182, 0.9)";
                ctx.beginPath();
                ctx.moveTo(cx + 3 * s, h - 52 - 40 * s);
                ctx.lineTo(cx + 14 * s, h - 52 - 36 * s);
                ctx.lineTo(cx + 3 * s, h - 52 - 32 * s);
                ctx.closePath();
                ctx.fill();
            };
            castle(w * 0.2, 0.7);
            castle(w * 0.78, 0.85);
            const washY = h - 52 + Math.sin(t * 0.5) * 7;
            ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
            ctx.fillRect(0, washY, w, h - washY);
        };

        const drawSeason = (t) => {
            switch (seasonRef.current) {
                case "spring":
                    drawSpring(t);
                    break;
                case "summer":
                    drawSummer(t);
                    break;
                case "autumn":
                    drawAutumn(t);
                    break;
                case "winter":
                    drawWinter(t);
                    break;
                default:
                    break;
            }
        };

        // Keep the scene proportional when the window resizes: every
        // particle was placed from the viewport size at load, so without
        // this a small-to-large resize leaves leaves, piles, grass and
        // flowers bunched up on one side or floating off the bottom.
        // (The early resize() above only rebuilds the canvas and stars.)
        let lastW = window.innerWidth;
        let lastH = window.innerHeight;
        const rescaleOnResize = () => {
            const newW = window.innerWidth;
            const newH = window.innerHeight;
            const ratioX = newW / lastW;
            const ratioY = newH / lastH;
            const oldH = lastH;
            lastW = newW;
            lastH = newH;
            blobs.forEach((blob) => {
                blob.baseX *= ratioX;
                blob.baseY *= ratioY;
            });
            leaves.forEach((leaf) => {
                leaf.baseX *= ratioX;
                leaf.baseY *= ratioY;
            });
            pileLeaves.forEach((leaf) => {
                leaf.x *= ratioX;
                // Keep each leaf's distance from the bottom edge.
                leaf.y = newH - (oldH - leaf.y);
            });
            flakes.forEach((flake) => {
                flake.baseX *= ratioX;
                flake.baseY *= ratioY;
            });
            grassBlades.forEach((blade) => {
                blade.x *= ratioX;
            });
            flowers.forEach((flower) => {
                flower.x *= ratioX;
            });
        };
        window.addEventListener('resize', rescaleOnResize);

        const draw = () => {
            const reduced = reducedMotionRef.current;
            const now = performance.now();
            const dt = Math.min(0.05, (now - lastNow) / 1000);
            lastNow = now;

            if (!reduced) {
                time += 0.0015;
                twinkleT += dt;

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

                    // Middle ground: light mode blobs sit between the old
                    // pastel (0.03) and the too-pigmented bump (0.04);
                    // dark mode stays at the original 0.03 so it stays
                    // dark and barely changes between seasons.
                    const opacity =
                        (isDarkModeRef.current ? 0.03 : 0.035) +
                        Math.sin(t * 0.4) * 0.015;

                    const hueShift = Math.sin(time * 0.1 + i) * 10;
                    const blobBase = blobBaseRef.current;
                    const base = isDarkModeRef.current
                        ? [blobBase[0] + hueShift, blobBase[1], blobBase[2]]
                        : [blobBase[0], blobBase[1] + hueShift, blobBase[2]];

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

                // Dimmer in dark mode so the glow doesn't wash out
                // text sitting under the cursor.
                const lightPeak = isDarkModeRef.current ? 0.05 : 0.08;
                lightGradient.addColorStop(0, `rgba(255,255,255, ${lightPeak})`);
                lightGradient.addColorStop(
                    0.4,
                    `rgba(255,255,255, ${lightPeak * 0.5})`
                );
                lightGradient.addColorStop(1, 'rgba(255,255,255, 0)');

                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = lightGradient;
                ctx.beginPath();
                ctx.arc(lightX, lightY, lightRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            ctx.filter = 'none';

            // Seasonal animation — light mode only, skipped for reduced
            // motion. Dark mode keeps just the stars.
            if (!reduced && !isDarkModeRef.current) {
                drawSeason(twinkleT);
            }

            const targetOpacity = isDarkModeRef.current ? 1 : 0;
            if (reduced) {
                starOpacity = targetOpacity;
            } else {
                starOpacity = lerp(
                    starOpacity,
                    targetOpacity,
                    1 - Math.exp(-dt * FADE_RATE)
                );
            }

            if (starOpacity > 0.001) {
                ctx.globalCompositeOperation = 'lighter';

                // Cursor repulsion: nearby stars clear away from the pointer.
                // Stars only render in dark mode, and the effect is skipped
                // for reduced-motion users.
                const repelActive = !reduced;
                const repelRadius = 220;
                const repelMax = 36;
                const mousePx =
                    canvas.width / 2 + mouse.x * canvas.width * 0.5;
                const mousePy =
                    canvas.height / 2 + mouse.y * canvas.height * 0.5;
                const repelOffset = (star) => {
                    if (!repelActive) return null;
                    const dx = star.x - mousePx;
                    const dy = star.y - mousePy;
                    const dist = Math.hypot(dx, dy);
                    if (dist >= repelRadius || dist === 0) return null;
                    const t = 1 - dist / repelRadius;
                    const push = t * t * repelMax;
                    return { x: (dx / dist) * push, y: (dy / dist) * push };
                };

                stars.forEach((star) => {
                    const twinkle = reduced
                        ? 1
                        : 0.6 +
                          0.4 *
                              Math.abs(
                                  Math.sin(twinkleT * star.speed + star.phase)
                              );
                    const alpha = star.base * twinkle * starOpacity;
                    const off = repelOffset(star);
                    const sx = off ? star.x + off.x : star.x;
                    const sy = off ? star.y + off.y : star.y;

                    if (star.bright) {
                        drawSparkle(sx, sy, star.radius, STAR_RGB, alpha * 0.85);
                        drawSparkle(
                            sx,
                            sy,
                            star.radius * 0.42,
                            '255, 255, 255',
                            Math.min(1, alpha * 1.05)
                        );
                    } else {
                        drawSparkle(sx, sy, star.radius, STAR_RGB, alpha);
                    }
                });
                ctx.globalCompositeOperation = 'source-over';

                if (!reduced) {
                    if (isDarkModeRef.current && !shooting) {
                        shootIn -= dt;
                        if (shootIn <= 0) {
                            shooting = spawnShootingStar(
                                canvas.width,
                                canvas.height
                            );
                            shootIn = 12 + Math.random() * 8;
                        }
                    }

                    if (shooting) {
                        shooting.x += shooting.vx * dt;
                        shooting.y += shooting.vy * dt;
                        shooting.life -= dt;

                        const mag = Math.hypot(shooting.vx, shooting.vy) || 1;
                        const tailX =
                            shooting.x - (shooting.vx / mag) * shooting.length;
                        const tailY =
                            shooting.y - (shooting.vy / mag) * shooting.length;
                        const fade =
                            (shooting.life / shooting.maxLife) * starOpacity;

                        ctx.strokeStyle = `rgba(${STAR_RGB}, ${0.95 * fade})`;
                        ctx.lineWidth = 1.6;
                        ctx.lineCap = 'round';
                        ctx.beginPath();
                        ctx.moveTo(tailX, tailY);
                        ctx.lineTo(shooting.x, shooting.y);
                        ctx.stroke();

                        ctx.fillStyle = `rgba(255, 255, 255, ${fade})`;
                        ctx.beginPath();
                        ctx.arc(shooting.x, shooting.y, 2, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.lineCap = 'butt';
                        ctx.lineWidth = 1;

                        if (
                            shooting.life <= 0 ||
                            shooting.x > canvas.width + 60 ||
                            shooting.y > canvas.height + 60
                        ) {
                            shooting = null;
                        }
                    }
                }
            } else {
                shooting = null;
            }

            animRef.current = requestAnimationFrame(draw);
        };

        animRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('resize', rescaleOnResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, []);

    const backgroundStyle = {
        position: embedded ? 'absolute' : 'fixed',
        inset: 0,
        zIndex: embedded ? 0 : -1,
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
        opacity: theme.isDarkMode ? 0.24 : 0.45,
    };

    const colorOverlayStyle = {
        position: 'absolute',
        inset: 0,
        backgroundImage: `
            radial-gradient(ellipse at 20% 30%, ${palette.accentPrimary} 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, ${palette.accentSecondary} 0%, transparent 55%)
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

    const overlayFadeStyle = {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        ...(prefersReducedMotion
            ? { opacity: 1 }
            : { animation: 'seasonalTintFade 1.5s ease-out both' }),
    };

    return (
        <>
            <style>{`
                @keyframes colorFloat {
                    0%   { background-position: 0% 0%, 100% 100%; opacity: 0.95; }
                    50%  { background-position: 6% 4%, 94% 96%;  opacity: 1;    }
                    100% { background-position: 0% 0%, 100% 100%; opacity: 0.95; }
                }

                @keyframes seasonalTintFade {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .pixel-color {
                        animation: none !important;
                    }
                    .pixel-seasonal-fade {
                        animation: none !important;
                        opacity: 1 !important;
                    }
                }
            `}</style>

            <div style={backgroundStyle}>
                <div style={gridStyle} />
                <div className="pixel-seasonal-fade" style={overlayFadeStyle}>
                    <div className="pixel-color" style={colorOverlayStyle} />
                    <canvas ref={canvasRef} style={canvasStyle} />
                </div>
                <div style={vignetteStyle} />
            </div>
        </>
    );
};

export default PixelatedBackground;
