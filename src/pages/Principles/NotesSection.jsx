import React, { useEffect, useState } from 'react';
import { useTheme } from '../../components/ThemeContext/ThemeContext';
import NoteBox from './NoteBox';
import notesPersonal from './data/personal.txt';
import notesProduct from './data/products.txt';
import notesAriana from './data/ariana.txt';
import './NotesSection.css';

const NOTES_CONFIG = [
  { file: notesPersonal, title: 'personal principles.', colorLight: '#f5fff3ff', colorDark: '#3c3e3cff' },
  { file: notesAriana, title: 'ariana grande lyrics.', colorLight: '#f5fff3ff', colorDark: '#3c3e3cff' },
  { file: notesProduct, title: 'products principles.', colorLight: '#f0f8ff', colorDark: '#2b2f3b' },

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
    <div
      className="notes-section"
      style={{
        '--notes-font': theme.fonts?.base || 'sans-serif',
        color: theme.colors.text,
        fontFamily: theme.fonts?.base || 'sans-serif',
      }}
    >
      <h2 className="notes-section__title" style={{ color: theme.colors.text }}>
        A Messy Collection of Life Advice
      </h2>

      <div className="notes-section__grid">
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
