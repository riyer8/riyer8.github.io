import React from 'react';

const ProfilePhoto = () => {
    const photoStyle = {
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4ECDC4, #FFB347)',
        marginBottom: '2rem',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.3s ease'
    };

    const innerStyle = {
        position: 'absolute',
        inset: '4px',
        borderRadius: '50%',
        background: '#f9f9f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: '0.9rem'
    };

    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div 
            style={{
                ...photoStyle,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
        </div>
    );
};

export default ProfilePhoto;
