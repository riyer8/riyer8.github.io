import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import profilePhoto from "../../assets/photo3.JPG";
import MarkdownMath from "../../components/MarkdownMath/MarkdownMath";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight, materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./Taps103.css";

// Markdown essay imports
const commandFiles = {
  /*
  play: () => import("./essays/play.md"),
  dumbidea: () => import("./essays/dumbidea.md"),
  boost: () => import("./essays/boost.md"),
  status: () => import("./essays/status.md"),
  space: () => import("./essays/space.md"),
  */
};

const initialWelcome = `Welcome to my TAPS 103 Reflections :)
----------------------------------------
Here are the commands that you might find useful.

  welcome / help   — show these instructions
  clear            — clear previous commands
  play             — on embracing play
  dumbidea         — on following the “worst” idea
  boost            — on making your partner look good
  status           — on status & the body
  space            — on taking up space
`;

export default function Taps103Page() {
  const { theme } = useTheme();
  const [terminalInput, setTerminalInput] = useState("");
  const [history, setHistory] = useState([]);
  const [output, setOutput] = useState(initialWelcome);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const terminalRef = useRef(null);
  const [fadeIn, setFadeIn] = useState(false);

  // Scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, output]);

  // Fade-in effect for Markdown output
  useEffect(() => {
    setFadeIn(true);
    const timeout = setTimeout(() => setFadeIn(false), 500);
    return () => clearTimeout(timeout);
  }, [output]);

  const handleCommand = async (cmd) => {
    setHistory((h) => [...h, `> ${cmd}`]);
    setCommandHistory((h) => [...h, cmd]);
    setHistoryIndex(null);

    if (cmd === "help" || cmd === "welcome") {
      setOutput(initialWelcome);
    } else if (cmd === "clear") {
      setHistory([]);
      setOutput("");
    } else if (commandFiles[cmd]) {
      try {
        const mod = await commandFiles[cmd]();
        let mdContent = mod.default;

        if (mdContent.startsWith("/")) {
          const res = await fetch(mdContent);
          mdContent = await res.text();
        }

        setOutput(mdContent);
      } catch (err) {
        console.error(err);
        setOutput("Error loading content.");
      }
    } else {
      setOutput(`Command not found: ${cmd}`);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const cmd = terminalInput.trim().toLowerCase();
      if (!cmd) return;
      await handleCommand(cmd);
      setTerminalInput("");
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex =
        historyIndex === null
          ? commandHistory.length - 1
          : Math.max(historyIndex - 1, 0);
      setHistoryIndex(newIndex);
      setTerminalInput(commandHistory[newIndex]);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === null) return;
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(newIndex);
      setTerminalInput(commandHistory[newIndex]);
      if (newIndex === commandHistory.length - 1) setHistoryIndex(null);
    }

    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setTerminalInput((prev) => prev + "\n");
    }
  };

  // Custom renderer for MarkdownMath to handle code blocks with syntax highlighting
  const renderMarkdown = (text) => (
    <MarkdownMath
      text={text}
      renderers={{
        code: ({ language, value }) => (
          <SyntaxHighlighter
            style={theme.isDarkMode ? materialDark : materialLight}
            language={language || null}
          >
            {value}
          </SyntaxHighlighter>
        ),
        link: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.colors.accent }}
          >
            {children}
          </a>
        ),
        image: ({ alt, src }) => <img src={src} alt={alt} className="markdown-img" />,
        heading: ({ level, children }) =>
          React.createElement(`h${level}`, { style: { color: theme.colors.text } }, children),
        paragraph: ({ children }) => <p style={{ color: theme.colors.text }}>{children}</p>,
      }}
    />
  );

  return (
    <div className="taps-page">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        {/* Home button */}
        <a href="/" style={{ textDecoration: 'none' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.6rem',
              borderRadius: 8,
              background: theme.isDarkMode
                ? 'rgba(255,255,255,0.04)'
                : theme.colors.accent,
              color: theme.isDarkMode ? theme.colors.text : '#fff',
              border: `1px solid ${theme.colors.border || '#ccc'}`,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            ← Home
          </button>
        </a>

        {/* Avatar + title */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img src={profilePhoto} alt="avatar" className="taps-avatar" />
          <div>
            <h1 className="taps-title" style={{ color: theme.colors.text }}>
              TAPS 103
            </h1>
            <p
              className="taps-subtitle"
              style={{ color: theme.colors.muted || theme.colors.textSecondary }}
            >
              reflections on my improv class.
            </p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="taps-grid">
        {/* Terminal */}
        <div
          className={`terminal`}
          ref={terminalRef}
          style={{
            background: theme.isDarkMode
              ? theme.colors.cardBackground
              : '#f0f0f0',
            color: theme.colors.text,
            border: `1px solid ${theme.colors.border || (theme.isDarkMode ? '#333' : '#ccc')}`,
          }}
        >
          <div className="terminal-window">
            {history.map((line, i) => (
              <div key={i} className="terminal-line">
                {line}
              </div>
            ))}
            <div className="input-line">
              <span>&gt; </span>
              <input
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="terminal-input"
                autoFocus
                style={{ color: theme.colors.text }}
              />
            </div>
          </div>
        </div>

        {/* Markdown Output */}
        <div
          className={`reflection ${fadeIn ? 'fade-in' : ''}`}
          style={{ color: theme.colors.text }}
        >
          {renderMarkdown(output)}
        </div>
      </div>
    </div>
  );
}
