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
