import { Analytics } from "@codenificient/analytics-sdk";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

// Initialize analytics SDK with ad-blocker detection and error handling
let analytics = null;

// Check if analytics is likely to be blocked
const isAnalyticsBlocked = () => {
  // Check for common ad blocker indicators
  const blockedIndicators = [
    "adblock",
    "uBlock",
    "AdBlock",
    "adblocker",
    "privacy",
    "ghostery",
    "ublock",
  ];

  // Check if any blocked indicators are in the user agent or DOM
  const userAgent = navigator.userAgent.toLowerCase();
  const hasBlockedIndicator = blockedIndicators.some(
    (indicator) =>
      userAgent.includes(indicator) ||
      document.querySelector(`[class*="${indicator}"]`) ||
      document.querySelector(`[id*="${indicator}"]`)
  );

  return hasBlockedIndicator;
};

// Create a resilient analytics wrapper
const createResilientAnalytics = () => {
  let isBlocked = false;
  let retryCount = 0;
  const maxRetries = 3;

  const makeRequest = async (method, ...args) => {
    if (isBlocked || retryCount >= maxRetries) {
      console.log("Analytics request skipped (blocked or max retries reached)");
      return Promise.resolve();
    }

    try {
      const result = await analytics[method](...args);
      retryCount = 0; // Reset retry count on success
      return result;
    } catch (error) {
      retryCount++;

      // Check if it's a blocking error
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("ERR_BLOCKED_BY_ADBLOCKER") ||
        error.message.includes("ERR_NETWORK_CHANGED")
      ) {
        isBlocked = true;
        console.log("Analytics blocked by ad blocker or network issue");
        return Promise.resolve();
      }

      // For other errors, retry
      if (retryCount < maxRetries) {
        console.warn(
          `Analytics ${method} failed, retrying... (${retryCount}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
        return makeRequest(method, ...args);
      }

      console.warn(
        `Analytics ${method} failed after ${maxRetries} retries:`,
        error
      );
      return Promise.resolve();
    }
  };

  return {
    pageView: (...args) => makeRequest("pageView", ...args),
    track: (...args) => makeRequest("track", ...args),
    click: (...args) => makeRequest("click", ...args),
    custom: (...args) => makeRequest("custom", ...args),
  };
};

try {
  // Only initialize if not likely to be blocked
  if (!isAnalyticsBlocked()) {
    analytics = new Analytics({
      apiKey: "proj_covidash_analytics_key",
      endpoint: "https://analytics-dashboard-phi-six.vercel.app/api/analytics",
      debug: false, // Disable debug to reduce noise
    });

    // Wrap with resilient analytics
    analytics = createResilientAnalytics();

    // Track page view on app load
    analytics.pageView(window.location.pathname, {
      page_title: "COVID-19 Dashboard",
      app_name: "CoviDash",
    });
  } else {
    console.log("Analytics skipped - ad blocker detected");
    analytics = {
      pageView: () => Promise.resolve(),
      track: () => Promise.resolve(),
      click: () => Promise.resolve(),
      custom: () => Promise.resolve(),
    };
  }
} catch (error) {
  console.warn("Analytics initialization failed:", error);
  // Create a mock analytics object
  analytics = {
    pageView: () => Promise.resolve(),
    track: () => Promise.resolve(),
    click: () => Promise.resolve(),
    custom: () => Promise.resolve(),
  };
}

// Add local analytics fallback for when main analytics is blocked
const localAnalytics = {
  store: (event, data) => {
    try {
      const events = JSON.parse(
        localStorage.getItem("local_analytics") || "[]"
      );
      events.push({
        event,
        data,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
      localStorage.setItem(
        "local_analytics",
        JSON.stringify(events.slice(-100))
      ); // Keep last 100 events
    } catch (error) {
      console.warn("Local analytics storage failed:", error);
    }
  },

  getEvents: () => {
    try {
      return JSON.parse(localStorage.getItem("local_analytics") || "[]");
    } catch (error) {
      return [];
    }
  },

  clearEvents: () => {
    localStorage.removeItem("local_analytics");
  },
};

// Enhanced analytics wrapper that includes local fallback
const enhancedAnalytics = {
  pageView: (...args) => {
    analytics.pageView(...args);
    localAnalytics.store("page_view", args[1] || {});
  },
  track: (...args) => {
    analytics.track(...args);
    localAnalytics.store("track", { event: args[0], data: args[1] || {} });
  },
  click: (...args) => {
    analytics.click(...args);
    localAnalytics.store("click", { event: args[0], data: args[1] || {} });
  },
  custom: (...args) => {
    analytics.custom(...args);
    localAnalytics.store("custom", { event: args[0], data: args[1] || {} });
  },
};

// Make analytics available globally for other components
window.analytics = enhancedAnalytics;
window.localAnalytics = localAnalytics;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
