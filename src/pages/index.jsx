import React from 'react';
import PixelatedBackground from '../components/Background';
import Sidebar from '../components/Layout/Sidebar';
import MainContent from '../components/Layout/MainContent';

// Import styles
import '../styles/globals.css';
import '../styles/layout.css';

const LandingPage = () => {
    return (
        <>
            <PixelatedBackground theme="whoami" />
            <div className="main-container">
                <Sidebar />
                <MainContent />
            </div>
        </>
    );
};

export default LandingPage;