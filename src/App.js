import React from "react";
import { Routes, Route } from "react-router";
import { ThemeProvider } from "./components/ThemeContext/ThemeContext";
import { PixelatedBackground, ThemeToggle } from "./components";
import AnimatedLayout from "./components/PageTransition/AnimatedLayout";
import { Sidebar, MainContent } from "./pages/HomePage";
import HomeLandingScreen from "./pages/HomePage/HomeLandingScreen";
import { HOME_INTRO } from "./pages/HomePage/homeIntroTiming";
import BookshelfRoute from "./pages/BookshelfPage/BookshelfRoute";
import AboutPage from "./pages/AboutPage/AboutPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import HomeDocumentTitle from "./components/DocumentTitle/HomeDocumentTitle";
import SeasonalToggleManager from "./randomfeatures/page-toggles/Toggles/ToggleManager";

const HOME_INTRO_STORAGE_KEY = "homeIntroSeen";

const App = () => {
  const shouldShowLandingOnLoad = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    const hasSeenIntro =
      window.sessionStorage.getItem(HOME_INTRO_STORAGE_KEY) === "true";
    return window.location.pathname === "/" && !hasSeenIntro;
  }, []);

  const [showLandingScreen, setShowLandingScreen] = React.useState(
    shouldShowLandingOnLoad
  );
  const [showHomeContent, setShowHomeContent] = React.useState(
    !shouldShowLandingOnLoad
  );
  const [landingBlocksInteraction, setLandingBlocksInteraction] =
    React.useState(shouldShowLandingOnLoad);
  const [homeContentRevealMs, setHomeContentRevealMs] = React.useState(
    HOME_INTRO.contentRevealMs
  );

  React.useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
  }, []);

  const handleLandingFadeStart = React.useCallback((opts) => {
    setShowHomeContent(true);
    setLandingBlocksInteraction(false);
    if (opts?.contentRevealMs != null) {
      setHomeContentRevealMs(opts.contentRevealMs);
    }
  }, []);

  const handleLandingComplete = React.useCallback(() => {
    window.sessionStorage.setItem(HOME_INTRO_STORAGE_KEY, "true");
    setShowLandingScreen(false);
  }, []);

  const containerStyle = {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    fontFamily: "var(--font-ui)",
    margin: 0,
    padding: 0,
  };

  const homeFadeInStyle = {
    opacity: showHomeContent ? 1 : 0,
    transition: `opacity ${homeContentRevealMs}ms ease`,
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
    pointerEvents: landingBlocksInteraction ? "auto" : "none",
  };

  const homeRoute = (
    <div style={homeRouteWrapperStyle}>
      <HomeDocumentTitle />
      <div style={homeFadeInStyle}>
        <div style={containerStyle}>
          <Sidebar />
          <MainContent />
        </div>
      </div>

      {showLandingScreen && (
        <div style={landingOverlayStyle}>
          <HomeLandingScreen
            onFadeStart={handleLandingFadeStart}
            onComplete={handleLandingComplete}
          />
        </div>
      )}
    </div>
  );

  return (
    <ThemeProvider>
      <PixelatedBackground />
      <ThemeToggle />
      <SeasonalToggleManager />
      <Routes>
        <Route element={<AnimatedLayout />}>
          <Route path="/" element={homeRoute} />
          <Route path="/recent-reads" element={<BookshelfRoute />} />
          <Route path="/recent-reads/:slug" element={<BookshelfRoute />} />
          <Route path="/ramya" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
