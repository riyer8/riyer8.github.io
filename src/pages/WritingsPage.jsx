import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import writings from '../data/writingsData';
import profilePhoto from '../assets/photo3.JPG';

const WritingTile = ({ item, theme }) => (
  <div style={{ flex: '0 0 20%', padding: '1rem', boxSizing: 'border-box' }}>
    <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: 6, overflow: 'hidden', background: theme.colors.cardBackground }}>
      <div style={{ width: '100%', height: 220, background: '#eee' }}>
        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: '0.8rem' }}>
        <div style={{ fontWeight: 700, color: theme.colors.text }}>{item.title}</div>
        <div style={{ color: theme.colors.textSecondary, fontSize: '0.85rem', marginTop: '0.45rem' }}>{item.date} · {item.readTime}</div>
        <div style={{ marginTop: '0.6rem', color: theme.colors.textSecondary }}>{item.description}</div>
      </div>
    </div>
  </div>
);

const WritingsPage = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);

  const pageContainer = {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '1rem',
    fontFamily: 'Inter, -apple-system, system-ui, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  };

  return (
    <div style={pageContainer}>
      {/* No subscription form (removed) */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.6rem',
              borderRadius: 8,
              background: theme.isDarkMode ? 'rgba(255,255,255,0.04)' : theme.colors.accent,
              color: theme.isDarkMode ? theme.colors.text : '#fff',
              border: `1px solid ${theme.colors.border}`,
              cursor: 'pointer'
            }}>
              ← Home
            </button>
          </a>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* space for potential controls */}
        </div>
      </div>

      {/* Top description card */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ width: 84, height: 84 }}>
          <img src={profilePhoto} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, color: theme.colors.text }}>writing</h1>
          <p style={{ marginTop: '0.4rem', marginBottom: 0, color: theme.colors.textSecondary }}>what my mind is thinking about.</p>
        </div>
        <div />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {writings.map(w => <WritingTile key={w.id} item={w} theme={theme} />)}
      </div>
    </div>
  );
};

export default WritingsPage;
