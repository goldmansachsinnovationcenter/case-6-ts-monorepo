/**
 * Environment variable configuration for the monorepo
 */

/**
 * Prefix for environment variables that should not be replaced at build time
 */
export const PASSTHROUGH_PREFIX = 'PASSTHROUGH_';

/**
 * Standard environment variables used across the monorepo
 */
export const ENV_VARS = {
  EO_CLOUD_API_DOMAIN: 'EO_CLOUD_API_DOMAIN',
  BIO_S3_BUCKET_NAME: 'BIO_S3_BUCKET_NAME',
  NODE_ENV: 'NODE_ENV',
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
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Get the current environment mode
 * @returns The current environment mode
 */
export const getEnvironmentMode = (): EnvironmentMode => {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production') return EnvironmentMode.Production;
  if (nodeEnv === 'test') return EnvironmentMode.Test;
  return EnvironmentMode.Development;
};

/**
 * Get an environment variable value
 * @param key Environment variable key
 * @param defaultValue Default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export const getEnvVar = (key: EnvVarKey, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

/**
 * Get a passthrough environment variable at runtime
 * @param key Environment variable key without the PASSTHROUGH_ prefix
 * @param defaultValue Default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export const getPassthroughVar = (key: string, defaultValue: string = ''): string => {
  return process.env[`${PASSTHROUGH_PREFIX}${key}`] || defaultValue;
};

/**
 * Create a map of environment variables for Vite's define option
 * @param env Environment variables object from Vite's loadEnv
 * @returns Object with process.env.* keys mapped to JSON stringified values
 */
export const createEnvReplacements = (env: Record<string, string>): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => !isPassthroughVar(key))
      .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
  );
};
