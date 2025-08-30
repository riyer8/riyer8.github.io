import React from 'react';

const StatusWidget = () => {
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
        color: '#666'
    };

    return (
        <div style={widgetStyle}>
            <div style={statusItemStyle}>
                <span style={statusLabelStyle}>Currently:</span>
                <span style={statusValueStyle}>Building this website (& reading something new) 🧠</span>
            </div>
            <div style={statusItemStyle}>
                <span style={statusLabelStyle}>Last seen:</span>
                <span style={statusValueStyle}>Writing my senior year bucket list ✍  </span>
            </div>
            <div style={{...statusItemStyle, marginBottom: 0}}>
                <span style={statusLabelStyle}>Location:</span>
                <span style={statusValueStyle}>New York (for the summer at least!) 🗽</span>
            </div>
        </div>
    );
};

export default StatusWidget;
