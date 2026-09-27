import { getLifeGoalImage } from "./lifeGoalImages";
import NoteModalShell from "../../../components/NoteModal/NoteModalShell";
import PersonalThoughts from "../../../components/NoteModal/PersonalThoughts";
import "./LifeGoalModal.css";

const LifeGoalModal = ({
  lifeGoal,
  animationKey,
  direction = 0,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  theme,
}) => {
  const themeVars = {
    "--nm-text": theme.colors.text,
    "--nm-muted": theme.colors.textSecondary,
    "--nm-accent": theme.colors.accent,
    "--nm-border": theme.colors.border,
    "--nm-surface": theme.isDarkMode
      ? "rgba(22, 24, 28, 0.98)"
      : "rgba(255, 255, 255, 0.99)",
    "--nm-panel-width": "30rem",
    "--nm-panel-width-mobile": "23.5rem",
  };

  const imageSrc = getLifeGoalImage(lifeGoal?.imageKey);

  return (
    <NoteModalShell
      isOpen={Boolean(lifeGoal)}
      contentKey={`life-goal-${animationKey}`}
      titleId="life-goal-modal-title"
      labels={{
        backdrop: "Close life goal",
        close: "Close",
        previous: "Previous life goal",
        next: "Next life goal",
      }}
      themeVars={themeVars}
      panelClassName={theme.isDarkMode ? "life-goal-modal__panel--dark" : ""}
      closeVariant="hero"
      direction={direction}
      onClose={onClose}
      onPrevious={onPrevious}
      onNext={onNext}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
    >
      <div className="life-goal-modal__hero">
        <img
          src={imageSrc}
          alt=""
          className="life-goal-modal__hero-image"
          draggable={false}
        />
        <div className="life-goal-modal__hero-overlay" aria-hidden="true" />
        <div className="life-goal-modal__hero-content">
          <h2 id="life-goal-modal-title" className="life-goal-modal__title">
            {lifeGoal?.goal}
          </h2>
        </div>
      </div>

      <PersonalThoughts body={lifeGoal?.body} tintMix={8} />
    </NoteModalShell>
  );
};

export default LifeGoalModal;
