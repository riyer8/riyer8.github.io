import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import photo1 from "../../assets/photo1.png";
import photo2 from "../../assets/photo2.png";
import photo3 from "../../assets/photo3.png";
import photo4 from "../../assets/photo4.jpeg";
import "./AboutCarousel.css";

const PHOTOS = [
  { src: photo1, alt: "Ramya Iyer" },
  { src: photo2, alt: "Ramya Iyer" },
  { src: photo3, alt: "Ramya Iyer" },
  { src: photo4, alt: "Ramya Iyer" },
];

const AUTO_ADVANCE_MS = 5500;

const AboutCarousel = () => {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((nextIndex) => {
    setIsFading(true);
    window.setTimeout(() => {
      setIndex((nextIndex + PHOTOS.length) % PHOTOS.length);
      setIsFading(false);
    }, 280);
  }, []);

  const goNext = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const goPrev = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  useEffect(() => {
    if (paused) return undefined;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (prefersReduced) return undefined;

    const timer = window.setInterval(goNext, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [goNext, paused]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

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
        {PHOTOS.map((photo, i) => (
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            className={`about-carousel__slide${
              i === index ? " about-carousel__slide--active" : ""
            }${isFading && i === index ? " about-carousel__slide--fading" : ""}`}
            draggable={false}
          />
        ))}

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
  );
};

export default AboutCarousel;
