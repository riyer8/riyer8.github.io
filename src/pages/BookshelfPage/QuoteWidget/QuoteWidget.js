import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./QuoteWidget.css";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import bookshelfData from "../data/bookshelfData";
import { titleToSlug } from "../bookshelfUtils";

const LOCAL_STORAGE_KEY = "dailyQuote";

function extractQuotesWithMetadata() {
  const quoteRegex = /^>\s*(.+)$/gm;

  return bookshelfData.flatMap((entry) => {
    if (entry.archives === true) return [];
    if (!entry.notes) return [];

    const matches = [...entry.notes.matchAll(quoteRegex)];

    return matches.map((m) => ({
      quote: m[1].trim(),
      title: entry.title,
    }));
  });
}

function cleanQuote(quote) {
  return quote
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1");
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function loadDailyQuote(quotes) {
  const todayStr = new Date().toDateString();
  let stored = null;

  try {
    stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  } catch {
    stored = null;
  }

  if (stored?.date === todayStr && stored.quote) {
    return stored.quote;
  }

  const todayQuote = pickRandom(quotes);

  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ date: todayStr, quote: todayQuote })
    );
  } catch (e) {
    console.warn("Failed to write daily quote to localStorage", e);
  }

  return todayQuote;
}

/**
 * @param {'default' | 'compact'} variant
 * @param {string | null} contextTitle — when set (e.g. notes panel open), prefer a quote from that entry
 */
const QuoteWidget = ({ variant = "default", contextTitle = null }) => {
  const { theme } = useTheme();
  const quotes = useMemo(() => {
    try {
      return extractQuotesWithMetadata();
    } catch (e) {
      console.error("Failed to extract quotes", e);
      return [];
    }
  }, []);

  const [displayQuote, setDisplayQuote] = useState(null);
  const [isFromContext, setIsFromContext] = useState(false);

  useEffect(() => {
    if (!quotes.length) return;

    if (contextTitle) {
      const entryQuotes = quotes.filter((q) => q.title === contextTitle);
      if (entryQuotes.length) {
        setDisplayQuote(pickRandom(entryQuotes));
        setIsFromContext(true);
        return;
      }
    }

    setDisplayQuote(loadDailyQuote(quotes));
    setIsFromContext(false);
  }, [quotes, contextTitle]);

  if (!quotes.length || !displayQuote) {
    return null;
  }

  const slug = titleToSlug(displayQuote.title);
  const isCompact = variant === "compact";
  const label = isFromContext
    ? "from this entry"
    : "from my notes · today";

  return (
    <aside
      className={`bookshelf-quote bookshelf-quote--${variant}${
        isFromContext ? " bookshelf-quote--context" : ""
      }`}
      style={{
        "--quote-accent": theme.colors.accent,
        "--quote-text": theme.colors.text,
        "--quote-muted": theme.colors.textSecondary,
        "--quote-surface": theme.isDarkMode
          ? "rgba(255, 255, 255, 0.03)"
          : "rgba(0, 0, 0, 0.02)",
        "--quote-border": theme.colors.border,
      }}
      aria-label="Quote from reading notes"
    >
      <p className="bookshelf-quote__label">{label}</p>
      <blockquote className="bookshelf-quote__text">
        {cleanQuote(displayQuote.quote)}
      </blockquote>
      <footer className="bookshelf-quote__footer">
        {!isFromContext && (
          <cite className="bookshelf-quote__cite">{displayQuote.title}</cite>
        )}
        {!isFromContext && (
          <Link
            to={`/recent-reads/${slug}`}
            className="bookshelf-quote__link"
          >
            open notes
          </Link>
        )}
      </footer>
    </aside>
  );
};

export default QuoteWidget;
