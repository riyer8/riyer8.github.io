import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext/ThemeContext";
import { PixelatedBackground, ThemeToggle } from "./components";
import { Sidebar, MainContent } from "./pages/HomePage";
import BookshelfPage from "./pages/BookshelfPage/BookshelfPage";
import Year2026Page from "./pages/2026Page/Year2026Page"
// import WritingsPage from "./pages/WritingPage/WritingsPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import SeasonalToggleManager from "./randomfeatures/page-toggles/Toggles/ToggleManager";

const App = () => {
  const containerStyle = {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    margin: 0,
    padding: 0,
  };

  React.useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
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
            <div style={containerStyle}>
              <Sidebar />
              <MainContent />
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
