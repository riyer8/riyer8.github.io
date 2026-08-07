import { useCallback, useState } from "react";

export function useCarouselModal(itemCount) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(0);

  const openAt = useCallback((index) => {
    setDirection(0);
    setSelectedIndex(index);
  }, []);

  const close = useCallback(() => {
    setDirection(0);
    setSelectedIndex(null);
  }, []);

  const goPrevious = useCallback(() => {
    setDirection(-1);
    setSelectedIndex((current) => {
      if (current == null || current <= 0) return current;
      return current - 1;
    });
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setSelectedIndex((current) => {
      if (current == null || current >= itemCount - 1) return current;
      return current + 1;
    });
  }, [itemCount]);

  return {
    selectedIndex,
    direction,
    openAt,
    close,
    goPrevious,
    goNext,
    hasPrevious: selectedIndex != null && selectedIndex > 0,
    hasNext: selectedIndex != null && selectedIndex < itemCount - 1,
  };
}
