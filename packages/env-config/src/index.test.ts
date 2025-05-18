import { describe, test, expect, beforeEach, afterEach } from "vitest";
import {
  ENV_VARS,
  PASSTHROUGH_PREFIX,
  isPassthroughVar,
  getEnvironmentMode,
  EnvironmentMode,
  getEnvVar,
  getPassthroughVar,
  createEnvReplacements,
  EnvVarKey,
} from "./index";

describe("env-config", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
    process.env.NODE_ENV = "test";
    process.env.EO_CLOUD_API_DOMAIN = "test.example.com";
    process.env.BIO_S3_BUCKET_NAME = "test-bucket";
    process.env[`${PASSTHROUGH_PREFIX}SECRET_KEY`] = "test-secret-key";
  });

  afterEach(() => {
    // Restore original environment variables after each test
    process.env = { ...originalEnv };
  });

  test("ENV_VARS constants are defined correctly", () => {
    expect(ENV_VARS.EO_CLOUD_API_DOMAIN).toBe("EO_CLOUD_API_DOMAIN");
    expect(ENV_VARS.BIO_S3_BUCKET_NAME).toBe("BIO_S3_BUCKET_NAME");
    expect(ENV_VARS.NODE_ENV).toBe("NODE_ENV");
  });

  test("isPassthroughVar correctly identifies passthrough variables", () => {
    expect(isPassthroughVar(`${PASSTHROUGH_PREFIX}SECRET_KEY`)).toBe(true);
    expect(isPassthroughVar("EO_CLOUD_API_DOMAIN")).toBe(false);
    expect(isPassthroughVar("")).toBe(false);
    expect(isPassthroughVar(`${PASSTHROUGH_PREFIX}`)).toBe(true);
  });

  test("getEnvironmentMode returns correct environment mode", () => {
    process.env.NODE_ENV = "production";
    expect(getEnvironmentMode()).toBe(EnvironmentMode.Production);

    process.env.NODE_ENV = "test";
    expect(getEnvironmentMode()).toBe(EnvironmentMode.Test);

    process.env.NODE_ENV = "development";
    expect(getEnvironmentMode()).toBe(EnvironmentMode.Development);

    // Default to development if not set
    process.env.NODE_ENV = "";
    expect(getEnvironmentMode()).toBe(EnvironmentMode.Development);

    // Handle undefined NODE_ENV
    delete process.env.NODE_ENV;
    expect(getEnvironmentMode()).toBe(EnvironmentMode.Development);

    // Handle unknown values
    process.env.NODE_ENV = "unknown";
    expect(getEnvironmentMode()).toBe(EnvironmentMode.Development);
  });

  test("getEnvVar returns environment variable value", () => {
    expect(getEnvVar("EO_CLOUD_API_DOMAIN")).toBe("test.example.com");
    expect(getEnvVar("BIO_S3_BUCKET_NAME")).toBe("test-bucket");
    expect(getEnvVar("NODE_ENV")).toBe("test");

    // Test with default value for existing variables in ENV_VARS
    const nonExistentButValidKey: EnvVarKey = "NODE_ENV";
    // First set it to undefined
    delete process.env.NODE_ENV;
    expect(getEnvVar(nonExistentButValidKey, "default")).toBe("default");

    // Test with empty environment variable
    process.env.EO_CLOUD_API_DOMAIN = "";
    // In JavaScript, empty strings are falsy, so the default value will be used
    expect(getEnvVar("EO_CLOUD_API_DOMAIN")).toBe(""); // Default is empty string when not provided
    expect(getEnvVar("EO_CLOUD_API_DOMAIN", "default")).toBe("default"); // Empty string is considered falsy

    // Test with undefined environment variable
    delete process.env.EO_CLOUD_API_DOMAIN;
    expect(getEnvVar("EO_CLOUD_API_DOMAIN")).toBe("");
    expect(getEnvVar("EO_CLOUD_API_DOMAIN", "default")).toBe("default");
  });

  test("getPassthroughVar returns passthrough variable value", () => {
    expect(getPassthroughVar("SECRET_KEY")).toBe("test-secret-key");
    expect(getPassthroughVar("UNKNOWN_KEY", "default")).toBe("default");

    // Test with empty passthrough variable
    process.env[`${PASSTHROUGH_PREFIX}EMPTY_KEY`] = "";
    // In JavaScript, empty strings are falsy, so the default value will be used
    expect(getPassthroughVar("EMPTY_KEY")).toBe(""); // Default is empty string when not provided
    expect(getPassthroughVar("EMPTY_KEY", "default")).toBe("default"); // Empty string is considered falsy

    // Test with undefined passthrough variable
    delete process.env[`${PASSTHROUGH_PREFIX}SECRET_KEY`];
    expect(getPassthroughVar("SECRET_KEY")).toBe("");
    expect(getPassthroughVar("SECRET_KEY", "default")).toBe("default");
  });

  test("createEnvReplacements creates correct environment replacements", () => {
    const env = {
      EO_CLOUD_API_DOMAIN: "test.example.com",
      BIO_S3_BUCKET_NAME: "test-bucket",
      NODE_ENV: "test",
      [`${PASSTHROUGH_PREFIX}SECRET_KEY`]: "test-secret-key",
    };

    const replacements = createEnvReplacements(env);

    expect(replacements["process.env.EO_CLOUD_API_DOMAIN"]).toBe('"test.example.com"');
    expect(replacements["process.env.BIO_S3_BUCKET_NAME"]).toBe('"test-bucket"');
    expect(replacements["process.env.NODE_ENV"]).toBe('"test"');
    expect(replacements[`process.env.${PASSTHROUGH_PREFIX}SECRET_KEY`]).toBeUndefined();
  });

  test("createEnvReplacements handles empty environment", () => {
    const replacements = createEnvReplacements({});
    expect(replacements).toEqual({});
  });

  test("createEnvReplacements handles environment with only passthrough variables", () => {
    const env = {
      [`${PASSTHROUGH_PREFIX}SECRET_KEY`]: "test-secret-key",
      [`${PASSTHROUGH_PREFIX}API_KEY`]: "test-api-key",
    };

    const replacements = createEnvReplacements(env);
    expect(Object.keys(replacements).length).toBe(0);
  });
});
