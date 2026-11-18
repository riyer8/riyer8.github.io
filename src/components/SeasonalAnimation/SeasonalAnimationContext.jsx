import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "../ThemeContext/ThemeContext";
import { getSeason } from "../../features/seasonal/seasonPalettes";
import {
  SEASONAL_TOGGLE_OFF_MESSAGE,
  SEASONAL_TOGGLE_ON_MESSAGES,
} from "./seasonalToggleMessages";
import "./SeasonalAnimation.css";

const STORAGE_KEY = "ramya:seasonal-animation";

// How long the little toast stays on screen after a toggle.
const TOAST_VISIBLE_MS = 3500;

const readStoredFlag = () => {
  try {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const SeasonalAnimationContext = createContext(null);

export const useSeasonalAnimation = () => {
  const value = useContext(SeasonalAnimationContext);
  if (!value) {
    throw new Error(
      "useSeasonalAnimation must be used within SeasonalAnimationProvider"
    );
  }
  return value;
};

export const SeasonalAnimationProvider = ({ children }) => {
  const { theme } = useTheme();
  const [seasonalAnimationEnabled, setSeasonalAnimationEnabled] = useState(
    () => readStoredFlag()
  );
  const [toast, setToast] = useState(null);
  const toastKeyRef = useRef(0);
  const hideTimerRef = useRef(null);
  // A ref mirror of the flag so rapid toggles read the latest value.
  const enabledRef = useRef(seasonalAnimationEnabled);
  enabledRef.current = seasonalAnimationEnabled;

  useEffect(
    () => () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    },
    []
  );

  const toggleSeasonalAnimation = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setSeasonalAnimationEnabled(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "true" : "false");
    } catch {
      // Storage unavailable — the in-memory flag still toggles.
    }
    // A fresh toast on every toggle; clear any pending hide first.
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    toastKeyRef.current += 1;
    const message = next
      ? SEASONAL_TOGGLE_ON_MESSAGES[getSeason()] ??
        SEASONAL_TOGGLE_ON_MESSAGES.autumn
      : SEASONAL_TOGGLE_OFF_MESSAGE;
    setToast({ message, key: toastKeyRef.current });
    hideTimerRef.current = window.setTimeout(() => {
      hideTimerRef.current = null;
      setToast(null);
    }, TOAST_VISIBLE_MS);
  }, []);

  return (
    <SeasonalAnimationContext.Provider
      value={{ seasonalAnimationEnabled, toggleSeasonalAnimation }}
    >
      {children}
      {toast ? (
        <div
          key={toast.key}
          className="seasonal-toast"
          role="status"
          style={{
            "--st-paper": theme.colors.cardBackground,
            "--st-border": theme.colors.border,
            "--st-text": theme.colors.text,
          }}
        >
          {toast.message}
        </div>
      ) : null}
    </SeasonalAnimationContext.Provider>
  );
};
