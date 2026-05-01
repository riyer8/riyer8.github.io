import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext/ThemeContext";
import { PixelatedBackground, ThemeToggle } from "./components";
import { Sidebar, MainContent } from "./pages/HomePage";
import HomeLandingScreen from "./pages/HomePage/HomeLandingScreen";
import BookshelfPage from "./pages/BookshelfPage/BookshelfPage";
import Year2026Page from "./pages/2026Page/Year2026Page"
// import WritingsPage from "./pages/WritingPage/WritingsPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import SeasonalToggleManager from "./randomfeatures/page-toggles/Toggles/ToggleManager";

const App = () => {
  const shouldShowLandingOnLoad = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    const hasSeenIntro = window.sessionStorage.getItem("homeIntroSeen") === "true";
    return window.location.pathname === "/" && !hasSeenIntro;
  }, []);

  const [showLandingScreen, setShowLandingScreen] = React.useState(shouldShowLandingOnLoad);
  const [showHomeContent, setShowHomeContent] = React.useState(!shouldShowLandingOnLoad);

  const containerStyle = {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    margin: 0,
    padding: 0,
  };

  const homeFadeInStyle = {
    opacity: showHomeContent ? 1 : 0,
    transition: "opacity 1000ms ease",
  };

  const homeRouteWrapperStyle = {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
  };

  const landingOverlayStyle = {
    position: "absolute",
    inset: 0,
    zIndex: 2,
  };

  React.useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
  }, []);

  const handleLandingComplete = React.useCallback(() => {
    window.sessionStorage.setItem("homeIntroSeen", "true");
    setShowLandingScreen(false);
  }, []);

  return (
    <ThemeProvider>
      <PixelatedBackground />
      <ThemeToggle />
      <SeasonalToggleManager />
      <Routes>
        <Route
          path="/"
          element={
            <div style={homeRouteWrapperStyle}>
              <div style={homeFadeInStyle}>
                <div style={containerStyle}>
                  <Sidebar />
                  <MainContent />
                </div>
              </div>

              {showLandingScreen && (
                <div style={landingOverlayStyle}>
                  <HomeLandingScreen
                    onFadeStart={() => setShowHomeContent(true)}
                    onComplete={handleLandingComplete}
                  />
                </div>
              )}
            </div>
          }
        />
        <Route path="/recent-reads" element={<BookshelfPage />} />
        <Route path="/recent-reads/:slug" element={<BookshelfPage />} />
        <Route path="/ramya" element={<AboutPage />} />
        <Route path="/2026" element={<Year2026Page />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
