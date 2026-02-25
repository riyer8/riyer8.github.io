import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';
import './StatusWidget.css';

const currentActivities = [
    "thinking about AI x human connection tradeoff 💡",
    "graduating soon 🎓",
    "reading \"Lessons in Chemistry\" at a cafe ☕️",
    "writing ✍️",
    "gyming 🥊",
    "talking to cool people 🤝",
    "exploring San Francisco 🌉",
];

const StatusWidget = () => {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    const fullText = currentActivities[currentIndex];

    useEffect(() => {
        const blink = setInterval(() => setCursorVisible(v => !v), 500);
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
                    setCurrentIndex(i => (i + 1) % currentActivities.length);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, isPaused, fullText]);

    return (
        <div
            className={`status-widget ${theme.isDarkMode ? 'dark' : 'light'}`}
            style={{
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.textSecondary,
            }}
        >
            <div className="status-item centered-text">
                <span className="status-label" style={{ color: theme.colors.text }}>I'm currently...</span>
                <span className="status-value">
                    {displayText}
                    <span className="status-cursor" style={{ opacity: cursorVisible ? 1 : 0.2 }}>|</span>
                </span>
            </div>
        </div>
    );
};

export default StatusWidget;
