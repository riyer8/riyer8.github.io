import React, { useState } from 'react';
import './NoteBox.css';

const NoteBox = ({ text, bgColorLight, bgColorDark, categoryTitle, theme }) => {
  const [hover, setHover] = useState(false);

  const backgroundColor = theme.isDarkMode ? bgColorDark : bgColorLight;
  const textColor = theme.isDarkMode ? '#fff' : '#000';

  return (
    <div
      className={`note-box ${theme.isDarkMode ? 'dark-mode' : ''}`}
      style={{ background: backgroundColor, color: textColor }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {text}
      {hover && (
        <div className="note-tooltip">
          {categoryTitle} principles.
        </div>
      )}
    </div>

  );
};

export default NoteBox;
