import { Analytics } from "@codenificient/analytics-sdk";
import { createRoot } from "react-dom/client";
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

// Create a resilient analytics wrapper around an SDK instance
const createResilientAnalytics = (sdk) => {
  let isBlocked = false;
  let retryCount = 0;
  const maxRetries = 3;

  const makeRequest = async (method, ...args) => {
    if (isBlocked || retryCount >= maxRetries) {
      console.log("[Analytics] Skipped:", method, "(blocked or max retries)");
      return Promise.resolve();
    }

    try {
      console.log("[Analytics] Calling SDK:", method, args[0]);
      const result = await sdk[method](...args);
      retryCount = 0;
      console.log("[Analytics] Success:", method);
      return result;
    } catch (error) {
      retryCount++;
      console.warn("[Analytics] Error:", method, error.message);

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("ERR_BLOCKED_BY_ADBLOCKER") ||
        error.message.includes("ERR_NETWORK_CHANGED")
      ) {
        isBlocked = true;
        console.log("[Analytics] Blocked by ad blocker or network issue");
        return Promise.resolve();
      }

      if (retryCount < maxRetries) {
        console.warn(`[Analytics] Retrying ${method} (${retryCount}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
        return makeRequest(method, ...args);
      }

      console.warn(`[Analytics] ${method} failed after ${maxRetries} retries`);
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
  if (!isAnalyticsBlocked()) {
    console.log("[Analytics] Initializing SDK...");
    const sdk = new Analytics({
      apiKey: "proj_covidash_analytics_key",
      endpoint: "https://analytics-dashboard-phi-six.vercel.app/api/analytics",
      debug: false,
    });
    console.log("[Analytics] SDK created, wrapping with resilient layer");

    analytics = createResilientAnalytics(sdk);

    analytics.pageView(window.location.pathname, {
      page_title: "COVID-19 Dashboard",
      app_name: "CoviDash",
    });
  } else {
    console.log("[Analytics] Skipped - ad blocker detected");
    analytics = {
      pageView: () => Promise.resolve(),
      track: () => Promise.resolve(),
      click: () => Promise.resolve(),
      custom: () => Promise.resolve(),
    };
  }
} catch (error) {
  console.warn("[Analytics] Initialization failed:", error);
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
    localAnalytics.store("page_view", args[1] || {});
    return analytics.pageView(...args);
  },
  track: (...args) => {
    localAnalytics.store("track", { event: args[0], data: args[1] || {} });
    return analytics.track(...args);
  },
  click: (...args) => {
    localAnalytics.store("click", { event: args[0], data: args[1] || {} });
    return analytics.click(...args);
  },
  custom: (...args) => {
    localAnalytics.store("custom", { event: args[0], data: args[1] || {} });
    return analytics.custom(...args);
  },
};

// Make analytics available globally for other components
window.analytics = enhancedAnalytics;
window.localAnalytics = localAnalytics;

createRoot(document.getElementById("root")).render(<App />);
