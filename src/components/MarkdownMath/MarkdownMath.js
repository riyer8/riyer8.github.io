import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import katex from 'katex';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import { useTheme } from '../ThemeContext/ThemeContext';

marked.setOptions({ gfm: true, breaks: true });

const preprocessFigures = (text) => {
  if (!text) return text;

  text = text.replace(
    /:::figure\s+([\s\S]*?)\s+:::/g,
    (_, content) => {
      const lines = content.trim().split('\n');
      const imageLine = lines.shift();
      const caption = lines.join('\n').trim();

      return `
<figure class="md-figure">
  ${imageLine}
  ${caption ? `<figcaption>${caption}</figcaption>` : ''}
</figure>
`;
    }
  );

  text = text.replace(
    /!\[([^\]]*)\]\(([^)]+)\)\s*\n([^\n]+)/g,
    (_, alt, src, caption) => {
      return `
<figure class="md-figure">
  <img src="${src}" alt="${alt}" />
  <figcaption>${caption.trim()}</figcaption>
</figure>
`;
    }
  );

  return text;
};

const preprocessCustomQuoteBlocks = (text) => {
  if (!text) return text;

  const renderCallout = (content, className, tagName) => {
      let inner = content.trim();

      try {
        inner = marked.parse(inner);
      } catch (e) {
        inner = inner.replace(/\n/g, '<br/>');
      }

      return `<${tagName} class="${className}">
  ${inner}
</${tagName}>`;
  };

  text = text.replace(
    /:::quote\s+([\s\S]*?)\s+:::/g,
    (_, content) => renderCallout(content, 'custom-quote', 'blockquote')
  );

  return text.replace(
    /:::sidenote\s+([\s\S]*?)\s+:::/g,
    (_, content) => renderCallout(content, 'custom-sidenote', 'aside')
  );
};


// Protect math before Markdown parsing.
const extractMathPlaceholders = (text) => {
  const placeholders = [];
  let nextId = 0;

  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (m, expr) => {
    const id = `MATHPLACEHOLDER${nextId++}TOKEN`;
    placeholders.push({ id, expr, display: true });
    return id;
  });

  text = text.replace(/\$([^$\n]+?)\$/g, (m, expr) => {
    const id = `MATHPLACEHOLDER${nextId++}TOKEN`;
    placeholders.push({ id, expr, display: false });
    return id;
  });

  return { text, placeholders };
};

const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

// Render markdown -> HTML, then restore protected math.
const renderMarkdownWithKatexPlaceholders = (text, placeholders) => {
  let html;
  try {
    html = marked.parse(text);
  } catch (e) {
    html = `<p>${text.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
  }

  // Restore math placeholders
  placeholders.forEach(p => {
    const expression = escapeHtml(p.expr);
    const span = p.display
      ? `<span data-katex-display="true">${expression}</span>`
      : `<span data-katex-inline="true">${expression}</span>`;
    html = html.split(p.id).join(span);
  });

  return html;
};

const applyKatexToNode = (node) => {
  if (!node) return;

  node.querySelectorAll('span[data-katex-display]').forEach((el) => {
    try {
      katex.render(el.textContent, el, { displayMode: true, throwOnError: false });
    } catch {
      el.innerText = el.textContent;
    }
  });

  node.querySelectorAll('span[data-katex-inline]').forEach((el) => {
    try {
      katex.render(el.textContent, el, { displayMode: false, throwOnError: false });
    } catch {
      el.innerText = el.textContent;
    }
  });
};

const MarkdownMath = ({ text }) => {
  const { theme } = useTheme();
  const rootRef = useRef(null);
  const [html, setHtml] = useState('');

  useEffect(() => {
    const { text: textWithMathPlaceholders, placeholders } =
      extractMathPlaceholders(text || '');
    const parsed = renderMarkdownWithKatexPlaceholders(
      preprocessCustomQuoteBlocks(
        preprocessFigures(textWithMathPlaceholders)
      ),
      placeholders
    );

    setHtml(
      DOMPurify.sanitize(parsed, {
        ADD_TAGS: ['iframe', 'video', 'source', 'figure', 'figcaption'],
        ADD_ATTR: [
          'data-katex-display',
          'data-katex-inline',
          'src', 'alt', 'title', 'width', 'height', 'style',
          'frameborder', 'allow', 'allowfullscreen', 'controls', 'type'
        ],
        ALLOWED_URI_REGEXP: /^(?:http|https|data|\/)/i
      })
    );
  }, [text]);

  useLayoutEffect(() => {
    if (!html) return;
    applyKatexToNode(rootRef.current);
  }, [html]);

  const styles = `
    #markdown-math-root { box-sizing: border-box; width: 100%; color: ${theme.colors.text}; }
    #markdown-math-root p, #markdown-math-root li, #markdown-math-root h1, #markdown-math-root h2, #markdown-math-root h3, #markdown-math-root h4, #markdown-math-root h5, #markdown-math-root span { word-break: break-word; overflow-wrap: anywhere; white-space: normal; }
    #markdown-math-root pre, #markdown-math-root code { max-width: 100%; overflow-x: auto; white-space: pre-wrap; word-break: break-word; background: rgba(0,0,0,0.03); padding: 6px 8px; border-radius: 6px; }
    #markdown-math-root img, #markdown-math-root table { max-width: 100%; height: auto; }
    #markdown-math-root blockquote,
    #markdown-math-root .custom-quote { 
      white-space: normal; 
      word-break: break-word; 
      border: 1px solid ${theme.isDarkMode ? 'rgba(255, 179, 71, 0.38)' : 'transparent'};
      border-left: 4px solid ${theme.isDarkMode ? '#FFB347' : theme.colors.accent};
      background: ${theme.isDarkMode ? 'rgba(255, 179, 71, 0.14)' : 'rgba(0,0,0,0.04)'};
      box-shadow: ${theme.isDarkMode ? 'inset 0 0 18px rgba(255, 179, 71, 0.04)' : 'none'};
      padding: 10px 12px;
      margin: 0.5em 0;
      border-radius: 8px;
      color: ${theme.colors.text};
    }
    #markdown-math-root blockquote p,
    #markdown-math-root .custom-quote p,
    #markdown-math-root .custom-sidenote p {
      margin: 1em 0;
    }
    #markdown-math-root blockquote p:first-child,
    #markdown-math-root .custom-quote p:first-child,
    #markdown-math-root .custom-sidenote p:first-child {
      margin-top: 0;
    }
    #markdown-math-root blockquote p:last-child,
    #markdown-math-root .custom-quote p:last-child,
    #markdown-math-root .custom-sidenote p:last-child {
      margin-bottom: 0;
    }
    #markdown-math-root blockquote::after,
    #markdown-math-root .custom-quote::after,
    #markdown-math-root .custom-sidenote::after {
      display: block;
      margin-top: 0.65em;
      font-size: 0.65em;
      line-height: 1;
      text-align: right;
      letter-spacing: 0.04em;
      opacity: 0.6;
    }
    #markdown-math-root blockquote::after,
    #markdown-math-root .custom-quote::after {
      content: "Quote from Article";
      color: ${theme.isDarkMode ? '#FFCA80' : theme.colors.textSecondary};
      font-weight: 700;
    }
    #markdown-math-root .custom-sidenote {
      white-space: normal;
      word-break: break-word;
      border: 1px solid ${theme.isDarkMode ? 'rgba(102, 205, 189, 0.4)' : 'transparent'};
      border-left: 4px solid ${theme.isDarkMode ? '#66cdbd' : '#2a9d8f'};
      background: ${theme.isDarkMode ? 'rgba(102, 205, 189, 0.15)' : 'rgba(42, 157, 143, 0.09)'};
      box-shadow: ${theme.isDarkMode ? 'inset 0 0 18px rgba(102, 205, 189, 0.04)' : 'none'};
      padding: 10px 12px;
      margin: 0.5em 0;
      border-radius: 8px;
      color: ${theme.colors.text};
    }
    #markdown-math-root .custom-sidenote::after {
      content: "Sidenote";
      color: ${theme.isDarkMode ? '#8DDED1' : '#2a9d8f'};
      font-weight: 700;
    }
    #markdown-math-root .katex,
    #markdown-math-root .katex * {
      overflow-wrap: normal;
      word-break: normal;
      white-space: nowrap;
    }
    #markdown-math-root .katex-display {
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
    }
    #markdown-math-root a { color: ${theme.colors.accent}; text-decoration: underline; }
    #markdown-math-root iframe, #markdown-math-root video { max-width: 100%; height: auto; display: block; margin: 1em 0; }
    #markdown-math-root figure.md-figure {
      margin: 1.5em auto;
      text-align: center;
      max-width: 100%;
    }

    #markdown-math-root figure.md-figure img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      height: auto;
      border-radius: 10px;
    }

    #markdown-math-root figure.md-figure figcaption {
      margin-top: 0.5em;
      font-size: 0.85em;
      opacity: 0.75;
      line-height: 1.4;
    }

    #markdown-math-root table {
      display: block;
      width: 100%;
      border-collapse: collapse;
      margin: 1.25em 0;
      font-size: 0.95em;
      border-radius: 8px;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      background: ${theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff'};
    }

    #markdown-math-root th {
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      background: ${theme.isDarkMode ? 'rgba(255,255,255,0.06)' : '#f6f6f6'};
      border: 1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.15)' : '#ddd'};
    }

    #markdown-math-root td {
      padding: 10px 12px;
      border: 1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.12)' : '#e0e0e0'};
      vertical-align: top;
    }

    #markdown-math-root tbody tr:nth-child(even) {
      background: ${theme.isDarkMode ? 'rgba(255,255,255,0.03)' : '#fafafa'};
    }

  `;

  return (
    <div
      data-markdown-present="true"
      data-markdown-ready={html ? "true" : "false"}
    >
      <style>{styles}</style>
      <div ref={rootRef} id="markdown-math-root" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default MarkdownMath;
