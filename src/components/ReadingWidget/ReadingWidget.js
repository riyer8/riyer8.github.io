import React from 'react';
import './ReadingWidget.css';
import { useTheme } from '../../context/ThemeContext';

// Simple, editable list of items to display. Edit this array to add/remove items.
const readingList = [
    {
        title: 'How AI Really Works',
        url: 'https://example.com/ai-works',
        why: "Getting a clearer mental model of modern ML pipelines and trade-offs."
    },
    {
        title: 'The Joy of Small Libraries',
        url: 'https://example.com/small-libs',
        why: "Inspiration for keeping UI bundles minimal — useful for this site."
    }
];

const ReadingWidget = () => {
    const { theme } = useTheme();

    const widgetStyle = {
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        padding: '1.5rem',
        marginTop: '1rem',
        // background is handled by CSS animation in ReadingWidget.css for subtle dynamic effect
    };

    const titleStyle = {
        fontWeight: 600,
        color: theme.colors.text,
        fontSize: '1rem',
        marginBottom: '0.75rem'
    };

    const listStyle = {
        textAlign: 'left',
        paddingLeft: '1.1rem',
        margin: 0,
        color: theme.colors.textSecondary,
        fontSize: '1rem'
    };

    const linkStyle = {
        color: theme.colors.accent,
        textDecoration: 'none',
        fontWeight: 500
    };

    const whyStyle = {
        marginTop: '0.25rem',
        marginBottom: '0.6rem',
        color: theme.colors.textSecondary,
        fontSize: '0.95rem'
    };

    return (
        <div className="reading-widget" style={widgetStyle}>
            <div style={titleStyle}>Things I&apos;ve been reading this week</div>
            <ul style={listStyle}>
                {readingList.map((item, idx) => (
                    <li key={idx}>
                        <div>
                            <a href={item.url} target="_blank" rel="noreferrer" style={linkStyle}>
                                {item.title}
                            </a>
                        </div>
                        {item.why && (
                            <div style={whyStyle}>• {item.why}</div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReadingWidget;
