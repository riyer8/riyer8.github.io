import React from "react";
import { getLifeGoalImage } from "./lifeGoalImages";
import "./LifeGoalBox.css";

const LifeGoalBox = ({
  text,
  theme,
  onOpen,
  isActive,
  imageKey,
}) => {
  const imageSrc = getLifeGoalImage(imageKey);

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
      className={`life-goal-box ${theme.isDarkMode ? "dark-mode" : ""} ${
        isActive ? "life-goal-box--active" : ""
      }`}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      aria-label={`Open life goal: ${text}`}
    >
      <img
        src={imageSrc}
        alt=""
        className="life-goal-box__image"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <div className="life-goal-box__content">{text}</div>
    </div>
  );
};

export default LifeGoalBox;
