/**
 * Environment variable configuration for the monorepo
 * Uses Vite's built-in environment variable handling
 */

/**
 * The prefix used for passthrough environment variables
 */
export const PASSTHROUGH_PREFIX = "PASSTHROUGH_";

/**
 * Environment variables used in the application
 * These are the exact variable names as they appear in the environment
 */
export const ENV_VARS = {
  NODE_ENV: "NODE_ENV", // NODE_ENV doesn't need a VITE_ prefix
  PASSTHROUGH_LAMBDA_CREDENTIAL: "PASSTHROUGH_LAMBDA_CREDENTIAL",
  VITE_APP_CLOUD_API_DOMAIN: "VITE_APP_CLOUD_API_DOMAIN",
  VITE_LAMBDA_S3_BUCKET_NAME: "VITE_LAMBDA_S3_BUCKET_NAME",
  VITE_LIB_ENV_NAME: "VITE_LIB_ENV_NAME",
} as const;

/**
 * Type for environment variable keys
 */
export type EnvVarKey = keyof typeof ENV_VARS;

/**
 * Environment modes
 */
export enum EnvironmentMode {
  Development = "development",
  Production = "production",
  Test = "test",
}

// Helper functions for accessing different environment sources
// These are exposed for testing purposes
export const envHelpers = {
  getProcessEnv(): Record<string, string | undefined> | undefined {
    if (typeof process !== "undefined" && process.env) {
      return process.env;
    }
    return undefined;
  },

  getImportMetaEnv(): Record<string, any> | undefined {
    try {
      // Check if import.meta.env exists (only in Vite environments)
      if (
        typeof globalThis !== "undefined" &&
        "import" in globalThis &&
        "meta" in (globalThis as any).import &&
        "env" in (globalThis as any).import.meta
      ) {
        return (globalThis as any).import.meta.env;
      }
    } catch (e) {
      // Ignore any errors when trying to access import.meta
    }
    return undefined;
  },

  getMode(): string | undefined {
    const processEnv = this.getProcessEnv();
    if (processEnv && processEnv.NODE_ENV) {
      return processEnv.NODE_ENV;
    }

    const importMetaEnv = this.getImportMetaEnv();
    if (importMetaEnv && importMetaEnv.MODE) {
      return importMetaEnv.MODE;
    }

    return undefined;
  },
};

/**
 * Check if an environment variable is a passthrough variable
 * @param name The name of the environment variable
 * @returns True if the environment variable is a passthrough variable
 */
export const isPassthroughVar = (name: string): boolean => {
  return name.startsWith(PASSTHROUGH_PREFIX);
};

/**
 * Get the current environment mode
 * @returns The current environment mode
 */
export const getEnvironmentMode = (): EnvironmentMode => {
  const mode = envHelpers.getMode()?.toLowerCase();

  if (mode === EnvironmentMode.Production) return EnvironmentMode.Production;
  if (mode === EnvironmentMode.Test) return EnvironmentMode.Test;

  // Always default to development
  return EnvironmentMode.Development;
};

/**
 * Type-safe accessor for environment variables
 * Uses Vite's import.meta.env for runtime access and process.env for test context
 *
 * @param key Environment variable key
 * @param defaultValue Default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export const getEnvVar = (key: EnvVarKey, defaultValue: string = ""): string => {
  const envKey = ENV_VARS[key];

  // Special case for NODE_ENV
  if (key === "NODE_ENV") {
    const mode = envHelpers.getMode();
    return mode || defaultValue;
  }

  // First try process.env (Node.js environment)
  const processEnv = envHelpers.getProcessEnv();
  if (processEnv && processEnv[envKey] !== undefined && processEnv[envKey] !== "") {
    return processEnv[envKey] || "";
  }

  // Then try import.meta.env (browser environment)
  const importMetaEnv = envHelpers.getImportMetaEnv();
  if (importMetaEnv && importMetaEnv[envKey] !== undefined) {
    return importMetaEnv[envKey] || defaultValue;
  }

  return defaultValue;
};

/**
 * Get a passthrough environment variable value
 * @param key The key of the passthrough variable (without prefix)
 * @param defaultValue Default value if the variable is not set
 * @returns The passthrough variable value or the default value
 */
export const getPassthroughVar = (key: string, defaultValue: string = ""): string => {
  const prefixedKey = `${PASSTHROUGH_PREFIX}${key}`;

  // First try process.env (Node.js environment)
  const processEnv = envHelpers.getProcessEnv();
  if (processEnv && processEnv[prefixedKey] !== undefined) {
    return processEnv[prefixedKey] || defaultValue;
  }

  // Then try import.meta.env (browser environment)
  const importMetaEnv = envHelpers.getImportMetaEnv();
  if (importMetaEnv && importMetaEnv[prefixedKey] !== undefined) {
    return importMetaEnv[prefixedKey] || defaultValue;
  }

  return defaultValue;
};

/**
 * Create environment variable replacements for build time
 * @param env Environment variables
 * @param strictCheck Whether to check for required environment variables
 * @param mode The current environment mode
 * @returns Environment variable replacements
 */
export const createEnvReplacements = (
  env: Record<string, string | undefined>,
  strictCheck: boolean = false,
  mode: string = envHelpers.getMode() || "development"
): Record<string, string> => {
  const replacements: Record<string, string> = {};

  // Check if we should enforce environment variable presence
  const enforceCheck =
    strictCheck &&
    (mode === EnvironmentMode.Production ||
      (envHelpers.getProcessEnv() && envHelpers.getProcessEnv()?.FORCE_ENV_CHECK === "true"));

  // Check for missing required environment variables
  if (enforceCheck) {
    for (const key of Object.keys(ENV_VARS)) {
      if (key === "NODE_ENV") continue; // NODE_ENV is not strictly required
      if (isPassthroughVar(key)) continue; // Skip passthrough variables in strict checking

      const value = env[key];
      if (value === undefined || value === "") {
        throw new Error(`Required environment variable ${key} is missing or empty`);
      }
    }
  }

  // Create replacements for all non-passthrough variables
  for (const [key, value] of Object.entries(env)) {
    // Skip passthrough variables
    if (isPassthroughVar(key)) continue;

    // Add the replacement for process.env.KEY
    replacements[`process.env.${key}`] = JSON.stringify(value);
  }

  return replacements;
};

/**
 * Ensure an environment variable exists and throw an error if it doesn't
 * @param key Environment variable key
 * @returns The environment variable value
 * @throws Error if the environment variable is not defined
 */
export const requireEnvVar = (key: EnvVarKey): string => {
  const value = getEnvVar(key);
  if (value === undefined || value === "") {
    throw new Error(`Required environment variable ${key} is missing or empty`);
  }
  return value;
};
