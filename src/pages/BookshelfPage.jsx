import React, { useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import bookshelfData from '../data/bookshelfData';
import { FaExternalLinkAlt } from 'react-icons/fa';
import profilePhoto from '../assets/photo3.JPG';
import MarkdownMath from '../components/MarkdownMath/MarkdownMath';

const Badge = ({ children, theme }) => (
  <span style={{
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    marginRight: '0.25rem',
    background: theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
    color: theme.colors.text,
    borderRadius: '6px',
    fontSize: '0.8rem'
  }}>{children}</span>
);

const BookshelfPage = () => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeMedium, setActiveMedium] = useState(null);
  const [sortKey, setSortKey] = useState('title'); // title | category | medium
  
  // No per-user view customization: keep rendering simple and deterministic

  // derive categories/mediums
  const categories = useMemo(() => Array.from(new Set(bookshelfData.map(r => r.category).filter(Boolean))), []);
  const mediums = useMemo(() => Array.from(new Set(bookshelfData.map(r => r.medium).filter(Boolean))), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookshelfData.filter(r => {
      if (activeCategory && r.category !== activeCategory) return false;
      if (activeMedium && r.medium !== activeMedium) return false;
      if (!q) return true;
      return (
        (r.title || '').toLowerCase().includes(q) ||
        (r.category || '').toLowerCase().includes(q) ||
        (r.medium || '').toLowerCase().includes(q) ||
        (r.tags || []).join(' ').toLowerCase().includes(q)
      );
    }).sort((a,b) => {
      const A = (a[sortKey] || '').toString().toLowerCase();
      const B = (b[sortKey] || '').toString().toLowerCase();
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
  }, [search, activeCategory, activeMedium, sortKey]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [notesOpen, setNotesOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const closeDetail = () => setSelectedItem(null);

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

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  };

  const pageContainer = {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '1rem',
    fontFamily: 'Inter, -apple-system, system-ui, sans-serif'
  };

  const layoutStyle = {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'flex-start'
  };

  const leftSidebarStyle = {
    width: '320px',
    minHeight: '60vh',
    padding: '1.25rem',
    borderRadius: 8,
    background: theme.isDarkMode ? theme.colors.cardBackground : 'linear-gradient(180deg, rgba(250,250,245,0.9), rgba(245,245,240,0.9))',
    border: `1px solid ${theme.colors.border}`,
    boxSizing: 'border-box'
  };

  const rightContentStyle = {
    flex: 1,
    minHeight: '60vh',
    padding: '1rem',
    borderRadius: 8,
    background: theme.colors.background,
    boxSizing: 'border-box'
  };

  // keep simple content style
  const dynamicRightContentStyle = { ...rightContentStyle };

  const listItemStyle = {
    display: 'flex',
    gap: '0.6rem',
    padding: '0.55rem',
    alignItems: 'center',
    borderRadius: 6,
    cursor: 'pointer'
  };

  return (
    <div style={pageContainer}>
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
          {/* header controls kept intentionally minimal; sorting moved into toolbar */}
        </div>
      </div>

  <div>
        {/* Top description card */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ width: 84, height: 84 }}>
            <img src={profilePhoto} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, color: theme.colors.text }}>Bookshelf</h1>
            <p style={{ marginTop: '0.4rem', marginBottom: 0, color: theme.colors.textSecondary }}>knowledge i've been consuming.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
           
          </div>
        </div>

        {/* Toolbar: filters + search */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => { setActiveCategory(null); setActiveMedium(null); setSearch(''); }} style={{ padding: '0.45rem 0.75rem', borderRadius: 8, background: (!activeCategory && !activeMedium) ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'), color: (!activeCategory && !activeMedium) ? '#fff' : theme.colors.text, border: `1px solid ${theme.colors.border}` }}>All</button>
            {categories.map(c => (
              <button key={c} onClick={() => { setActiveCategory(c); setActiveMedium(null); }} style={{ padding: '0.45rem 0.75rem', borderRadius: 8, background: activeCategory === c ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff'), color: activeCategory === c ? '#fff' : theme.colors.text, border: `1px solid ${theme.colors.border}` }}>{c}</button>
            ))}
            {mediums.map(m => (
              <button key={m} onClick={() => { setActiveMedium(m); setActiveCategory(null); }} style={{ padding: '0.45rem 0.75rem', borderRadius: 8, background: activeMedium === m ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff'), color: activeMedium === m ? '#fff' : theme.colors.text, border: `1px solid ${theme.colors.border}` }}>{m}</button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', minWidth: 260, position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input id="bookshelf-search" placeholder="Search reading notes..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 340, padding: '0.6rem 0.75rem', borderRadius: 8, border: `1px solid ${theme.colors.border}`, background: theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff', color: theme.colors.text }} />

            {/* Filter + Sort buttons (single of each) */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <button onClick={() => { setFilterOpen(o => !o); setSortOpen(false); }} aria-expanded={false} style={{ padding: '0.45rem 0.6rem', borderRadius: 8, border: `1px solid ${theme.colors.border}`, background: theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff', cursor: 'pointer' }}>⚲ Filter</button>
                {typeof filterOpen !== 'undefined' && filterOpen ? (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 0.5rem)', width: 300, background: theme.colors.cardBackground, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 2250 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 700, color: theme.colors.text }}>Category</div>
                      {(categories || []).map(c => (
                        <button key={c} onClick={() => { setActiveCategory(c); setFilterOpen(false); }} style={{ padding: '0.35rem 0.5rem', borderRadius: 6, border: `1px solid ${theme.colors.border}`, background: activeCategory === c ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff'), color: activeCategory === c ? '#fff' : theme.colors.text }}>{c}</button>
                      ))}
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ fontWeight: 700, color: theme.colors.text, marginBottom: '0.5rem' }}>Medium</div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {(mediums || []).map(m => (
                          <button key={m} onClick={() => { setActiveMedium(m); setFilterOpen(false); }} style={{ padding: '0.35rem 0.5rem', borderRadius: 6, border: `1px solid ${theme.colors.border}`, background: activeMedium === m ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff'), color: activeMedium === m ? '#fff' : theme.colors.text }}>{m}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                      <button onClick={() => { setActiveCategory(null); setActiveMedium(null); setFilterOpen(false); }} style={{ padding: '0.4rem 0.6rem', borderRadius: 6, border: `1px solid ${theme.colors.border}`, background: 'transparent' }}>Clear</button>
                      <button onClick={() => setFilterOpen(false)} style={{ padding: '0.4rem 0.6rem', borderRadius: 6, border: `1px solid ${theme.colors.border}`, background: theme.colors.accent, color: '#fff' }}>Close</button>
                    </div>
                  </div>
                ) : null}
              </div>

              <div style={{ position: 'relative' }}>
                <button onClick={() => { setSortOpen(o => !o); setFilterOpen(false); }} style={{ padding: '0.45rem 0.6rem', borderRadius: 8, border: `1px solid ${theme.colors.border}`, background: theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff', cursor: 'pointer' }}>⇅ Sort</button>
                {typeof sortOpen !== 'undefined' && sortOpen ? (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 0.5rem)', width: 220, background: theme.colors.cardBackground, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 2250 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><input type="radio" name="sort" checked={sortKey === 'title'} onChange={() => { setSortKey('title'); setSortOpen(false); }} /> <span style={{ marginLeft: 6 }}>Title</span></label>
                      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><input type="radio" name="sort" checked={sortKey === 'category'} onChange={() => { setSortKey('category'); setSortOpen(false); }} /> <span style={{ marginLeft: 6 }}>Category</span></label>
                      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><input type="radio" name="sort" checked={sortKey === 'medium'} onChange={() => { setSortKey('medium'); setSortOpen(false); }} /> <span style={{ marginLeft: 6 }}>Medium</span></label>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Single table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Medium</th>
                <th style={thStyle}>Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} style={{ cursor: 'pointer', transition: 'background 180ms ease, transform 160ms ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => { setSelectedItem(row); }} style={{ all: 'unset', cursor: 'pointer', color: theme.colors.accent, fontWeight: 600, transition: 'color 160ms ease' }} onMouseEnter={e => e.currentTarget.style.color = theme.colors.accent} onMouseLeave={e => e.currentTarget.style.color = theme.colors.accent}>{row.title}</button>
                      {row.url ? (
                        <a href={row.url} target="_blank" rel="noreferrer" style={{ color: theme.colors.textSecondary, textDecoration: 'none', transition: 'color 160ms ease' }} title="Open main page">
                          <FaExternalLinkAlt />
                        </a>
                      ) : null}
                    </div>
                  </td>
                  <td style={tdStyle}><button onClick={() => setActiveCategory(row.category)} style={{ padding: '0.25rem 0.5rem', borderRadius: 6, cursor: 'pointer', border: `1px solid ${theme.colors.border}`, background: theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff', color: theme.colors.text, transition: 'background 140ms ease, color 140ms ease' }} onMouseEnter={e => e.currentTarget.style.background = theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} onMouseLeave={e => e.currentTarget.style.background = theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff'}>{row.category}</button></td>
                  <td style={tdStyle}><button onClick={() => setActiveMedium(row.medium)} style={{ padding: '0.25rem 0.5rem', borderRadius: 6, cursor: 'pointer', border: `1px solid ${theme.colors.border}`, background: theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff', color: theme.colors.text, transition: 'background 140ms ease, color 140ms ease' }} onMouseEnter={e => e.currentTarget.style.background = theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} onMouseLeave={e => e.currentTarget.style.background = theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff'}>{row.medium}</button></td>
                  <td style={tdStyle}>{(row.tags || []).map((t, idx) => <Badge key={idx} theme={theme}>{t}</Badge>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

          {/* Detail slide-over panel */}
      {/* Backdrop overlay for smoother feel */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: selectedItem ? 'rgba(0,0,0,0.32)' : 'transparent',
        transition: 'background 260ms cubic-bezier(.2,.9,.2,1)',
        pointerEvents: selectedItem ? 'auto' : 'none',
        zIndex: 2100
      }} onClick={closeDetail} />

      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        transform: selectedItem ? 'translateX(0%)' : 'translateX(105%)',
        width: '460px',
        maxWidth: '96vw',
        height: '100vh',
        background: theme.colors.cardBackground,
        boxShadow: ' -6px 0 30px rgba(0,0,0,0.14)',
        transition: 'transform 320ms cubic-bezier(.22,.9,.34,1)',
        zIndex: 2200,
        overflowY: 'auto',
        padding: '1.25rem 1.5rem'
      }} aria-hidden={!selectedItem}>
        {selectedItem ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, color: theme.colors.text, fontSize: '1.2rem', letterSpacing: '0.2px' }}>{selectedItem.title}</h2>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>{(selectedItem.categories || []).map((t, i) => <Badge key={i} theme={theme}>{t}</Badge>)}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {selectedItem.url ? <a href={selectedItem.url} target="_blank" rel="noreferrer" style={{ color: theme.colors.textSecondary, textDecoration: 'none' }}>↗</a> : null}
                <button onClick={closeDetail} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: theme.colors.textSecondary }}>×</button>
              </div>
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.colors.textSecondary, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem' }}>{/* placeholder left */}</div>
              </div>
              <div style={{ fontSize: '0.9rem' }}>{selectedItem.dateAdded}</div>
            </div>

            {/* TLDR */}
            {selectedItem.tldr && (
              <div>
                <div style={{ color: theme.colors.textSecondary, fontWeight: 600, marginBottom: '0.4rem' }}>TL;DR</div>
                <div style={{ color: theme.colors.text }}>{selectedItem.tldr}</div>
              </div>
            )}

            {/* 2 Cents / Personal */}
            {selectedItem.thoughts && (
              <div>
                <div style={{ color: theme.colors.textSecondary, fontWeight: 600, marginBottom: '0.4rem' }}>Thoughts</div>
                <div style={{ color: theme.colors.text }}>{selectedItem.thoughts}</div>
              </div>
            )}

            {/* Tags */}
            <div>
              <div style={{ color: theme.colors.textSecondary, fontWeight: 600, marginBottom: '0.4rem' }}>Tags</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>{(selectedItem.tags || []).map((t, i) => <Badge key={i} theme={theme}>{t}</Badge>)}</div>
            </div>

            {/* Notes block */}
            {selectedItem.notes && (
              <div style={{ marginTop: '0.75rem', padding: 16, background: theme.isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderLeft: `4px solid ${theme.colors.border}`, color: theme.colors.text, fontSize: '15px', lineHeight: 1.6, fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
                {/* notes controls row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ color: theme.colors.textSecondary, fontSize: '0.9rem', fontWeight: 600 }}>Notes</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button onClick={() => setNotesOpen(o => !o)} style={{ padding: '0.2rem 0.5rem', borderRadius: 6, border: `1px solid ${theme.colors.border}`, background: 'transparent', cursor: 'pointer' }}>{notesOpen ? 'Collapse' : 'Open'}</button>
                  </div>
                </div>

                {/* images allowed by default; Markdown renders images via marked */}

                <div style={{ marginTop: 0 }}>
                  <MarkdownMath text={selectedItem.notes} />
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

    </div>
  );
};

export default BookshelfPage;
