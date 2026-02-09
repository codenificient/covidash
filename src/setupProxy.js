const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/analytics",
    createProxyMiddleware({
      target: "https://analytics-dashboard-phi-six.vercel.app",
      changeOrigin: true,
      pathRewrite: { "^/api/analytics": "/api" },
      logLevel: "debug",
    }),
  );
};
