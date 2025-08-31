import React, { useState, useEffect } from 'react';

import photo3 from '../../assets/photo3.JPG';

const ProfilePhoto = () => {
    const photos = [photo3];

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            
            setTimeout(() => {
                setCurrentPhotoIndex((prevIndex) => 
                    (prevIndex + 1) % photos.length
                );
                setIsTransitioning(false);
            }, 300);
            
        }, 15000);

        return () => clearInterval(interval);
    }, [photos.length]);

    const handlePhotoClick = () => {
        setIsTransitioning(true);
        
        setTimeout(() => {
            setCurrentPhotoIndex((prevIndex) => 
                (prevIndex + 1) % photos.length
            );
            setIsTransitioning(false);
        }, 300);
    };

    const containerStyle = {
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4ECDC4, #FFB347)',
        marginBottom: '1rem',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        overflow: 'hidden'
    };

    const photoStyle = {
        position: 'absolute',
        inset: '4px',
        borderRadius: '50%',
        backgroundImage: `url(${photos[currentPhotoIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 0.6s ease',
        opacity: isTransitioning ? 0 : 1
    };

    const fallbackStyle = {
        position: 'absolute',
        inset: '4px',
        borderRadius: '50%',
        background: '#f9f9f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: '0.9rem',
        opacity: photos[currentPhotoIndex] ? 0 : 1,
        transition: 'opacity 0.6s ease'
    };

    const progressStyle = {
        position: 'absolute',
        bottom: '-15px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '4px'
    };

    const dotStyle = (index) => ({
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: index === currentPhotoIndex ? '#4ECDC4' : 'rgba(78, 205, 196, 0.3)',
        transition: 'background 0.3s ease'
    });

    return (
        <div>
            <div 
                style={containerStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handlePhotoClick}
                title="Click to cycle photos"
            >
                <div style={photoStyle} />
                
                <div style={fallbackStyle}>
                    Loading...
                </div>
            </div>
            
            <div style={progressStyle}>
                {photos.map((_, index) => (
                    <div 
                        key={index} 
                        style={dotStyle(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProfilePhoto;