import { Analytics } from "@codenificient/analytics-sdk";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Analytics SDK v1.1 - resilient wrapper with local fallback
const NAMESPACE = "covidash";
const NOOP = () => Promise.resolve();

// Resilient wrapper: retries on transient errors, skips if ad-blocked
const createResilientAnalytics = (sdk) => {
  let isBlocked = false;
  let retryCount = 0;
  const maxRetries = 3;

  const makeRequest = async (method, ...args) => {
    if (isBlocked || retryCount >= maxRetries) {
      return Promise.resolve();
    }

    try {
      const result = await sdk[method](...args);
      retryCount = 0;
      return result;
    } catch (error) {
      retryCount++;

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
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
        return makeRequest(method, ...args);
      }

      console.warn(`[Analytics] ${method} failed after ${maxRetries} retries`);
      return Promise.resolve();
    }
  };

  return {
    // v1.0 methods
    pageView: (...args) => makeRequest("pageView", ...args),
    track: (...args) => makeRequest("track", ...args),
    click: (...args) => makeRequest("click", ...args),
    custom: (...args) => makeRequest("custom", ...args),
    trackBatch: (...args) => makeRequest("trackBatch", ...args),
    // v1.1 methods
    error: (...args) => makeRequest("error", ...args),
    exception: (...args) => makeRequest("exception", ...args),
    apiError: (...args) => makeRequest("apiError", ...args),
  };
};

// Mock analytics for when SDK is blocked or fails to init
const mockAnalytics = {
  pageView: NOOP, track: NOOP, click: NOOP, custom: NOOP,
  trackBatch: NOOP, error: NOOP, exception: NOOP, apiError: NOOP,
};

let analytics = mockAnalytics;

// In dev, requests go through CRA proxy (src/setupProxy.js) to avoid CORS
// In production, requests go direct (analytics backend must allow the origin)
const isDev = process.env.NODE_ENV === "development";
const analyticsEndpoint = isDev
  ? "/api/analytics"
  : "https://analytics-dashboard-phi-six.vercel.app/api";

try {
  const sdk = new Analytics({
    apiKey: "proj_covidash_analytics_key",
    endpoint: analyticsEndpoint,
    debug: isDev,
  });

  analytics = createResilientAnalytics(sdk);

  analytics.pageView(window.location.pathname, {
    page_title: "COVID-19 Dashboard",
    app_name: "CoviDash",
  });
} catch (err) {
  console.warn("[Analytics] Initialization failed:", err);
}

// Local storage fallback for offline/blocked scenarios
const localAnalytics = {
  store: (event, data) => {
    try {
      const events = JSON.parse(
        localStorage.getItem("local_analytics") || "[]",
      );
      events.push({
        event,
        data,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
      localStorage.setItem(
        "local_analytics",
        JSON.stringify(events.slice(-100)),
      );
    } catch (e) {
      // localStorage unavailable
    }
  },
  getEvents: () => {
    try {
      return JSON.parse(localStorage.getItem("local_analytics") || "[]");
    } catch (e) {
      return [];
    }
  },
  clearEvents: () => localStorage.removeItem("local_analytics"),
};

// Public API: wraps SDK calls with namespace injection + local fallback
// App calls track(eventType, props) → SDK gets track(namespace, eventType, props)
window.analytics = {
  pageView: (page, properties) => {
    localAnalytics.store("page_view", { page, ...properties });
    return analytics.pageView(page, properties);
  },
  track: (eventType, properties) => {
    localAnalytics.store("track", { event: eventType, ...properties });
    return analytics.track(NAMESPACE, eventType, properties);
  },
  click: (element, properties) => {
    localAnalytics.store("click", { element, ...properties });
    return analytics.click(element, properties);
  },
  custom: (eventType, properties) => {
    localAnalytics.store("custom", { event: eventType, ...properties });
    return analytics.custom(NAMESPACE, eventType, properties);
  },
  error: (errorType, properties) => {
    localAnalytics.store("error", { errorType, ...properties });
    return analytics.error(errorType, properties);
  },
  exception: (err, properties) => {
    localAnalytics.store("exception", { message: err.message });
    return analytics.exception(err, properties);
  },
};
window.localAnalytics = localAnalytics;

createRoot(document.getElementById("root")).render(<App />);
