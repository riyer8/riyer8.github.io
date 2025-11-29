import React, { useMemo } from 'react';
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

// Deterministic daily index
function getDailyIndex(max) {
    const today = new Date();
    const seed =
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();
    return seed % max;
}

const QuoteWidget = () => {
    const { theme } = useTheme();
    const quotes = extractQuotesWithMetadata();

    const quoteOfTheDay = useMemo(() => {
        if (quotes.length === 0) return null;
        const idx = getDailyIndex(quotes.length);
        return quotes[idx];
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
            <div
                className="quote-title"
                style={{ color: theme.colors.text }}
            >
                Quote of the Day
            </div>

            {quoteOfTheDay ? (
                <>
                    <div
                        className="quote-text"
                        style={{ color: theme.colors.textSecondary }}
                    >
                        “{quoteOfTheDay.quote}”
                    </div>

                    <div className="quote-meta-row">
                        <div
                            className="quote-meta"
                            style={{ color: theme.colors.textSecondary }}
                        >
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
                </>
            ) : (
                <div
                    className="quote-text"
                    style={{ color: theme.colors.textSecondary }}
                >
                    No quotes available.
                </div>
            )}
        </div>
    );
};

export default QuoteWidget;
