import React from "react";
import "./NoteBox.css";

const NoteBox = ({
  text,
  bgColorLight,
  bgColorDark,
  categoryTitle,
  theme,
  onOpen,
  isActive,
}) => {
  const backgroundColor = theme.isDarkMode ? bgColorDark : bgColorLight;
  const textColor = theme.isDarkMode ? "#fff" : "#000";

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`note-box ${theme.isDarkMode ? "dark-mode" : ""} ${
        isActive ? "note-box--active" : ""
      }`}
      style={{ background: backgroundColor, color: textColor }}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      aria-label={`Open principle: ${text}`}
    >
      {text}
      {!isActive && (
        <div className="note-tooltip" aria-hidden="true">
          {categoryTitle}
        </div>
      )}
    </div>
  );
};

export default NoteBox;
