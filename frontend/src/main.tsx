import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { applyRootblendTheme, getStoredRootblendTheme } from "./shared/theme/rootblendTheme";

applyRootblendTheme(getStoredRootblendTheme());
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);