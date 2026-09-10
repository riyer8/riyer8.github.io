import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/600-italic.css";
import "@fontsource/playfair-display/700-italic.css";
import App from "./App";
import "./index.css";
import AnalyticsTracker from "./components/AnalyticsTracker";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <AnalyticsTracker />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
