import React from "react";
import { createPortal } from "react-dom";
import { Routes, Route, useLocation } from "react-router";
import { ThemeProvider } from "./components/ThemeContext/ThemeContext";
import { PixelatedBackground, ThemeToggle } from "./components";
import AnimatedLayout from "./components/PageTransition/AnimatedLayout";
import { HomePage } from "./pages/HomePage";
import HomeLandingScreen from "./pages/HomePage/intro/HomeLandingScreen";
import {
  clearHomeIntroCover,
  markHomeIntroSeen,
  shouldPlayHomeIntro,
} from "./pages/HomePage/intro/homeIntroStorage";
import BookshelfRoute from "./pages/BookshelfPage/BookshelfRoute";
import AboutPage from "./pages/AboutPage/AboutPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import HomeDocumentTitle from "./components/DocumentTitle/HomeDocumentTitle";
import SeasonalToggleManager from "./features/seasonal/ToggleManager";
import { formatPageTitle } from "./seo/pageMetadata";
import { CommandPaletteProvider } from "./components/CommandPalette/CommandPalette";
import SiteFooter from "./components/SiteFooter/SiteFooter";
import TabAttentionTitle from "./components/TabAttentionTitle";
import CursorSparkles from "./components/CursorSparkles";

const HomeIntroWall = ({ blocksInteraction, children }) => {
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        pointerEvents: blocksInteraction ? "auto" : "none",
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const App = () => {
  const location = useLocation();
  // Match prerendered HTML (intro skipped) to avoid hydration mismatches.
  // A layout effect then plays the intro for first visits this session.
  const [showLandingScreen, setShowLandingScreen] = React.useState(false);
  const [landingBlocksInteraction, setLandingBlocksInteraction] =
    React.useState(false);

  React.useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
  }, []);

  React.useLayoutEffect(() => {
    if (!shouldPlayHomeIntro(location.pathname)) {
      clearHomeIntroCover();
      return undefined;
    }
    setShowLandingScreen(true);
    setLandingBlocksInteraction(true);
    return undefined;
  }, [location.pathname]);

  // Match homepage metadata during the loading intro so the tab title stays correct.
  React.useEffect(() => {
    if (showLandingScreen) {
      document.title = formatPageTitle();
    }
  }, [showLandingScreen]);

  const handleLandingFadeStart = React.useCallback(() => {
    setLandingBlocksInteraction(false);
  }, []);

  const handleLandingComplete = React.useCallback(() => {
    markHomeIntroSeen();
    clearHomeIntroCover();
    setShowLandingScreen(false);
  }, []);

  const homeRoute = (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <HomeDocumentTitle />
      <HomePage />
    </div>
  );

  return (
    <ThemeProvider>
      <CommandPaletteProvider>
        <PixelatedBackground />
        <ThemeToggle />
        <SeasonalToggleManager />
        <TabAttentionTitle />
        <CursorSparkles />
        {showLandingScreen ? (
          <HomeIntroWall blocksInteraction={landingBlocksInteraction}>
            <HomeLandingScreen
              onFadeStart={handleLandingFadeStart}
              onComplete={handleLandingComplete}
            />
          </HomeIntroWall>
        ) : null}
        <Routes>
          <Route element={<AnimatedLayout />}>
            <Route path="/" element={homeRoute} />
            <Route path="/recent-reads" element={<BookshelfRoute />} />
            <Route path="/recent-reads/:slug" element={<BookshelfRoute />} />
            <Route path="/ramya" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <SiteFooter />
      </CommandPaletteProvider>
    </ThemeProvider>
  );
};

export default App;
