import { useEffect, useState } from "react";
import { useTheme } from "../ThemeContext/ThemeContext";
import { useCommandPalette } from "../CommandPalette/CommandPalette";
import "./SiteFooter.css";

const FORTUNES = [
  "not too sure what a footer is supposed to do on websites.",
  "probably started my recent github project as a joke, but now its burning my credits.",
  "my evals run for hours, so i code fun things on the side :)"
];

const pickFortune = (current) => {
  if (FORTUNES.length < 2) return FORTUNES[0];
  let next = current;
  while (next === current) {
    next = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  }
  return next;
};

const SiteFooter = () => {
  const { theme } = useTheme();
  const { open } = useCommandPalette();
  const [fortune, setFortune] = useState(null);

  useEffect(() => {
    if (!fortune) return undefined;
    const hide = () => setFortune(null);
    window.addEventListener("scroll", hide, { passive: true });
    return () => window.removeEventListener("scroll", hide);
  }, [fortune]);

  return (
    <footer
      className="site-footer"
      style={{
        "--sf-text": theme.colors.text,
        "--sf-muted": theme.colors.textSecondary,
        "--sf-accent": theme.colors.accent,
        "--sf-surface": theme.colors.cardBackground,
      }}
    >
      <span className="site-footer__copy">© 2026 Ramya Iyer</span>
      <span className="site-footer__psst-wrap">
        <button
          type="button"
          className="site-footer__psst"
          onClick={() =>
            setFortune((current) => (current ? null : pickFortune(null)))
          }
        >
          made with care :)
        </button>
        {fortune ? (
          <span className="site-footer__fortune" role="status">
            {fortune}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        className="site-footer__kbd"
        onClick={open}
        aria-label="Open command palette"
      >
        ⌘K
      </button>
    </footer>
  );
};

export default SiteFooter;
