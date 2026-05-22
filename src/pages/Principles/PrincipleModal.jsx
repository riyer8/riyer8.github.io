import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./PrincipleModal.css";

const PrincipleModal = ({
  principle,
  categoryTitle,
  animationKey,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  theme,
}) => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!principle) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasPrevious) onPrevious();
      if (event.key === "ArrowRight" && hasNext) onNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [principle, onClose, onPrevious, onNext, hasPrevious, hasNext]);

  const fade = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: "easeOut" };

  const cardTint = theme.isDarkMode
    ? principle?.colorDark
    : principle?.colorLight;

  const themeVars = {
    "--modal-text": theme.colors.text,
    "--modal-muted": theme.colors.textSecondary,
    "--modal-accent": theme.colors.accent,
    "--modal-accent-secondary": theme.colors.accentSecondary,
    "--modal-border": theme.colors.border,
    "--modal-tint": cardTint || theme.colors.backgroundAccentPrimary,
    "--modal-surface": theme.isDarkMode
      ? "rgba(26, 28, 32, 0.97)"
      : "rgba(255, 255, 255, 0.98)",
  };

  const content = (
    <AnimatePresence>
      {principle && (
        <motion.div
          className="principle-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="principle-modal-title"
          style={themeVars}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
        >
          <button
            type="button"
            className="principle-modal__backdrop"
            aria-label="Close principle"
            onClick={onClose}
          />

          <div className="principle-modal__panel-wrap">
            {hasPrevious && (
              <button
                type="button"
                className="principle-modal__nav principle-modal__nav--prev"
                onClick={onPrevious}
                aria-label="Previous principle"
              >
                ‹
              </button>
            )}

            <motion.div
              className="principle-modal__panel"
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 8, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={fade}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="principle-modal__close"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>

              <p className="principle-modal__category">{categoryTitle}</p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={animationKey}
                  className="principle-modal__content"
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={fade}
                >
                  <h2 id="principle-modal-title" className="principle-modal__title">
                    {principle.principle}
                  </h2>

                  {principle.body?.trim() ? (
                    <div className="principle-modal__body-wrap">
                      <div className="principle-modal__body">{principle.body}</div>
                    </div>
                  ) : null}

                  {principle.source?.trim() ? (
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
                </motion.div>
              </AnimatePresence>

              <div className="principle-modal__mobile-nav">
                {hasPrevious && (
                  <button type="button" onClick={onPrevious}>
                    ← Previous
                  </button>
                )}
                {hasNext && (
                  <button type="button" onClick={onNext}>
                    Next →
                  </button>
                )}
              </div>
            </motion.div>

            {hasNext && (
              <button
                type="button"
                className="principle-modal__nav principle-modal__nav--next"
                onClick={onNext}
                aria-label="Next principle"
              >
                ›
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

export default PrincipleModal;
