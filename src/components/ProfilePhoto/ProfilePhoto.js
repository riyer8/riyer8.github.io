import React, { useState, useEffect } from 'react';

// Import your photos from assets folder
import photo1 from '../../assets/photo1.png';
import photo2 from '../../assets/photo2.jpg';
import photo3 from '../../assets/photo3.JPG';

const ProfilePhoto = () => {
    // Array of your imported photos
    const photos = [photo1, photo2, photo3];

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-cycle through photos every 20 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            
            // After fade out, change photo
            setTimeout(() => {
                setCurrentPhotoIndex((prevIndex) => 
                    (prevIndex + 1) % photos.length
                );
                setIsTransitioning(false);
            }, 300); // Half of transition time
            
        }, 20000); // 20 seconds

        return () => clearInterval(interval);
    }, [photos.length]);

    // Manual click to next photo
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
        marginBottom: '2rem',
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

    // Progress indicator dots
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
                {/* Actual photo */}
                <div style={photoStyle} />
                
                {/* Fallback for when photos don't load */}
                <div style={fallbackStyle}>
                    Loading...
                </div>
            </div>
            
            {/* Progress dots */}
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