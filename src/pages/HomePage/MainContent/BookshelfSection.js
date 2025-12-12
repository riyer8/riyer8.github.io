import React, { useMemo } from 'react';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';
import { FaStar } from 'react-icons/fa';
import bookshelfData from '../../../pages/BookshelfPage/data/bookshelfData';
import { useNavigate } from 'react-router-dom';

const Pill = ({ children, theme }) => (
  <span style={{
    display: 'inline-block',
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 500,
    background: theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
    color: theme.colors.text,
    marginRight: '0.25rem'
  }}>
    {children}
  </span>
);

const BookshelfSection = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const topFavorites = useMemo(() => 
    bookshelfData
      .filter(item => item.favorite)
      .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
      .slice(0, 3)
  , []);

  const sectionStyle = {
    maxWidth: '900px',
    width: '100%',
    margin: '2rem auto',
    padding: '1rem',
    boxSizing: 'border-box'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 600,
    color: theme.colors.text,
    marginBottom: '1rem',
    textAlign: 'center',
    cursor: 'pointer'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'Inter, -apple-system, system-ui, sans-serif'
  };

  const thStyle = {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    borderBottom: `1px solid ${theme.colors.border}`,
    color: theme.colors.textSecondary,
    fontSize: '0.95rem'
  };

  const tdStyle = {
    padding: '0.85rem 1rem',
    borderBottom: `1px solid ${theme.colors.border}`,
    color: theme.colors.text,
    fontSize: '0.95rem',
    verticalAlign: 'middle'
  };

  const handleNavigateFavorites = () => {
    navigate('/recent-reads');
  };

  return (
    <div style={sectionStyle}>
      <h2 style={titleStyle} onClick={() => navigate('/recent-reads')}>
        Recent Reads
      </h2>

      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.75rem', color: theme.colors.textSecondary, textAlign: 'left' }}>
        Favorites from my Recent Reads
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Tags</th>
            </tr>
          </thead>
          <tbody>
            {topFavorites.map((row, i) => (
              <tr key={i} 
                  style={{ cursor: 'pointer', transition: 'background 180ms ease, transform 160ms ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={handleNavigateFavorites}
              >
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                    <FaStar color={theme.isDarkMode ? '#FFD700' : '#000'} size={16} style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, color: theme.colors.accent }}>{row.title}</span>
                  </div>
                </td>
                <td style={tdStyle}>
                  <Pill theme={theme}>{row.category}</Pill>
                </td>
                <td style={tdStyle}>
                  {(row.tags || []).map((t, idx) => <Pill key={idx} theme={theme}>{t}</Pill>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div 
        onClick={() => navigate('/recent-reads')}
        style={{
          marginTop: '1rem',
          fontWeight: 600,
          color: theme.colors.accent,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '0.25rem',
          textAlign: 'left'
        }}
      >
        Check out all my reads →
      </div>
    </div>
  );
};

export default BookshelfSection;
