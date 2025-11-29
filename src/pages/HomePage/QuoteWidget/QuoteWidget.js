import React, { useState, useEffect } from 'react';
import './QuoteWidget.css';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';
import bookshelfData from '../../BookshelfPage/data/bookshelfData';

function extractQuotesWithMetadata() {
    const quoteRegex = /^>\s*(.+)$/gm;

    return bookshelfData.flatMap(entry => {
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
    const quotes = extractQuotesWithMetadata();
    const [quoteOfTheDay, setQuoteOfTheDay] = useState(null);
    const [historyVisible, setHistoryVisible] = useState(false);
    const [quoteHistory, setQuoteHistory] = useState([]);

    useEffect(() => {
        if (!quotes.length) return;

        const todayStr = new Date().toDateString();
        const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        let todayQuote;

        if (stored && stored.date === todayStr) {
            todayQuote = stored.quote;
        } else {
            todayQuote = quotes[Math.floor(Math.random() * quotes.length)];
            localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify({ date: todayStr, quote: todayQuote })
            );

            const prevHistory = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
            const newHistory = [...prevHistory, { date: todayStr, quote: todayQuote }];
            if (newHistory.length > HISTORY_LIMIT) newHistory.shift();
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        }

        setQuoteOfTheDay(todayQuote);

        const loadedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        setQuoteHistory(loadedHistory);
    }, [quotes]);

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
                Quote of the Day
            </div>

            {quoteOfTheDay ? (
                <>
                    <div className="quote-text" style={{ color: theme.colors.textSecondary }}>
                        “{cleanQuote(quoteOfTheDay.quote)}”
                    </div>

                    <div className="quote-meta-row">
                        <div className="quote-meta" style={{ color: theme.colors.textSecondary }}>
                            — from <strong>{quoteOfTheDay.title}</strong>
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

                    {quoteHistory.length > 1 && (
                        <div className="quote-history-section">
                            <button
                                className="quote-history-toggle"
                                onClick={() => setHistoryVisible(v => !v)}
                                style={{
                                    marginTop: '0.75rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: theme.colors.accent,
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {historyVisible ? 'Hide past quotes' : 'Show past quotes'}
                            </button>

                            {historyVisible && (
                                <ul className="quote-history-list" style={{ marginTop: '0.5rem' }}>
                                    {quoteHistory
                                        .slice(0, -1)
                                        .reverse()
                                        .map((entry, idx) => (
                                            <li key={idx} style={{ color: theme.colors.textSecondary, marginBottom: '0.25rem' }}>
                                                “{cleanQuote(entry.quote)}” — <strong>{entry.date}</strong>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="quote-text" style={{ color: theme.colors.textSecondary }}>
                    No quotes available.
                </div>
            )}
        </div>
    );
};

export default QuoteWidget;
