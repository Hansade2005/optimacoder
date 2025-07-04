import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@codesandbox/sdk"],
  webpack: (config, options) => {
    // Add alias for '@' to project root
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@'] = require('path').resolve(__dirname);

    if (options.nextRuntime === "edge") {
      if (!config.resolve.conditionNames) {
        config.resolve.conditionNames = ["require", "node"];
      }
      if (!config.resolve.conditionNames.includes("worker")) {
        config.resolve.conditionNames.push("worker");
      }
      // Exclude heavy packages from edge bundles
      config.externals = config.externals || [];
      config.externals.push({
        "@codesandbox/sandpack-react": "{}",
        "@codesandbox/sandpack-themes": "{}",
        "shiki": "{}"
      });
    }
    return config;
  },
};

export default nextConfig;
