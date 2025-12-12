import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./errorboundary";
import "./index.css"; 

const rootEl = document.getElementById("root") || document.getElementById("app");

if (!rootEl) {
  // Fail fast with a clear message
  console.error(
    'No root element found. Ensure index.html contains <div id="root"></div>'
  );
} else {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
