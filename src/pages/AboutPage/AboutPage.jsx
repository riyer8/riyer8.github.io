import React, { useState, useEffect } from 'react';
import { ThemeToggle } from '../../components';
import { useTheme } from '../../components/ThemeContext/ThemeContext';
import PixelatedBackground from '../../components/Background/PixelatedBackground';

const AboutPage = () => {
  const { theme } = useTheme();
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: window.innerWidth > 1024,
    shouldCollapseSidebar: window.innerWidth <= 900
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024,
        shouldCollapseSidebar: width <= 900
      });
    };

    const debouncedResize = (() => {
      let timeoutId;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkScreenSize, 150);
      };
    })();

    checkScreenSize();
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  const getResponsiveSize = (mobileSize, tabletSize, desktopSize) => {
    if (screenSize.shouldCollapseSidebar) return mobileSize;
    if (screenSize.isTablet) return tabletSize;
    return desktopSize;
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    width: '100%',
    color: theme.colors.text,
    fontFamily: theme.fonts?.base || 'sans-serif',
  };

  const contentStyle = {
    flex: 1,
    padding: getResponsiveSize('1rem', '2rem 4rem', '3rem 6rem 3rem 3rem'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    boxSizing: 'border-box',
    };

  const sectionStyle = {
    maxWidth: getResponsiveSize('100%', '700px', '800px'),
    width: '100%',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: getResponsiveSize('1.8rem', '2.2rem', '2.5rem'),
    fontWeight: 600,
    color: theme.colors.text,
    marginBottom: '1rem',
    lineHeight: 1.2,
  };

  return (
    <>
      <ThemeToggle />

      {/* Pixelated Background */}
      <PixelatedBackground />

      <div style={containerStyle}>

        <div style={contentStyle}>

        {/* Centered Section */}
        <div
            style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1, // take remaining space
            width: '100%',
            }}
        >
            <div style={sectionStyle}>
              <h1 style={headingStyle}>Hi, I'm Ramya.</h1>
              <text>This page is currently in progress ✨ </text>
            </div>
        </div>
        </div>
        </div>
    </>
  );
};

export default AboutPage;
