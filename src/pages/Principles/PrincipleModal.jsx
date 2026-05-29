import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./PrincipleModal.css";

const EASE = [0.22, 1, 0.36, 1];

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

  const backdropTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.42, ease: EASE };

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: EASE, delay: 0.04 };

  const contentTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: EASE };

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
          initial={false}
        >
          <motion.button
            type="button"
            className="principle-modal__backdrop"
            aria-label="Close principle"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
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
                prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.985 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion ? undefined : { opacity: 0, y: 6, scale: 0.99 }
              }
              transition={panelTransition}
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

              <AnimatePresence mode="wait">
                <motion.div
                  key={animationKey}
                  className={(() => {
                    const hasBody = Boolean(principle.body?.trim());
                    const hasSource = Boolean(principle.source?.trim());
                    return [
                      "principle-modal__card",
                      !hasBody && !hasSource && "principle-modal__card--compact",
                      !hasBody && hasSource && "principle-modal__card--title-source",
                    ]
                      .filter(Boolean)
                      .join(" ");
                  })()}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={contentTransition}
                >
                  <header className="principle-modal__header">
                    <p className="principle-modal__category">{categoryTitle}</p>
                    <h2 id="principle-modal-title" className="principle-modal__title">
                      {principle.principle}
                    </h2>
                  </header>

                  <div className="principle-modal__main">
                    {principle.body?.trim() ? (
                      <div className="principle-modal__body-wrap">
                        <p className="principle-modal__section-label">Personal Thoughts</p>
                        <div className="principle-modal__body">{principle.body}</div>
                      </div>
                    ) : null}
                  </div>

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
