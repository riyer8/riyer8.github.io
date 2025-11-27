import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext/ThemeContext";
import { PixelatedBackground, ThemeToggle } from "./components";
import { Sidebar, MainContent } from "./pages/HomePage"
import BookshelfPage from "./pages/BookshelfPage/BookshelfPage";
import WritingsPage from "./pages/WritingPage/WritingsPage";
import Taps103Page from "./pages/Taps103Page/Taps103Page";

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
      <PixelatedBackground theme="whoami" />
      <ThemeToggle />
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
        <Route path="/bookshelf" element={<BookshelfPage />} />
        <Route path="/writings" element={<WritingsPage />} />
        <Route path="/taps-103" element={<Taps103Page />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
