import React, { useMemo, useState, useEffect } from 'react';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';
import { FaStar } from 'react-icons/fa';
import bookshelfData from '../../../pages/BookshelfPage/data/bookshelfData';
import { Link } from 'react-router';
import Badge from '../../../pages/BookshelfPage/Badge';
import { titleToSlug } from '../../../pages/BookshelfPage/bookshelfUtils';
import { useReducedMotion } from 'framer-motion';

const BookshelfSection = () => {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  const topFavorites = useMemo(() => 
    bookshelfData
      .filter(item => item.favorite)
      .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
      .slice(0, 3)
  , []);

  const sectionStyle = {
    maxWidth: '900px',
    width: '100%',
    margin: 'var(--space-section) auto',
    padding: 'var(--space-card)',
    boxSizing: 'border-box',
    opacity: mounted || prefersReducedMotion ? 1 : 0,
    transform: mounted || prefersReducedMotion ? 'translateY(0)' : 'translateY(15px)',
    transition: 'opacity 400ms ease, transform 400ms ease'
  };

  const titleStyle = {
    fontFamily: theme.fonts?.heading,
    fontSize: 'var(--text-section-sm)',
    fontWeight: 600,
    lineHeight: 'var(--leading-tight)',
    letterSpacing: '-0.02em',
    color: theme.colors.text,
    marginBottom: 'var(--space-heading-body)',
    textAlign: 'center',
    cursor: 'pointer'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: theme.fonts?.base || 'var(--font-ui)',
  };

  const thStyle = {
    textAlign: 'left',
    padding: '0.6rem 0.85rem',
    borderBottom: `1px solid ${theme.colors.border}`,
    color: theme.colors.textSecondary,
    fontSize: 'var(--text-meta)',
    fontWeight: 500,
  };

  const tdStyle = {
    padding: '0.65rem 0.85rem',
    borderBottom: `1px solid ${theme.colors.border}`,
    color: theme.colors.text,
    fontSize: 'var(--text-meta)',
    verticalAlign: 'middle',
    textAlign: 'left'
  };

  return (
    <div style={sectionStyle}>
      <h2 style={titleStyle}>
        <Link to="/recent-reads" style={{ color: 'inherit', textDecoration: 'none' }}>
          Recent Reads
        </Link>
      </h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Tags</th>
            </tr>
          </thead>
          <tbody>
            {topFavorites.map((row, i) => (
              <tr key={i} 
                  style={{ transition: 'background 180ms ease, transform 160ms ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <td style={tdStyle}>
                  <Link
                    to={`/recent-reads/${titleToSlug(row.title)}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                  >
                    <FaStar color={theme.isDarkMode ? '#FFD700' : '#000'} size={12} style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 500, color: theme.colors.accent }}>{row.title}</span>
                  </Link>
                </td>

                <td style={tdStyle}>
                  {(() => {
                    const sortedTags = (row.tags || [])
                      .slice()
                      .sort((a, b) => a.localeCompare(b));

                    const displayTags = sortedTags.slice(0, 2);
                    const remainingCount = sortedTags.length - 2;

                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {displayTags.map((t, idx) => (
                          <Badge key={idx} theme={theme}>{t}</Badge>
                        ))}

                        {remainingCount > 0 && (
                          <span style={{
                            fontSize: 'var(--text-caption)',
                            color: theme.colors.textSecondary,
                            fontWeight: 500
                          }}>
                            +{remainingCount}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/recent-reads"
        style={{
          marginTop: '0.85rem',
          fontSize: 'var(--text-meta)',
          fontWeight: 500,
          color: theme.colors.accent,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '0.25rem',
          textAlign: 'left',
          textDecoration: 'none'
        }}
      >
        Check out all my reads →
      </Link>
    </div>
  );
};

export default BookshelfSection;
