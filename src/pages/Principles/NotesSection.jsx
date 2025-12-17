import React, { useEffect, useState } from 'react';
import { useTheme } from '../../components/ThemeContext/ThemeContext';
import NoteBox from './NoteBox';
import notesPersonal from './data/personal.txt';
import notesProduct from './data/products.txt';
import notesAdmire from './data/admire.txt';

const NOTES_CONFIG = [
  { file: notesPersonal, title: 'personal', colorLight: '#f5fff3ff', colorDark: '#3c3e3cff' },
  { file: notesProduct, title: 'products', colorLight: '#f0f8ff', colorDark: '#2b2f3b' },
  { file: notesAdmire, title: 'people i admire', colorLight: '#fff5f5ff', colorDark: '#3f2b2b' },
];

const NotesSection = () => {
  const { theme } = useTheme();
  const [allNotes, setAllNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      const loaded = [];
      for (let { file, title, colorLight, colorDark } of NOTES_CONFIG) {
        const text = await fetch(file).then(res => res.text());
        const notes = text.split('\n').filter(line => line.trim() !== '');
        notes.forEach(note => loaded.push({ note, title, colorLight, colorDark }));
      }
      setAllNotes(loaded);
    };
    loadNotes();
  }, []);

  return (
    <div style={{ padding: '4rem 2rem', fontFamily: theme.fonts?.base || 'sans-serif' }}>
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: '2rem',
          color: theme.colors.text,
        }}
      >
        notes to myself
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        {allNotes.map((item, idx) => (
          <NoteBox
            key={idx}
            text={item.note}
            categoryTitle={item.title}
            bgColorLight={item.colorLight}
            bgColorDark={item.colorDark}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesSection;
