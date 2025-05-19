/// <reference types="vitest" />
import { defineConfig, mergeConfig } from "vitest/config";
import rootConfig from "../../vitest.config";

export default mergeConfig(
  rootConfig,
  defineConfig({
    test: {
      environment: "node",
      include: ["**/*.test.{js,ts}", "**/*.config.test.{js,ts}"],
      exclude: [
        "library.js",
        "react.js",
        "**/node_modules/**",
        "**/dist/**",
        "**/cypress/**",
        "**/.{idea,git,cache,output,temp}/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,prettier}.config.*",
      ],
      coverage: {
        exclude: [
          "eslint.config.js", // Exclude from coverage report
          "library.js", // Exclude from coverage report
          "react.js", // Exclude from coverage report
          // Root config already excludes node_modules, dist, etc.
          // vitest.config.ts itself might be excluded by root patterns too.
        ],
        thresholds: {
          // Remove coverage requirement for this package
          lines: undefined,
          functions: undefined,
          branches: undefined,
          statements: undefined,
        },
      },
    },
  })
);
