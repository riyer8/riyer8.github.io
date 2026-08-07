import NoteModalShell from "../../../components/NoteModal/NoteModalShell";
import PersonalThoughts from "../../../components/NoteModal/PersonalThoughts";
import "./PrincipleModal.css";

const PrincipleModal = ({
  principle,
  categoryTitle,
  animationKey,
  direction = 0,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  theme,
}) => {
  const cardTint = theme.isDarkMode
    ? principle?.colorDark
    : principle?.colorLight;

  const hasBody = Boolean(principle?.body?.trim());
  const hasSource = Boolean(principle?.source?.trim());

  const cardClassName = [
    !hasBody && !hasSource && "principle-modal__card--compact",
    !hasBody && hasSource && "principle-modal__card--title-source",
  ]
    .filter(Boolean)
    .join(" ");

  const themeVars = {
    "--nm-text": theme.colors.text,
    "--nm-muted": theme.colors.textSecondary,
    "--nm-accent": theme.colors.accent,
    "--nm-accent-secondary": theme.colors.accentSecondary,
    "--nm-border": theme.colors.border,
    "--nm-tint": cardTint || theme.colors.backgroundAccentPrimary,
    "--nm-surface": theme.isDarkMode
      ? "rgba(26, 28, 32, 0.97)"
      : "rgba(255, 255, 255, 0.98)",
    "--nm-panel-width": "26.5rem",
    "--nm-panel-width-mobile": "22.5rem",
  };

  return (
    <NoteModalShell
      isOpen={Boolean(principle)}
      contentKey={`principle-${animationKey}`}
      titleId="principle-modal-title"
      labels={{
        backdrop: "Close principle",
        close: "Close",
        previous: "Previous principle",
        next: "Next principle",
      }}
      themeVars={themeVars}
      panelClassName="note-modal__panel--fixed-height principle-modal__panel"
      cardClassName={cardClassName}
      closeVariant="panel"
      direction={direction}
      onClose={onClose}
      onPrevious={onPrevious}
      onNext={onNext}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
    >
      <header className="principle-modal__header">
        <p className="principle-modal__category">{categoryTitle}</p>
        <h2 id="principle-modal-title" className="principle-modal__title">
          {principle?.principle}
        </h2>
      </header>

      <div className="principle-modal__main">
        <PersonalThoughts body={principle?.body} />
      </div>

      {principle?.source?.trim() ? (
        <footer className="principle-modal__footer">
          <span className="principle-modal__source-label">Source</span>
          <p className="principle-modal__source">
            {/^https?:\/\//i.test(principle.source) ? (
              <a
                href={principle.source}
                target="_blank"
                rel="noopener noreferrer"
              >
                {principle.source}
              </a>
            ) : (
              <span>{principle.source}</span>
            )}
          </p>
        </footer>
      ) : null}
    </NoteModalShell>
  );
};

export default PrincipleModal;
