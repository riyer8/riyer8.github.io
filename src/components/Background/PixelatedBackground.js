import React from 'react';

const PixelatedBackground = ({ theme = 'whoami' }) => {
    const backgroundStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        
        backgroundSize: '8px 8px, 12px 12px, 16px 16px',
        backgroundPosition: '0 0, 4px 4px, 8px 8px'
    };

    const gridStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
            linear-gradient(90deg, rgba(78, 205, 196, 0.1) 1px, transparent 1px),
            linear-gradient(0deg, rgba(78, 205, 196, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: 0.6
    };

    const colorOverlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
            radial-gradient(ellipse at 20% 30%, rgba(78, 205, 196, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(255, 179, 71, 0.10) 0%, transparent 50%),
            linear-gradient(135deg, rgba(78, 205, 196, 0.05) 0%, rgba(255, 179, 71, 0.05) 100%)
        `
    };

    return (
        <div style={backgroundStyle}>
            <div style={gridStyle}></div>
            <div style={colorOverlayStyle}></div>
        </div>
    );
};

export default PixelatedBackground;