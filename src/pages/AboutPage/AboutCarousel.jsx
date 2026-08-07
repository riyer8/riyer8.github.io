import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import carouselPhotos from "../../assets/aboutCarouselPhotos.json";
import { SRC_BY_FILENAME } from "../../assets/profilePhotos";
import "./AboutCarousel.css";

const PHOTOS = carouselPhotos.photos
  .map((entry) => ({
    src: SRC_BY_FILENAME[entry.file],
    alt: typeof entry.alt === "string" && entry.alt.trim() ? entry.alt : "Ramya Iyer",
    caption: typeof entry.caption === "string" ? entry.caption : "",
  }))
  .filter((p) => p.src != null);

const AUTO_ADVANCE_MS = 5500;
const CROSSFADE_EASE = [0.22, 1, 0.36, 1];

const AboutCarousel = () => {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slideTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.72, ease: CROSSFADE_EASE };

  const captionTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: CROSSFADE_EASE };

  const goTo = useCallback((nextIndex) => {
    setIndex((nextIndex + PHOTOS.length) % PHOTOS.length);
  }, []);

  const goNext = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const goPrev = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  useEffect(() => {
    if (paused || prefersReducedMotion) return undefined;

    const timer = window.setInterval(goNext, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [goNext, paused, prefersReducedMotion]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  const active = PHOTOS[index];

  return (
    <div
      className="about-carousel"
      style={{
        "--carousel-accent": theme.colors.accent,
        "--carousel-border": theme.colors.border,
        "--carousel-muted": theme.colors.textSecondary,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="about-carousel__frame"
        aria-roledescription="carousel"
        aria-label="Photo gallery"
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.img
            key={active.src}
            src={active.src}
            alt={active.alt}
            width={800}
            height={1000}
            className="about-carousel__slide"
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={slideTransition}
          />
        </AnimatePresence>

        <button
          type="button"
          className="about-carousel__nav about-carousel__nav--prev"
          onClick={goPrev}
          aria-label="Previous photo"
        >
          ‹
        </button>
        <button
          type="button"
          className="about-carousel__nav about-carousel__nav--next"
          onClick={goNext}
          aria-label="Next photo"
        >
          ›
        </button>
      </div>

      <div className="about-carousel__meta">
        <div
          className="about-carousel__caption-wrap"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            {active.caption ? (
              <motion.p
                key={`caption-${index}`}
                className="about-carousel__caption"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={captionTransition}
              >
                {active.caption}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="about-carousel__dots" role="tablist" aria-label="Choose photo">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1} of ${PHOTOS.length}`}
              className={`about-carousel__dot${i === index ? " about-carousel__dot--active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutCarousel;
