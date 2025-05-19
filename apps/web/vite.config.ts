import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { createEnvReplacements } from "@repo/env-config";

/**
 * Vite configuration for web application
 *
 * This configuration:
 * 1. Loads environment variables from the monorepo root
 * 2. Uses Vite's built-in environment variable system for both build time (VITE_) variables
 * 3. Provides consistent access to environment variables across the monorepo
 */
export default defineConfig(({ mode }) => {
  // Get the monorepo root directory
  const rootDir = resolve(__dirname, "../..");

  // Load environment variables from the monorepo root
  // This will load .env, .env.local, and .env.[mode] files from rootDir
  const env = loadEnv(mode, rootDir);

  return {
    plugins: [react()],
    define: {
      // Use our enhanced environment variable system for build-time replacements
      // This ensures compatibility with the existing env-config utilities
      ...createEnvReplacements(env, mode === "production", mode),
    },
    server: {
      port: 3000,
      open: true,
    },
    optimizeDeps: {
      include: ["@repo/ui"],
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
          },
        },
      },
    },
  };
});
