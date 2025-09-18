import { Analytics } from "@codenificient/analytics-sdk";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

// Initialize analytics SDK with error handling
let analytics = null;

try {
  analytics = new Analytics({
    apiKey: "proj_covidash_analytics_key",
    endpoint: "https://analytics-dashboard-phi-six.vercel.app/api/analytics",
    debug: true, // Enable debug logging for development
  });

  // Track page view on app load (with error handling)
  analytics
    .pageView(window.location.pathname, {
      page_title: "COVID-19 Dashboard",
      app_name: "CoviDash",
    })
    .catch((error) => {
      console.warn("Analytics pageView failed:", error);
    });
} catch (error) {
  console.warn("Analytics initialization failed:", error);
  // Create a mock analytics object for development
  analytics = {
    pageView: () => Promise.resolve(),
    track: () => Promise.resolve(),
    click: () => Promise.resolve(),
    custom: () => Promise.resolve(),
  };
}

// Make analytics available globally for other components
window.analytics = analytics;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
