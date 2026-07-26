import React, { useState, useEffect } from 'react';

import { PROFILE_PHOTOS } from '../../../assets/profilePhotos';

const ProfilePhoto = () => {
    const photos = PROFILE_PHOTOS;

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
        overflow: 'hidden',
        border: 0,
        padding: 0,
    };

    const photoStyle = {
        position: 'absolute',
        inset: '4px',
        borderRadius: '50%',
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 8px)',
        objectFit: 'cover',
        objectPosition: 'center',
        transition: 'opacity 0.6s ease',
        opacity: isTransitioning ? 0 : 1,
    };

    return (
        <div>
            <button
                type="button"
                style={containerStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handlePhotoClick}
                title="click to cycle!"
                aria-label="Show the next photo of Ramya Iyer"
            >
                <img
                    src={photos[currentPhotoIndex]}
                    alt="Ramya Iyer"
                    style={photoStyle}
                />
            </button>
        </div>
    );
};

export default ProfilePhoto;
