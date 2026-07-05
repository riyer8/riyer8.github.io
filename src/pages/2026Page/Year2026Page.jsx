import React, { useState, useEffect } from 'react';
import { useTheme } from '../../components/ThemeContext/ThemeContext';
import BackHomeLink from '../../components/Navigation/BackHomeLink';
import { formatPageTitle, usePageTitle } from '../../utils/pageTitle';

const PAGE_TITLE = formatPageTitle('2026');

const Year2026Page = () => {
  const { theme } = useTheme();
  usePageTitle(PAGE_TITLE);

  /* -------------------- Responsive logic -------------------- */
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: window.innerWidth > 1024,
    shouldCollapseSidebar: window.innerWidth <= 900,
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024,
        shouldCollapseSidebar: width <= 900,
      });
    };

    const debouncedResize = (() => {
      let timeoutId;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkScreenSize, 150);
      };
    })();

    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  const getResponsiveSize = (mobile, tablet, desktop) => {
    if (screenSize.shouldCollapseSidebar) return mobile;
    if (screenSize.isTablet) return tablet;
    return desktop;
  };


  /* -------------------- Books (ongoing list) -------------------- */
  const [booksExpanded, setBooksExpanded] = useState(true);
  const [books] = useState([
    { title: 'The Seven Husbands of Evelyn Hugo', finishedOn: 'January 4' },
    { title: "The Princess of Cleves", finishedOn: 'January 12'},
    { title: "Manon Lescaut", finishedOn: "January 20"},
    { title: "None Of This Is True", finishedOn: "February 11"},
    { title: "Lessons in Chemistry", finishedOn: "February 28"},
    { title: "When Breathe Becomes Air", finishedOn: "March 11"},
    { title: "Ghachar Ghochar", finishedOn: "March 26"}
  ]);

  const sortedBooks = [...books].reverse();

  /* -------------------- Calendar logic (2026) -------------------- */
  const today = new Date();
  const currentYear = 2026;
  const startOfYear = new Date(2026, 0, 1);
  const endOfYear = new Date(2026, 11, 31);

  const yearProgress = Math.min(
    100,
    Math.max(
      0,
      ((today - startOfYear) / (endOfYear - startOfYear)) * 100
    )
  );

  const currentDateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const generateMonth = (monthIndex) => {
    const firstDay = new Date(currentYear, monthIndex, 1).getDay();
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return cells;
  };

  /* -------------------- Styles -------------------- */
  const containerStyle = {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    width: '100%',
    color: theme.colors.text,
    fontFamily: theme.fonts?.base || 'var(--font-ui)',
  };

  const contentStyle = {
    padding: getResponsiveSize('1rem', '2rem 4rem', '3rem 6rem 3rem 3rem'),
    boxSizing: 'border-box',
  };

  const sectionStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  };

  const cardStyle = {
    background: theme.isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 12,
    padding: '1rem',
  };

  const collapsibleListStyle = {
    maxHeight: '220px',
    overflowY: 'auto',
    marginTop: '0.75rem',
    borderTop: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
    paddingTop: '0.4rem',
  };

  const bookRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '1rem',
    padding: '0.55rem 0',
    fontSize: '0.85rem',
    alignItems: 'start',
  };

  const calendarGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    alignContent: 'center',
    gap: '4px',
    marginTop: '0.5rem',
  };

  const dayCellStyle = (isToday) => ({
    padding: '0.4rem 0',
    textAlign: 'center',
    borderRadius: 6,
    background: isToday
      ? theme.colors.accent
      : theme.isDarkMode
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.05)',
    color: isToday ? '#fff' : theme.colors.text,
    fontSize: '0.75rem',
  });

  /* -------------------- Render -------------------- */
  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <BackHomeLink style={{ marginBottom: '1.25rem' }} />
        <div style={sectionStyle}>
          <h1 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            Year in Review: 2026
          </h1>

            {/* ---------- Top row (expandable cards) ---------- */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: getResponsiveSize(
                  '1fr',
                  'repeat(2, 1fr)',
                  'repeat(3, 1fr)'
                ),
                gap: '1.5rem',
                marginBottom: '3rem',
              }}
            >

              {/* Books Card */}
              <div style={cardStyle}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setBooksExpanded(prev => !prev)}
                >
                  <h3 style={{ margin: 0 }}>
                    Books 📚 <span style={{ opacity: 0.6 }}>({books.length})</span>
                  </h3>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                    {booksExpanded ? 'Hide' : 'Show'}
                  </span>
                </div>

                {booksExpanded && (
                  <div style={collapsibleListStyle}>
                    {sortedBooks.map((sortedBooks, i) => (
                      <div key={i} style={bookRowStyle}>
                        <span style={{ lineHeight: 1.35 }}>
                          {sortedBooks.title}
                        </span>
                        <span
                          style={{
                            opacity: 0.6,
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                            textAlign: 'right',
                          }}
                        >
                          {sortedBooks.finishedOn}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Placeholder cards */}
            </div>

            {/* ---------- Calendar ---------- */}
            <h2 style={{ textAlign: 'center' }}>2026 Calendar</h2>

            {/* Progress Bar */}
            <div
              style={{
                margin: '1rem auto 2rem',
                maxWidth: '600px',
              }}
            >
              <div
                style={{
                  height: 10,
                  borderRadius: 8,
                  background: theme.isDarkMode
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${yearProgress}%`,
                    height: '100%',
                    background: theme.colors.accent,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  opacity: 0.6,
                  marginTop: '0.3rem',
                }}
              >
                {Math.floor(yearProgress)}% of the year complete
              </p>
            </div>

            {/* Months */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: getResponsiveSize(
                  '1fr',
                  'repeat(2, 1fr)',
                  'repeat(3, 1fr)'
                ),
                gap: '1rem',
              }}
            >
              {months.map((month, mIndex) => (
                <div key={month} style={cardStyle}>
                  <strong>{month}</strong>
                  <div style={calendarGridStyle}>
                    {['S','M','T','W','T','F','S'].map(d => (
                      <div key={d} style={{ fontSize: '0.6rem', opacity: 0.6, alignContent: 'center' }}>
                        {d}
                      </div>
                    ))}
                    {generateMonth(mIndex).map((day, i) => {
                      if (!day) return <div key={i} />;
                      const key = `${currentYear}-${mIndex}-${day}`;
                      const isToday = key === currentDateKey;
                      return (
                        <div key={i} style={dayCellStyle(isToday)}>
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
  );
};

export default Year2026Page;
