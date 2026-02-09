const webpack = require("webpack");

module.exports = function override(config, env) {
  // Add fallbacks for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer/"),
    util: require.resolve("util/"),
    assert: require.resolve("assert/"),
    os: require.resolve("os-browserify/"),
    path: require.resolve("path-browserify"),
    timers: require.resolve("timers-browserify"),
    vm: require.resolve("vm-browserify"),
  };

  // Add plugins
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  return config;
};
