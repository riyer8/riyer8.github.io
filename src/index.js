import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const redirectParam = new URLSearchParams(window.location.search).get("redirect");
if (redirectParam) {
  window.history.replaceState(null, "", decodeURIComponent(redirectParam));
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);
