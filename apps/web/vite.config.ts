import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { isPassthroughVar, PASSTHROUGH_PREFIX, createEnvReplacements, ENV_VARS } from "@repo/env-config";

/**
 * Vite configuration for web application
 *
 * This configuration:
 * 1. Loads environment variables based on the current mode
 * 2. Replaces process.env references with actual values at build time
 * 3. Preserves variables with PASSTHROUGH_ prefix for runtime loading
 * 4. Fails the build if required environment variables are missing
 */
export default defineConfig(({ mode, command }) => {
  // Load VITE_ prefixed variables for Vite's own use (e.g., import.meta.env.VITE_*)
  const viteSpecificEnv = loadEnv(mode, process.cwd(), "VITE_");

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
      // If neither VITE_KEY nor KEY is found in process.env,
      // and viteSpecificEnv also didn't populate it (e.g. from a .env file VITE_KEY),
      // then envForCreateReplacements[key] might be undefined.
      // createEnvReplacements will then throw if 'strictCheck' is true and the key is required.
    }
  }

  const isBuild = command === "build";
  const useStrictCheck = isBuild; // Enable strict checking for all builds

  const envReplacement = createEnvReplacements(envForCreateReplacements, useStrictCheck);

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
