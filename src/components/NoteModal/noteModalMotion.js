const NOTE_MODAL_EASE = [0.22, 1, 0.36, 1];

export const noteModalContentVariants = {
  enter: (direction = 0) => ({
    opacity: 0,
    x: direction === 0 ? 0 : direction > 0 ? 18 : -18,
    y: direction === 0 ? 8 : 0,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
  },
  exit: (direction = 0) => ({
    opacity: 0,
    x: direction === 0 ? 0 : direction > 0 ? -14 : 14,
    y: direction === 0 ? -6 : 0,
  }),
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
    backdrop: { duration: 0.38, ease: NOTE_MODAL_EASE },
    panel: { duration: 0.42, ease: NOTE_MODAL_EASE },
    content: { duration: 0.34, ease: NOTE_MODAL_EASE },
    layout: { duration: 0.38, ease: NOTE_MODAL_EASE },
  };
}
