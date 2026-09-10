import React from "react";
import "./NoteBox.css";

const NoteBox = ({
  id,
  text,
  bgColorLight,
  bgColorDark,
  categoryTitle,
  theme,
  onOpen,
  onCopyLink,
  isActive,
  isHighlighted,
}) => {
  const backgroundColor = theme.isDarkMode ? bgColorDark : bgColorLight;
  const textColor = theme.isDarkMode ? "#fff" : "#000";

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  const handleCopyLink = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onCopyLink?.(id);
  };

  return (
    <div
      id={id}
      role="button"
      tabIndex={0}
      className={`note-box ${theme.isDarkMode ? "dark-mode" : ""} ${
        isActive ? "note-box--active" : ""
      } ${isHighlighted ? "note-box--flash" : ""}`}
      style={{ background: backgroundColor, color: textColor }}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      aria-label={`Open principle: ${text}`}
    >
      {id ? (
        <a
          href={`#${id}`}
          className="note-box__anchor"
          aria-label={`Copy link to ${text}`}
          onClick={handleCopyLink}
        >
          #
        </a>
      ) : null}
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
