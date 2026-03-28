import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import carouselPhotos from "../../assets/aboutCarouselPhotos.json";
import photo1 from "../../assets/photo1.png";
import photo2 from "../../assets/photo2.png";
import photo3 from "../../assets/photo3.png";
import photo4 from "../../assets/photo4.jpeg";
import photo5 from "../../assets/photo5.jpeg";
import "./AboutCarousel.css";

/** Must match filenames in src/assets/. Edit captions in aboutCarouselPhotos.json. */
const SRC_BY_FILENAME = {
  "photo1.png": photo1,
  "photo2.png": photo2,
  "photo3.png": photo3,
  "photo4.jpeg": photo4,
  "photo5.jpeg": photo5,
};

const PHOTOS = carouselPhotos.photos
  .map((entry) => ({
    src: SRC_BY_FILENAME[entry.file],
    alt: typeof entry.alt === "string" && entry.alt.trim() ? entry.alt : "Ramya Iyer",
    caption: typeof entry.caption === "string" ? entry.caption : "",
  }))
  .filter((p) => p.src != null);

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
            width={800}
            height={1000}
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

      <div className="about-carousel__meta">
        <div
          className="about-carousel__caption-wrap"
          aria-live="polite"
          aria-atomic="true"
        >
          {PHOTOS[index].caption ? (
            <p key={index} className="about-carousel__caption">
              {PHOTOS[index].caption}
            </p>
          ) : null}
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
