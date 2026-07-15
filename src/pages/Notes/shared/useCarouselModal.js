import { useCallback, useState } from "react";

export function useCarouselModal(itemCount) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openAt = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const close = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const goPrevious = useCallback(() => {
    setSelectedIndex((current) => {
      if (current == null || current <= 0) return current;
      return current - 1;
    });
  }, []);

  const goNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current == null || current >= itemCount - 1) return current;
      return current + 1;
    });
  }, [itemCount]);

  return {
    selectedIndex,
    openAt,
    close,
    goPrevious,
    goNext,
    hasPrevious: selectedIndex != null && selectedIndex > 0,
    hasNext: selectedIndex != null && selectedIndex < itemCount - 1,
  };
}
