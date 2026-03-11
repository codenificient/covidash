const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/analytics",
    createProxyMiddleware({
      target: "https://codenalytics.vercel.app",
      changeOrigin: true,
      pathRewrite: { "^/api/analytics": "/api" },
      logLevel: "debug",
    }),
  );
};
