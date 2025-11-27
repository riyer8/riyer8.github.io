import React, { useState, useEffect } from 'react';

const currentActivities = [
    "Building AI agents 🤖",
    "Researching about PCOS 🧬",
    "Planning my senior courses 🎓",
    "Creating this website 💻",
    "Reading a book at a SF cafe ☕️",
    "Thinking about consumer products 🛍️",
    "Hiking at the Stanford Dish 🌳"
];

const StatusWidget = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    const fullText = currentActivities[currentIndex];

    // cursor blink
    useEffect(() => {
        const blink = setInterval(() => setCursorVisible(v => !v), 500);
        return () => clearInterval(blink);
    }, []);

    // typing animation
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
                    setCurrentIndex((i) => (i + 1) % currentActivities.length);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, isPaused, fullText]);

    // occasional instant skip
    useEffect(() => {
        const interval = setInterval(() => {
            setIsPaused(false);
            setIsDeleting(false);
            setDisplayText("");
            setCurrentIndex(i => (i + 1) % currentActivities.length);
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const widgetStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(78, 205, 196, 0.3)',
        borderRadius: '8px',
        padding: '1.5rem',
        marginTop: '2rem'
    };

    const statusItemStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.8rem',
        fontSize: '1rem'
    };

    const statusLabelStyle = {
        fontWeight: 600,
        color: '#333',
        marginRight: '0.5rem'
    };

    const statusValueStyle = {
        color: '#666',
        cursor: "pointer",
        userSelect: "none"
    };

    return (
        <div style={widgetStyle}>
            <div style={statusItemStyle}>
                <span style={statusLabelStyle}>I'm currently...</span>
                <span style={statusValueStyle}>
                    {displayText}
                    <span style={{
                        opacity: cursorVisible ? 1 : 0.2,
                        transition: "opacity 0.2s ease"
                    }}>
                        |
                    </span>
                </span>
            </div>

            <div style={{ ...statusItemStyle, marginBottom: 0 }}>
                <span style={statusLabelStyle}>Location:</span>
                <span style={statusValueStyle}>Stanford, CA 🌲</span>
            </div>
        </div>
    );
};

export default StatusWidget;
