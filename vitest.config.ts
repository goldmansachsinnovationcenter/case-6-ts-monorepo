/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.{js,ts,jsx,tsx}", "**/*.config.test.{js,ts}"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov", "html", "json-summary"],
      exclude: [
        "node_modules/**",
        "dist/**",
        ".turbo/**",
        "**/*.d.ts",
        "**/vite.config.ts",
        "**/vite.config.js",
        "**/*.setup.{js,ts}",
        "**/test/**",
      ],
      thresholds: {
        lines: 99,
        functions: 99,
        branches: 99,
        statements: 99,
      },
    },
  },
});
