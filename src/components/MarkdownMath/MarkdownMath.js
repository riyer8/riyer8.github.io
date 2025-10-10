import React, { useEffect, useRef, useState } from 'react';

// Markdown + KaTeX renderer using DOM parsing.
// Loads marked and DOMPurify from CDN (no npm install required) and KaTeX for math.
// It supports full Markdown (headings, lists, code fences) + inline $...$ and display $$...$$ math.

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

// Render markdown text into sanitized HTML while preserving TeX math markers.
const renderMarkdownWithKatexPlaceholders = (text) => {
  if (!text) return '';

  // Step 1: Replace display and inline math with placeholders that won't be modified by markdown
  // Use unique tokens to avoid accidental collisions.
  const placeholders = [];
  let nextId = 0;

  // Replace $$...$$ (display math)
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (m, expr) => {
    const id = `__MATH_DISPLAY_${nextId++}__`;
    placeholders.push({ id, expr, display: true });
    return id;
  });

  // Replace inline $...$
  text = text.replace(/\$([^$\n]+?)\$/g, (m, expr) => {
    const id = `__MATH_INLINE_${nextId++}__`;
    placeholders.push({ id, expr, display: false });
    return id;
  });

  // Step 2: Convert markdown -> HTML using marked if available, otherwise do basic paragraph formatting
  let html;
  if (typeof window !== 'undefined' && window.marked) {
    try {
      html = window.marked.parse(text);
    } catch (e) {
      html = text.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br/>');
      html = `<p>${html}</p>`;
    }
  } else {
    html = text.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br/>');
    html = `<p>${html}</p>`;
  }

  // Step 3: Restore placeholders to <span data-katex-...> nodes
  placeholders.forEach(p => {
    const content = p.expr;
    const span = p.display ? `<span data-katex-display>${content}</span>` : `<span data-katex-inline>${content}</span>`;
    html = html.split(p.id).join(span);
  });

  // Step 4: Sanitize with DOMPurify when available; allow data-katex-* attributes
  if (typeof window !== 'undefined' && window.DOMPurify) {
    try {
      html = window.DOMPurify.sanitize(html, { ADD_ATTR: ['data-katex-display', 'data-katex-inline'] });
    } catch (e) {
      // fall back to raw html
    }
  }

  return html;
};

const applyKatexToNode = (node) => {
  if (typeof window === 'undefined' || !window.katex) return;
  // display
  node.querySelectorAll('span[data-katex-display]').forEach(el => {
    try {
      window.katex.render(el.textContent, el, { displayMode: true, throwOnError: false });
    } catch(e) {
      el.innerText = el.textContent;
    }
  });
  // inline
  node.querySelectorAll('span[data-katex-inline]').forEach(el => {
    try {
      window.katex.render(el.textContent, el, { displayMode: false, throwOnError: false });
    } catch(e) {
      el.innerText = el.textContent;
    }
  });
};

const MarkdownMath = ({ text }) => {
  const rootRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    injectKatex();
    injectMarkedAndSanitizer();

    // Poll until all libs are available, then mark ready so we re-render using marked/DOMPurify
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.marked && window.DOMPurify && window.katex) {
        clearInterval(interval);
        setReady(true);
      }
    }, 150);

    // safety timeout: stop polling after 5s
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  // Whenever text or ready state changes, re-apply KaTeX after the innerHTML updates
  useEffect(() => {
    // small delay to allow innerHTML to be set
    const t = setTimeout(() => {
      const host = rootRef.current;
      if (host && typeof window !== 'undefined') {
        applyKatexToNode(host);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [text, ready]);

  const html = renderMarkdownWithKatexPlaceholders(text);

  return (
    <div ref={rootRef} id="markdown-math-root" dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default MarkdownMath;
