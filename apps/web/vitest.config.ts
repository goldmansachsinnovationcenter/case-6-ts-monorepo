/// <reference types="vitest" />
import { defineConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import rootConfig from "../../vitest.config";

export default mergeConfig(
  rootConfig,
  defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      include: ["**/*.test.{ts,tsx}"],
      globals: true,
      setupFiles: ["./vitest.setup.ts"],
      coverage: {
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["**/*.test.{ts,tsx}", "**/*.config.{js,ts}", "**/*.setup.{js,ts}"],
        all: true,
        provider: "istanbul",
        reporter: ["text", "html"],
        thresholds: {
          lines: 99,
          functions: 99,
          branches: 99,
          statements: 99,
        },
      },
    },
  })
);
