import React, { useMemo } from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import LifeGoalBox from "./LifeGoalBox";
import LifeGoalModal from "./LifeGoalModal";
import lifeGoalsData from "./data/lifeGoals.json";
import { useCarouselModal } from "../Notes/shared/useCarouselModal";
import "../Principles/NotesSection.css";

const LifeGoalsSection = () => {
  const { theme } = useTheme();

  const allGoals = useMemo(
    () =>
      lifeGoalsData.map((entry) => ({
        goal: entry.goal,
        body: entry.body ?? "",
        imageKey: entry.imageKey,
      })),
    []
  );

  const {
    selectedIndex,
    openAt,
    close,
    goPrevious,
    goNext,
    hasPrevious,
    hasNext,
  } = useCarouselModal(allGoals.length);

  const selected = selectedIndex != null ? allGoals[selectedIndex] : null;

  return (
    <div
      className="notes-section"
      style={{ color: theme.colors.text }}
    >
      <h2 className="notes-section__title" style={{ color: theme.colors.text }}>
        Lifelong Goals
      </h2>

      <div className="notes-section__grid">
        {allGoals.map((item, index) => (
          <LifeGoalBox
            key={`${item.goal}-${index}`}
            text={item.goal}
            theme={theme}
            isActive={selectedIndex === index}
            onOpen={() => openAt(index)}
            imageKey={item.imageKey}
          />
        ))}
      </div>

      <LifeGoalModal
        lifeGoal={selected}
        animationKey={selectedIndex}
        onClose={close}
        onPrevious={goPrevious}
        onNext={goNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        theme={theme}
      />
    </div>
  );
};

export default LifeGoalsSection;
