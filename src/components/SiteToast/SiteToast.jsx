import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../ThemeContext/ThemeContext";
import "./SiteToast.css";

const ToastContext = createContext(null);
const TOAST_MS = 2000;
const LEAVE_MS = 220;

export const useSiteToast = () => {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useSiteToast must be used within SiteToastProvider");
  }
  return value;
};

export const SiteToastProvider = ({ children }) => {
  const { theme } = useTheme();
  const [toast, setToast] = useState(null);
  const hideTimer = useRef(null);
  const leaveTimer = useRef(null);

  const clearTimers = () => {
    window.clearTimeout(hideTimer.current);
    window.clearTimeout(leaveTimer.current);
  };

  const showToast = useCallback((message) => {
    clearTimers();
    setToast({ message, leaving: false });
    hideTimer.current = window.setTimeout(() => {
      setToast((current) => (current ? { ...current, leaving: true } : current));
      leaveTimer.current = window.setTimeout(() => setToast(null), LEAVE_MS);
    }, TOAST_MS);
  }, []);

  useEffect(() => () => clearTimers(), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast
        ? createPortal(
            <div
              className={`site-toast${toast.leaving ? " is-leaving" : ""}`}
              style={{
                "--toast-text": theme.colors.text,
                "--toast-border": theme.colors.border,
                "--toast-surface": theme.colors.cardBackground,
                "--toast-shadow": theme.isDarkMode
                  ? "0 8px 24px rgba(0, 0, 0, 0.35)"
                  : "0 8px 24px rgba(0, 0, 0, 0.12)",
              }}
              role="status"
            >
              {toast.message}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
};
