import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import { useSiteToast } from "../../../components/SiteToast/SiteToast";
import NoteBox from "./NoteBox";
import PrincipleModal from "./PrincipleModal";
import personal from "./data/personal.json";
import ariana from "./data/ariana.json";
import products from "./data/products.json";
import quotes from "./data/quotes.json";
import { slugifyPrinciple } from "./noteIds";
import { useCarouselModal } from "../../../components/NoteModal/useCarouselModal";
import "./NotesSection.css";

/** Add or remove category files here — same pattern as the old .txt setup. */
const NOTES_CONFIG = [personal, ariana, products];
const QUOTES_CONFIG = [quotes];

const NotesSection = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const { showToast } = useSiteToast();
  const [highlightedId, setHighlightedId] = useState(null);

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
    return loaded.map((item, index) => ({
      ...item,
      id: slugifyPrinciple(item.principle, index),
    }));
  }, []);

  const {
    selectedIndex,
    direction,
    openAt,
    close,
    goPrevious,
    goNext,
    hasPrevious,
    hasNext,
  } = useCarouselModal(allNotes.length);

  const selected = selectedIndex != null ? allNotes[selectedIndex] : null;

  useEffect(() => {
    const id = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (!id) return undefined;
    const exists = allNotes.some((note) => note.id === id);
    if (!exists) return undefined;
    const el = document.getElementById(id);
    if (!el) return undefined;
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
    setHighlightedId(id);
    const timer = window.setTimeout(() => setHighlightedId(null), 1400);
    return () => window.clearTimeout(timer);
  }, [location.hash, allNotes, prefersReducedMotion]);

  const copyNoteLink = async (id) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      if (window.location.hash !== `#${id}`) {
        window.history.replaceState(null, "", `#${id}`);
      }
      showToast("link copied!");
    } catch {
      window.location.hash = id;
      showToast("link ready in the address bar");
    }
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
            key={item.id}
            id={item.id}
            text={item.principle}
            categoryTitle={item.categoryTitle}
            bgColorLight={item.colorLight}
            bgColorDark={item.colorDark}
            theme={theme}
            isActive={selectedIndex === index}
            isHighlighted={highlightedId === item.id}
            onOpen={() => openAt(index)}
            onCopyLink={copyNoteLink}
          />
        ))}
      </div>

      <PrincipleModal
        principle={selected}
        categoryTitle={selected?.categoryTitle}
        animationKey={selectedIndex}
        direction={direction}
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

export default NotesSection;
