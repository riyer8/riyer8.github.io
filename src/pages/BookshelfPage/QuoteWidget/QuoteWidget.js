import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import "./QuoteWidget.css";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import bookshelfData from "../data/bookshelfData";
import { titleToSlug } from "../bookshelfUtils";

const LOCAL_STORAGE_KEY = "dailyQuote";

function cleanQuote(quote) {
  return quote
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/^[“”"''`]+/, "")
    .replace(/[“”"''`]+$/, "")
    .trim();
}

function normalizeQuoteKey(quote) {
  return cleanQuote(quote)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/['']/g, "'");
}

/** One canonical quote per unique text; drop shorter lines nested inside longer ones. */
function dedupeQuotes(quotes) {
  const byKey = new Map();

  for (const item of quotes) {
    const key = normalizeQuoteKey(item.quote);
    if (!key) continue;
    if (!byKey.has(key)) {
      byKey.set(key, item);
    }
  }

  const unique = [...byKey.values()];

  return unique.filter((item, index, list) => {
    const key = normalizeQuoteKey(item.quote);
    return !list.some((other, otherIndex) => {
      if (index === otherIndex) return false;
      const otherKey = normalizeQuoteKey(other.quote);
      if (key === otherKey) return false;
      return otherKey.includes(key) && otherKey.length > key.length;
    });
  });
}

function extractQuotesWithMetadata() {
  const quoteRegex = /^>\s*(.+)$/gm;

  const raw = bookshelfData.flatMap((entry) => {
    if (entry.archives === true) return [];
    if (!entry.notes) return [];

    const matches = [...entry.notes.matchAll(quoteRegex)];

    return matches.map((m) => ({
      quote: m[1].trim(),
      title: entry.title,
    }));
  });

  return dedupeQuotes(raw);
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
    const key = normalizeQuoteKey(stored.quote.quote);
    const stillValid = quotes.some((q) => normalizeQuoteKey(q.quote) === key);
    if (stillValid) return stored.quote;
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
 * @param {string | null} contextTitle — when set (notes panel), show a quote from that entry only; hidden if none
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
      } else {
        setDisplayQuote(null);
        setIsFromContext(false);
      }
      return;
    }

    setDisplayQuote(loadDailyQuote(quotes));
    setIsFromContext(false);
  }, [quotes, contextTitle]);

  if (!quotes.length || !displayQuote) {
    return null;
  }

  const slug = titleToSlug(displayQuote.title);
  const label = isFromContext ? "from this entry" : "from my notes · today";

  return (
    <aside
      className={`bookshelf-quote bookshelf-quote--${variant}${
        isFromContext ? " bookshelf-quote--context" : ""
      }${theme.isDarkMode ? " bookshelf-quote--dark" : ""}`}
      style={{
        "--quote-accent": theme.colors.accent,
        "--quote-text": theme.colors.text,
        "--quote-muted": theme.colors.textSecondary,
        "--quote-surface": theme.isDarkMode
          ? "rgba(255, 255, 255, 0.025)"
          : "rgba(255, 255, 255, 0.45)",
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
