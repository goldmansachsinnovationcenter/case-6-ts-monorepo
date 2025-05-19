/**
 * Environment variable configuration for the monorepo
 */

/**
 * Prefix for environment variables that should not be replaced at build time
 */
export const PASSTHROUGH_PREFIX = "PASSTHROUGH_";

/**
 * Standard environment variables used across the monorepo
 */
export const ENV_VARS = {
  EO_CLOUD_API_DOMAIN: "EO_CLOUD_API_DOMAIN",
  BIO_S3_BUCKET_NAME: "BIO_S3_BUCKET_NAME",
  NODE_ENV: "NODE_ENV",
} as const;

/**
 * Type for environment variable keys
 */
export type EnvVarKey = keyof typeof ENV_VARS;

/**
 * Check if an environment variable should be passed through (not replaced at build time)
 * @param key Environment variable key
 * @returns Whether the variable should be passed through
 */
export const isPassthroughVar = (key: string): boolean => {
  return key.startsWith(PASSTHROUGH_PREFIX);
};

/**
 * Environment modes
 */
export enum EnvironmentMode {
  Development = "development",
  Production = "production",
  Test = "test",
}

/**
 * Get the current environment mode
 * @returns The current environment mode
 */
export const getEnvironmentMode = (): EnvironmentMode => {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === "production") return EnvironmentMode.Production;
  if (nodeEnv === "test") return EnvironmentMode.Test;
  return EnvironmentMode.Development;
};

/**
 * Get an environment variable value
 * @param key Environment variable key
 * @param defaultValue Default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export const getEnvVar = (key: EnvVarKey, defaultValue: string = ""): string => {
  return process.env[key] || defaultValue;
};

/**
 * Ensure an environment variable exists and throw an error if it doesn't
 * @param key Environment variable key
 * @returns The environment variable value
 * @throws Error if the environment variable is not defined
 */
export const requireEnvVar = (key: EnvVarKey): string => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`Required environment variable ${key} is missing or empty`);
  }
  return value;
};

/**
 * Get a passthrough environment variable at runtime
 * @param key Environment variable key without the PASSTHROUGH_ prefix
 * @param defaultValue Default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export const getPassthroughVar = (key: string, defaultValue: string = ""): string => {
  return process.env[`${PASSTHROUGH_PREFIX}${key}`] || defaultValue;
};

/**
 * Create a map of environment variables for Vite's define option
 * @param env Environment variables object from Vite's loadEnv
 * @param strictCheck Set to true to make the build fail if any non-passthrough env var is missing
 * @returns Object with process.env.* keys mapped to JSON stringified values
 * @throws Error if strictCheck is true and any non-passthrough env var is missing
 */
export const createEnvReplacements = (
  envFromViteLoadEnv: Record<string, string>,
  strictCheck: boolean = false
): Record<string, string> => {
  // Check for missing required env vars if strictCheck is enabled
  if (strictCheck) {
    // Check all ENV_VARS except NODE_ENV which has defaults
    Object.values(ENV_VARS).forEach((key) => {
      // Skip passthrough vars and NODE_ENV which has defaults
      if (key !== "NODE_ENV" && !isPassthroughVar(key)) {
        let value = envFromViteLoadEnv[key]; // Value from Vite's loadEnv (should have prefix stripped)

        // If Vite's loadEnv didn't provide it (e.g., VITE_ prefix issue or propagation problem)
        // let's try to get it from process.env directly, checking common patterns.
        if (value === undefined || value === "") {
          value = process.env[`VITE_${key}`] ?? ""; // Check for VITE_PREFIXED_VERSION
        }
        if (value === undefined || value === "") {
          value = process.env[key] ?? ""; // Check for NON_PREFIXED_VERSION
        }

        if (value === undefined || value === "") {
          throw new Error(
            `Required environment variable ${key} (checked as ${key} from Vite's loadEnv, VITE_${key} from process.env, and ${key} from process.env) is missing or empty`
          );
        }
      }
    });
  }

  return Object.fromEntries(
    Object.entries(envFromViteLoadEnv)
      .filter(([key]) => !isPassthroughVar(key))
      .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
  );
};
