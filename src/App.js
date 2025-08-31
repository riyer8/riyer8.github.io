import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PixelatedBackground, Sidebar, MainContent } from './components';

const App = () => {
    const containerStyle = {
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        margin: 0,
        padding: 0
    };

    React.useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflowX = 'hidden';
        // Remove the static backgroundColor since it will be handled by the theme
    }, []);

    return (
        <ThemeProvider>
            <PixelatedBackground theme="whoami" />
            <div style={containerStyle}>
                <Sidebar />
                <MainContent />
            </div>
        </ThemeProvider>
    );
};

export default App;