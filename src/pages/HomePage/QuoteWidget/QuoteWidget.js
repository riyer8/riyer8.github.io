import React, { useState, useEffect, useMemo } from 'react';
import './QuoteWidget.css';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';
import bookshelfData from '../../BookshelfPage/data/bookshelfData';

function extractQuotesWithMetadata() {
    const quoteRegex = /^>\s*(.+)$/gm;

    return bookshelfData.flatMap(entry => {
        if (entry.archives === true) return [];
        if (!entry.notes) return [];

        const matches = [...entry.notes.matchAll(quoteRegex)];

        return matches.map(m => ({
            quote: m[1].trim(),
            title: entry.title,
            url: entry.url || null,
        }));
    });
}

function cleanQuote(quote) {
    return quote
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/_(.*?)_/g, '$1');
}

const LOCAL_STORAGE_KEY = 'dailyQuote';
const HISTORY_KEY = 'quoteHistory';
const HISTORY_LIMIT = 3;

const QuoteWidget = () => {
    const { theme } = useTheme();
    const quotes = useMemo(() => {
        try {
            return extractQuotesWithMetadata();
        } catch (e) {
            console.error('Failed to extract quotes', e);
            return [];
        }
    }, []);

    const [quoteOfTheDay, setQuoteOfTheDay] = useState(null);
    const [quoteHistory, setQuoteHistory] = useState([]);

    useEffect(() => {
        if (!quotes.length) return;

        const todayStr = new Date().toDateString();

        let stored = null;
        try {
            stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        } catch {
            stored = null;
        }

        let todayQuote = null;

        if (stored && stored.date === todayStr) {
            todayQuote = stored.quote;
        } else {
            todayQuote = quotes[Math.floor(Math.random() * quotes.length)];

            try {
                localStorage.setItem(
                    LOCAL_STORAGE_KEY,
                    JSON.stringify({
                        date: todayStr,
                        quote: {
                            quote: todayQuote.quote,
                            title: todayQuote.title,
                            url: todayQuote.url
                        }
                    })
                );
            } catch (e) {
                console.warn('Failed to write daily quote to localStorage', e);
            }

            let prevHistory = [];
            try {
                prevHistory = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
            } catch {}

            const newHistory = [...prevHistory, { date: todayStr, quote: todayQuote.quote }];
            if (newHistory.length > HISTORY_LIMIT) newHistory.shift();

            try {
                localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
            } catch (e) {
                console.warn('Failed to write quote history to localStorage', e);
            }
        }

        setQuoteOfTheDay(todayQuote);

        let loadedHistory = [];
        try {
            loadedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        } catch {}

        setQuoteHistory(loadedHistory);
    }, [quotes]);

    if (!quotes.length) {
        return (
            <div
                className="reading-widget quote-widget"
                style={{
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginTop: '1rem',
                    background: theme.colors.cardBackground,
                    color: theme.colors.textSecondary
                }}
            >
                No quotes available.
            </div>
        );
    }

    return (
        <div
            className="reading-widget quote-widget"
            style={{
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                padding: '1.5rem',
                marginTop: '1rem',
                background: theme.colors.cardBackground
            }}
        >
            <div className="quote-title" style={{ color: theme.colors.text }}>
                Quote of the Day (from my Recent Reads)
            </div>

            {quoteOfTheDay && (
                <>
                    <div className="quote-text" style={{ color: theme.colors.textSecondary }}>
                        “{cleanQuote(quoteOfTheDay.quote)}”
                    </div>

                    <div className="quote-meta-row">
                        <div className="quote-meta" style={{ color: theme.colors.textSecondary }}>
                            from <strong>{quoteOfTheDay.title}</strong>
                        </div>

                        {quoteOfTheDay.url && (
                            <a
                                href={quoteOfTheDay.url}
                                target="_blank"
                                rel="noreferrer"
                                className="quote-link"
                                style={{ color: theme.colors.accent }}
                            >
                                Visit Source →
                            </a>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default QuoteWidget;
