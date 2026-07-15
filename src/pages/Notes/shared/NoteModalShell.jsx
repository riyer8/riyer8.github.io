import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  getNoteModalTransitions,
  noteModalContentVariants,
} from "./noteModalMotion";
import "./NoteModal.css";

const NoteModalShell = ({
  isOpen,
  contentKey,
  titleId,
  ariaLabel,
  labels,
  themeVars,
  panelClassName = "",
  panelStyle,
  cardClassName = "",
  closeVariant = "panel",
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const transitions = getNoteModalTransitions(prefersReducedMotion);

  useEffect(() => {
    if (!isOpen) return undefined;

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
  }, [isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="note-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          style={themeVars}
          initial={false}
        >
          <motion.button
            type="button"
            className="note-modal__backdrop"
            aria-label={labels.backdrop}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.backdrop}
          />

          <div className="note-modal__panel-wrap">
            {hasPrevious && (
              <button
                type="button"
                className="note-modal__nav note-modal__nav--prev"
                onClick={onPrevious}
                aria-label={labels.previous}
              >
                ‹
              </button>
            )}

            <motion.div
              className={["note-modal__panel", panelClassName].filter(Boolean).join(" ")}
              style={panelStyle}
              layout
              initial={
                prefersReducedMotion ? false : { opacity: 0, scale: 0.985 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={
                prefersReducedMotion ? undefined : { opacity: 0, scale: 0.99 }
              }
              transition={{
                ...transitions.panel,
                layout: transitions.layout,
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className={`note-modal__close note-modal__close--${closeVariant}`}
                onClick={onClose}
                aria-label={labels.close}
              >
                ×
              </button>

              <div className="note-modal__content-stage">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={contentKey}
                    className={["note-modal__card", cardClassName].filter(Boolean).join(" ")}
                    variants={noteModalContentVariants}
                    initial={prefersReducedMotion ? false : "enter"}
                    animate="center"
                    exit={prefersReducedMotion ? undefined : "exit"}
                    transition={transitions.content}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="note-modal__mobile-nav">
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
                className="note-modal__nav note-modal__nav--next"
                onClick={onNext}
                aria-label={labels.next}
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

export default NoteModalShell;
