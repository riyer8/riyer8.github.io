import React, { useState, useEffect } from 'react';
import { useTheme } from '../../components/ThemeContext/ThemeContext';
import PixelatedBackground from '../../components/Background/PixelatedBackground';
import NotesSection from '../Principles/NotesSection';

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
    flexDirection: 'column',
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
    justifyContent: 'flex-start',
    minHeight: '100vh',
    boxSizing: 'border-box',
  };

  const sectionStyle = {
    maxWidth: getResponsiveSize('100%', '700px', '800px'),
    width: '100%',
    textAlign: 'center',
    marginTop: '2rem',
  };

  const headingStyle = {
    fontSize: getResponsiveSize('1.8rem', '2.2rem', '2.5rem'),
    fontWeight: 600,
    color: theme.colors.text,
    marginBottom: '1rem',
    lineHeight: 1.2,
  };

  const homeButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    borderRadius: 8,
    background: theme.isDarkMode ? 'rgba(255,255,255,0.04)' : theme.colors.accent,
    color: theme.isDarkMode ? theme.colors.text : '#fff',
    border: `1px solid ${theme.colors.border}`,
    cursor: 'pointer',
    textDecoration: 'none',
    marginBottom: '1rem',
  };

  return (
    <>
      <PixelatedBackground />

      <div style={containerStyle}>
        <div style={contentStyle}>

          {/* Back to Home button left-aligned */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <button style={homeButtonStyle}>← Home</button>
            </a>
          </div>

          {/* Centered main section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              width: '100%',
            }}
          >
            <div style={sectionStyle}>
              <h1 style={headingStyle}>Hi, I'm Ramya.</h1>
              <p>I've always found it unrealistic to try to define who I am in a few sentences. It'd probably anyways be updated every other day. So if you want to know me, let's chat! Email me at ramya1@stanford.edu (I pride myself on replying to <i>exciting</i> emails) rather quickly. </p>
              <p><i>Even this will probably be updated soon ✨</i> </p>
              <p style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {[
                  { label: 'GitHub', href: 'https://github.com/riyer8' },
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ramya-i/' },
                  { label: 'Twitter', href: 'https://x.com/ramya_iyer1' },
                  { label: 'Email', href: 'mailto:ramya1@stanford.edu' },
                  { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=uou0pPoAAAAJ&hl=en'}
                ].map(function(item) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: theme.colors.accent,
                        textDecoration: 'none',
                        fontWeight: 500,
                        borderBottom: '1px solid ' + theme.colors.accent,
                        paddingBottom: '1px',
                      }}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </p>
            </div>

            <NotesSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
