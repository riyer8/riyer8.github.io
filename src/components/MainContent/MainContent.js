import React from 'react';
import StatusWidget from '../StatusWidget';

const MainContent = () => {
    const contentStyle = {
        width: '50%',
        padding: '3rem',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '100vh'
    };

    const sectionStyle = { maxWidth: '650px' };

    const headingStyle = {
        fontSize: '2.5rem',
        fontWeight: 600,
        color: '#333',
        marginBottom: '1.5rem',
        lineHeight: 1.2
    };

    const paragraphStyle = {
        fontSize: '1.2rem',
        color: '#666',
        lineHeight: 1.7,
        marginBottom: '2rem'
    };

    return (
        <div style={contentStyle}>
            <div style={sectionStyle}>
                <h2 style={headingStyle}>
                    Revamp Coming Soon! 🎉
                </h2>
                <StatusWidget />
            </div>
        </div>
    );
};

export default MainContent;
