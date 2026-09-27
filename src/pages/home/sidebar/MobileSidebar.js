import { useEffect } from "react";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import SidebarContent from "./SidebarContent";
import "./MobileSidebar.css";

const MobileSidebar = ({ isOpen, onClose }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (!isOpen) return undefined;

    const scrollY = window.scrollY;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`mobile-sidebar-overlay${isOpen ? " is-open" : ""}`}
        style={{
          "--mobile-sidebar-overlay": theme.isDarkMode
            ? "rgba(0,0,0,0.6)"
            : "rgba(0,0,0,0.35)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`mobile-sidebar${isOpen ? " is-open" : ""}`}
        style={{
          "--mobile-sidebar-bg": theme.colors.cardBackground,
          "--mobile-sidebar-border": theme.colors.border,
          "--mobile-sidebar-accent": theme.colors.accent,
          "--mobile-sidebar-shadow": theme.isDarkMode
            ? "inset 0 0 0 1px rgba(255,255,255,0.02)"
            : "none",
        }}
        aria-label="Ramya Iyer profile and navigation"
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className="mobile-sidebar__close"
          onClick={onClose}
          title="Close sidebar"
          aria-label="Close sidebar"
        >
          ×
        </button>

        <div className="mobile-sidebar__scroll">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
