import React, { useEffect, useRef, useState } from 'react';

// Inject KaTeX CSS + JS
const injectKatex = () => {
  if (typeof window === 'undefined') return;
  if (document.getElementById('katex-css')) return;

  const link = document.createElement('link');
  link.id = 'katex-css';
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
  script.defer = true;
  document.head.appendChild(script);
};

// Inject marked + DOMPurify
const injectMarkedAndSanitizer = () => {
  if (typeof window === 'undefined') return;
  if (!window.marked) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    s.defer = true;
    document.head.appendChild(s);
  }
  if (!window.DOMPurify) {
    const s2 = document.createElement('script');
    s2.src = 'https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js';
    s2.defer = true;
    document.head.appendChild(s2);
  }
};

// Render markdown -> HTML while preserving math
const renderMarkdownWithKatexPlaceholders = (text) => {
  if (!text) return '';

  const placeholders = [];
  let nextId = 0;

  // Display math $$...$$
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (m, expr) => {
    const id = `__MATH_DISPLAY_${nextId++}__`;
    placeholders.push({ id, expr, display: true });
    return id;
  });

  // Inline math $...$
  text = text.replace(/\$([^$\n]+?)\$/g, (m, expr) => {
    const id = `__MATH_INLINE_${nextId++}__`;
    placeholders.push({ id, expr, display: false });
    return id;
  });

  let html;
  if (typeof window !== 'undefined' && window.marked) {
    try {
      window.marked.setOptions({ gfm: true, breaks: true, smartLists: true });
      html = window.marked.parse(text);
    } catch (e) {
      html = `<p>${text.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
    }
  } else {
    html = `<p>${text.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
  }

  // Restore math placeholders
  placeholders.forEach(p => {
    const span = p.display
      ? `<span data-katex-display>${p.expr}</span>`
      : `<span data-katex-inline>${p.expr}</span>`;
    html = html.split(p.id).join(span);
  });

  // Sanitize: allow images, links, math
  if (typeof window !== 'undefined' && window.DOMPurify) {
    html = window.DOMPurify.sanitize(html, {
      ADD_ATTR: [
        'data-katex-display',
        'data-katex-inline',
        'src', 'alt', 'title', 'width', 'height', 'style', 'target'
      ],
      ALLOWED_URI_REGEXP: /^(?:http|https|data):/i
    });
  }

  return html;
};

// Apply KaTeX to all math nodes
const applyKatexToNode = (node) => {
  if (typeof window === 'undefined' || !window.katex) return;

  node.querySelectorAll('span[data-katex-display]').forEach(el => {
    try { window.katex.render(el.textContent, el, { displayMode: true, throwOnError: false }); }
    catch { el.innerText = el.textContent; }
  });

  node.querySelectorAll('span[data-katex-inline]').forEach(el => {
    try { window.katex.render(el.textContent, el, { displayMode: false, throwOnError: false }); }
    catch { el.innerText = el.textContent; }
  });
};

const MarkdownMath = ({ text }) => {
  const rootRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [html, setHtml] = useState('');

  // Inject dependencies
  useEffect(() => {
    injectKatex();
    injectMarkedAndSanitizer();

    const interval = setInterval(() => {
      if (window.marked && window.DOMPurify && window.katex) {
        clearInterval(interval);
        setReady(true);
      }
    }, 150);

    const timeout = setTimeout(() => clearInterval(interval), 5000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  // Render markdown once libraries are ready
  useEffect(() => {
    if (!ready) return;

    const parsed = renderMarkdownWithKatexPlaceholders(text);
    setHtml(parsed);

    // Apply KaTeX after HTML is inserted
    const t = setTimeout(() => {
      if (rootRef.current) applyKatexToNode(rootRef.current);
    }, 200);
    return () => clearTimeout(t);
  }, [text, ready]);

  const styles = `
    #markdown-math-root { box-sizing: border-box; width: 100%; }
    #markdown-math-root p, #markdown-math-root li, #markdown-math-root h1, #markdown-math-root h2, #markdown-math-root h3, #markdown-math-root h4, #markdown-math-root h5, #markdown-math-root span { word-break: break-word; overflow-wrap: anywhere; white-space: normal; }
    #markdown-math-root pre, #markdown-math-root code { max-width: 100%; overflow-x: auto; white-space: pre-wrap; word-break: break-word; background: rgba(0,0,0,0.03); padding: 6px 8px; border-radius: 6px; }
    #markdown-math-root img, #markdown-math-root table { max-width: 100%; height: auto; }
    #markdown-math-root blockquote { white-space: normal; word-break: break-word; border-left: 3px solid rgba(0,0,0,0.08); margin-left: 0; padding-left: 12px; color: inherit; background: transparent; }
    #markdown-math-root .katex { max-width: 100%; overflow-wrap: anywhere; word-break: break-word; }
  `;

  return (
    <div>
      <style>{styles}</style>
      <div ref={rootRef} id="markdown-math-root" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default MarkdownMath;