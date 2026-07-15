export const NOTE_MODAL_EASE = [0.4, 0, 0.2, 1];

export const noteModalContentVariants = {
  enter: {
    opacity: 0,
  },
  center: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export function getNoteModalTransitions(prefersReducedMotion) {
  if (prefersReducedMotion) {
    return {
      backdrop: { duration: 0 },
      panel: { duration: 0 },
      content: { duration: 0 },
      layout: { duration: 0 },
    };
  }

  return {
    backdrop: { duration: 0.42, ease: NOTE_MODAL_EASE },
    panel: { duration: 0.32, ease: NOTE_MODAL_EASE, delay: 0.04 },
    content: { duration: 0.44, ease: NOTE_MODAL_EASE },
    layout: { duration: 0.38, ease: NOTE_MODAL_EASE },
  };
}
