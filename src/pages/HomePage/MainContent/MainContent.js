import { useState, useEffect } from "react";
import MobileSidebar from "../Sidebar/MobileSidebar";
import HomeFeed from "../HomeFeed/HomeFeed";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import { FaBars } from "react-icons/fa";

const MainContent = () => {
  const { theme } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [shouldCollapseSidebar, setShouldCollapseSidebar] = useState(
    window.innerWidth <= 900
  );

  useEffect(() => {
    const checkScreenSize = () => {
      setShouldCollapseSidebar(window.innerWidth <= 900);
    };

    const debouncedResize = (() => {
      let timeoutId;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkScreenSize, 150);
      };
    })();

    checkScreenSize();
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  const pageLayoutStyle = {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
  };

  const mainColumnStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const centeredContentStyle = {
    width: "100%",
    maxWidth: "68rem",
    padding: shouldCollapseSidebar ? "1.25rem" : "3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    boxSizing: "border-box",
  };

  const mobileHeaderStyle = {
    display: shouldCollapseSidebar ? "flex" : "none",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "1.5rem 0 2rem",
    width: "100%",
    boxSizing: "border-box",
  };

  const hamburgerStyle = {
    fontSize: "1.8rem",
    color: theme.colors.accent,
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: "0.5rem",
    transition: "transform 0.2s ease",
  };

  return (
    <main style={pageLayoutStyle}>
      <div style={mainColumnStyle}>
        <div style={centeredContentStyle}>
          <div style={mobileHeaderStyle}>
            <button
              style={hamburgerStyle}
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars />
            </button>
          </div>

          <HomeFeed />
        </div>
      </div>

      {shouldCollapseSidebar && (
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </main>
  );
};

export default MainContent;
