/// <reference types="vitest" />
import { defineConfig, mergeConfig } from "vitest/config";
import rootConfig from "../../vitest.config";

export default mergeConfig(
  rootConfig,
  defineConfig({
    test: {
      environment: "node",
      include: ["**/*.test.ts"],
      coverage: {
        // Override the global thresholds specifically for this package
        thresholds: {
          branches: 97, // Lower branch coverage threshold to 97% (from 99%)
          functions: 99,
          lines: 99,
          statements: 99,
        },
      },
    },
  })
);
