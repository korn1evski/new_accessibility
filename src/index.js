import React from "react";
import ReactDOM from "react-dom/client";
import AccessibilityWidget from "./components/AccessibilityWidget";

// Function to mount the app
const mountApp = () => {
  const container = document.getElementById("accessibility-widget-root");
  if (container) {
    console.log("Mounting Accessibility Widget");
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <AccessibilityWidget />
      </React.StrictMode>
    );
  } else {
    console.error("Accessibility Widget container not found");
  }
};

// Try to mount immediately
mountApp();

// Also try after a short delay to ensure DOM is ready
setTimeout(mountApp, 1000);
