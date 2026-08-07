import React from "react";

const PersonalThoughts = ({ body, tintMix = 14 }) => {
  if (!body?.trim()) return null;

  return (
    <div className="note-modal__body-section">
      <p className="note-modal__section-label">Personal Thoughts</p>
      <div
        className="note-modal__body-wrap"
        style={{ "--nm-body-tint-mix": `${tintMix}%` }}
      >
        <div className="note-modal__body">{body}</div>
      </div>
    </div>
  );
};

export default PersonalThoughts;
