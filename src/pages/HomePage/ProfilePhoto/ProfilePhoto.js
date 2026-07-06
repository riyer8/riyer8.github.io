import React, { useState, useEffect } from 'react';

import photo1 from '../../../assets/photo1.png';
import photo2 from '../../../assets/photo2.png';
import photo3 from '../../../assets/photo3.jpeg';
import photo4 from '../../../assets/photo4.png';
import photo5 from '../../../assets/photo5.png';
import photo6 from '../../../assets/photo6.png';
import photo7 from '../../../assets/photo7.png';

const ProfilePhoto = () => {
    const photos = [photo1, photo2, photo3, photo4, photo5, photo6, photo7];

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
    };

    const photoStyle = {
        position: 'absolute',
        inset: '4px',
        borderRadius: '50%',
        backgroundImage: `url(${photos[currentPhotoIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 0.6s ease',
        opacity: isTransitioning ? 0 : 1,
    };

    return (
        <div>
            <div
                style={containerStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handlePhotoClick}
                title="click to cycle!"
            >
                <div style={photoStyle} />
            </div>
        </div>
    );
};

export default ProfilePhoto;
