import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { isPassthroughVar, PASSTHROUGH_PREFIX, createEnvReplacements, ENV_VARS } from "@repo/env-config";
import { resolve } from "path";

/**
 * Vite configuration for web application
 *
 * This configuration:
 * 1. Loads environment variables based on the current mode
 * 2. Replaces process.env references with actual values at build time
 * 3. Preserves variables with PASSTHROUGH_ prefix for runtime loading
 * 4. Only fails the build if required environment variables are missing in production
 */
export default defineConfig(({ mode: configMode, command }) => {
  // Force development mode for local builds during CI/CD processes
  // This will prevent build failures due to missing env vars
  const mode = process.env.CI ? configMode : "development";

  // Get the monorepo root directory
  const rootDir = resolve(__dirname, "../..");

  // Load VITE_ prefixed variables from the monorepo root
  const viteSpecificEnv = loadEnv(mode, rootDir, "VITE_");

  // Prepare the environment object for createEnvReplacements.
  // This ensures that keys defined in ENV_VARS (e.g., "EO_CLOUD_API_DOMAIN")
  // are populated from process.env, checking for VITE_ prefixed versions first, then non-prefixed.
  const envForCreateReplacements: Record<string, string> = { ...viteSpecificEnv };

  for (const key of Object.values(ENV_VARS)) {
    if (key === "NODE_ENV") {
      envForCreateReplacements[key] = process.env.NODE_ENV || mode;
    } else {
      const vitePrefixedVarName = `VITE_${key}`;
      const directVarName = key;

      if (process.env[vitePrefixedVarName] !== undefined) {
        envForCreateReplacements[key] = process.env[vitePrefixedVarName]!;
      } else if (process.env[directVarName] !== undefined) {
        envForCreateReplacements[key] = process.env[directVarName]!;
      }

      // Add fallback default values for required environment variables when not in production
      if (!envForCreateReplacements[key] && mode !== "production") {
        if (key === "EO_CLOUD_API_DOMAIN") {
          envForCreateReplacements[key] = "default-api.example.com";
        } else if (key === "BIO_S3_BUCKET_NAME") {
          envForCreateReplacements[key] = "default-bucket";
        }
      }
    }
  }

  const isBuild = command === "build";
  const useStrictCheck = isBuild; // Enable strict checking for all builds

  // Pass the mode to createEnvReplacements so it can handle different environments appropriately
  const envReplacement = createEnvReplacements(envForCreateReplacements, useStrictCheck, mode);

  // Passthrough variables should be identified from the actual process.env
  const passthroughVars = Object.keys(process.env)
    .filter(isPassthroughVar)
    .map((key) => key.replace(PASSTHROUGH_PREFIX, ""));

  return {
    plugins: [react()],
    define: {
      ...envReplacement,
      __PASSTHROUGH_VARS__: JSON.stringify(passthroughVars),
      "process.env": process.env, // Preserved from original, though envReplacement handles specific vars
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
        external: [],
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
          },
        },
      },
    },
  };
});
