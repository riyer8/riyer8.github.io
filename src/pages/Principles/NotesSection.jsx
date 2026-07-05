import React, { useMemo, useState } from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import NoteBox from "./NoteBox";
import PrincipleModal from "./PrincipleModal";
import personal from "./data/personal.json";
import ariana from "./data/ariana.json";
import products from "./data/products.json";
import "./NotesSection.css";

/** Add or remove category files here — same pattern as the old .txt setup. */
const NOTES_CONFIG = [personal, ariana, products];

const NotesSection = () => {
  const { theme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const allNotes = useMemo(() => {
    const loaded = [];
    for (const { title, colorLight, colorDark, principles } of NOTES_CONFIG) {
      principles.forEach((entry) => {
        loaded.push({
          principle: entry.principle,
          body: entry.body ?? "",
          source: entry.source,
          categoryTitle: title,
          colorLight,
          colorDark,
        });
      });
    }
    return loaded;
  }, []);

  const selected = selectedIndex != null ? allNotes[selectedIndex] : null;

  const openAt = (index) => setSelectedIndex(index);
  const close = () => setSelectedIndex(null);
  const goPrevious = () => {
    if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };
  const goNext = () => {
    if (selectedIndex < allNotes.length - 1) setSelectedIndex(selectedIndex + 1);
  };

  return (
    <div
      className="notes-section"
      style={{
        color: theme.colors.text,
      }}
    >
      <h2 className="notes-section__title" style={{ color: theme.colors.text }}>
        A Messy Collection of Life Advice
      </h2>

      <div className="notes-section__grid">
        {allNotes.map((item, index) => (
          <NoteBox
            key={`${item.categoryTitle}-${item.principle}`}
            text={item.principle}
            categoryTitle={item.categoryTitle}
            bgColorLight={item.colorLight}
            bgColorDark={item.colorDark}
            theme={theme}
            isActive={selectedIndex === index}
            onOpen={() => openAt(index)}
          />
        ))}
      </div>

      <PrincipleModal
        principle={selected}
        categoryTitle={selected?.categoryTitle}
        animationKey={selectedIndex}
        onClose={close}
        onPrevious={goPrevious}
        onNext={goNext}
        hasPrevious={selectedIndex > 0}
        hasNext={selectedIndex != null && selectedIndex < allNotes.length - 1}
        theme={theme}
      />
    </div>
  );
};

export default NotesSection;
