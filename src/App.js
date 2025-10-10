import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PixelatedBackground, Sidebar, MainContent, ThemeToggle } from './components';
import BookshelfPage from './pages/BookshelfPage';

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

    const isBookshelf = typeof window !== 'undefined' && window.location && window.location.pathname === '/bookshelf';

    return (
        <ThemeProvider>
            <PixelatedBackground theme="whoami" />
            <ThemeToggle />
            {isBookshelf ? (
                <BookshelfPage />
            ) : (
                <div style={containerStyle}>
                    <Sidebar />
                    <MainContent />
                </div>
            )}
        </ThemeProvider>
    );
};

export default App;