import React from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import PixelatedBackground from "../../components/Background/PixelatedBackground";
import NotesSection from "../Principles/NotesSection";
import AboutCarousel from "./AboutCarousel";
import "./AboutPage.css";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/riyer8" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ramya-i/" },
  { label: "X", href: "https://x.com/ramya_iyer1" },
  { label: "Email", href: "mailto:ramya1@stanford.edu" },
  {
    label: "Google Scholar",
    href: "https://scholar.google.com/citations?user=uou0pPoAAAAJ&hl=en",
  },
];

const AboutPage = () => {
  const { theme } = useTheme();

  const homeButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.4rem 0.6rem",
    borderRadius: 8,
    background: theme.isDarkMode ? "rgba(255,255,255,0.04)" : theme.colors.accent,
    color: theme.isDarkMode ? theme.colors.text : "#fff",
    border: `1px solid ${theme.colors.border}`,
    cursor: "pointer",
    fontFamily: theme.fonts?.base,
  };

  return (
    <>
      <PixelatedBackground />

      <div
        className="about-page"
        style={{
          color: theme.colors.text,
          fontFamily: theme.fonts?.base,
          "--about-text": theme.colors.text,
          "--about-muted": theme.colors.textSecondary,
          "--about-accent": theme.colors.accent,
        }}
      >
        <main className="about-page__content">
          <a href="/" className="about-page__home-link" style={{ textDecoration: "none" }}>
            <button type="button" style={homeButtonStyle}>
              ← Home
            </button>
          </a>

          <section className="about-page__hero" aria-label="About Ramya">
            <AboutCarousel />

            <div className="about-page__intro">
              <h1 className="about-page__title" style={{ color: theme.colors.text }}>
                Hi, I&apos;m Ramya.
              </h1>

              <p className="about-page__lead">
                I&apos;ve always found it unrealistic to try to define who I am in a few
                sentences—it&apos;d probably be updated every other day anyway. If you want
                to know me, let&apos;s chat! Email me at{" "}
                <a href="mailto:ramya1@stanford.edu" className="about-page__email">
                  ramya1@stanford.edu
                </a>
                ; I pride myself on replying to <em>exciting</em> emails rather quickly.
              </p>

              <p className="about-page__note">Even this will probably be updated soon ✨</p>

              <ul className="about-page__links">
                {SOCIAL_LINKS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="about-page__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        <section className="about-page__principles" aria-label="Life advice notes">
          <NotesSection />
        </section>
      </div>
    </>
  );
};

export default AboutPage;
