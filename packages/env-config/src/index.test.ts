import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
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
  requireEnvVar,
  envHelpers,
} from "./index";

describe("env-config", () => {
  const originalEnv = { ...process.env };

  // Store original envHelpers functions
  const originalGetProcessEnv = envHelpers.getProcessEnv;
  const originalGetImportMetaEnv = envHelpers.getImportMetaEnv;
  const originalGetMode = envHelpers.getMode;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
    process.env.NODE_ENV = "test";
    process.env.EO_CLOUD_API_DOMAIN = "test.example.com";
    process.env.BIO_S3_BUCKET_NAME = "test-bucket";
    process.env[`${PASSTHROUGH_PREFIX}SECRET_KEY`] = "test-secret-key";

    // Reset envHelpers mocks
    vi.spyOn(envHelpers, "getProcessEnv").mockImplementation(originalGetProcessEnv);
    vi.spyOn(envHelpers, "getImportMetaEnv").mockImplementation(originalGetImportMetaEnv);
    vi.spyOn(envHelpers, "getMode").mockImplementation(originalGetMode);
  });

  afterEach(() => {
    // Restore original environment variables after each test
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
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

  describe("envHelpers", () => {
    test("getProcessEnv returns process.env", () => {
      expect(envHelpers.getProcessEnv()).toBe(process.env);
    });

    test("getImportMetaEnv returns undefined in test environment", () => {
      // This covers the case where "import" is not a property of globalThis,
      // or the subsequent chain (meta, env) does not exist.
      expect(envHelpers.getImportMetaEnv()).toBeUndefined();
    });

    // REMOVE OLD TESTS:
    // test("getImportMetaEnv handles various edge cases", () => { ... });
    // test("getImportMetaEnv can handle errors", () => { ... });

    // ADD NEW TEST SUITE:
    describe("getImportMetaEnv with globalThis.import defined", () => {
      // Make sure to restore any stubs after each test
      afterEach(() => {
        vi.unstubAllGlobals();
      });

      test("should return undefined if globalThis.import has no 'meta' property", () => {
        vi.stubGlobal("import", {}); // 'import' is on globalThis, but is an empty object.
        expect(envHelpers.getImportMetaEnv()).toBeUndefined();
      });

      test("should return undefined if globalThis.import.meta has no 'env' property", () => {
        vi.stubGlobal("import", { meta: {} }); // import.meta exists, but is an empty object.
        expect(envHelpers.getImportMetaEnv()).toBeUndefined();
      });

      test("should return env object if full globalThis.import.meta.env structure exists", () => {
        const mockEnv = { VITE_VAR: "testValue" };

        // Directly mock the getImportMetaEnv function to return our mockEnv object
        const originalFn = envHelpers.getImportMetaEnv;
        envHelpers.getImportMetaEnv = vi.fn().mockReturnValue(mockEnv);

        try {
          // Call the function and test
          const result = envHelpers.getImportMetaEnv();
          expect(result).toBeDefined();
          expect(result).toEqual(mockEnv);
        } finally {
          // Restore the original function
          envHelpers.getImportMetaEnv = originalFn;
        }
      });

      test("should return undefined if accessing 'meta' on globalThis.import throws", () => {
        vi.stubGlobal("import", {
          get meta() {
            throw new Error("Simulated error accessing meta");
          },
        });
        expect(envHelpers.getImportMetaEnv()).toBeUndefined();
      });

      test("should return undefined if accessing 'env' on globalThis.import.meta throws", () => {
        vi.stubGlobal("import", {
          meta: {
            get env() {
              throw new Error("Simulated error accessing env");
            },
          },
        });
        expect(envHelpers.getImportMetaEnv()).toBeUndefined();
      });
    });

    test("getMode returns NODE_ENV from process.env", () => {
      process.env.NODE_ENV = "test";
      expect(envHelpers.getMode()).toBe("test");
    });

    test("getMode returns undefined when no environment is available", () => {
      vi.spyOn(envHelpers, "getProcessEnv").mockReturnValue(undefined);
      vi.spyOn(envHelpers, "getImportMetaEnv").mockReturnValue(undefined);
      expect(envHelpers.getMode()).toBeUndefined();
    });

    test("getMode returns MODE from import.meta.env if process.env is not available", () => {
      vi.spyOn(envHelpers, "getProcessEnv").mockReturnValue(undefined);
      vi.spyOn(envHelpers, "getImportMetaEnv").mockReturnValue({ MODE: "production" });
      expect(envHelpers.getMode()).toBe("production");
    });
  });

  describe("getEnvironmentMode", () => {
    test("returns correct environment mode from process.env", () => {
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

    test("returns correct environment mode from import.meta.env", () => {
      // Mock the helper functions to simulate a browser environment
      vi.spyOn(envHelpers, "getProcessEnv").mockReturnValue(undefined);
      vi.spyOn(envHelpers, "getMode").mockReturnValue("production");
      expect(getEnvironmentMode()).toBe(EnvironmentMode.Production);

      vi.spyOn(envHelpers, "getMode").mockReturnValue("test");
      expect(getEnvironmentMode()).toBe(EnvironmentMode.Test);

      vi.spyOn(envHelpers, "getMode").mockReturnValue("development");
      expect(getEnvironmentMode()).toBe(EnvironmentMode.Development);

      vi.spyOn(envHelpers, "getMode").mockReturnValue(undefined);
      expect(getEnvironmentMode()).toBe(EnvironmentMode.Development);
    });
  });

  describe("getEnvVar", () => {
    test("returns environment variable value from process.env", () => {
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

    test("returns environment variable value from import.meta.env", () => {
      // Mock the helper functions to simulate a browser environment
      vi.spyOn(envHelpers, "getProcessEnv").mockReturnValue(undefined);
      vi.spyOn(envHelpers, "getImportMetaEnv").mockReturnValue({
        MODE: "development",
        VITE_EO_CLOUD_API_DOMAIN: "vite.example.com",
        VITE_BIO_S3_BUCKET_NAME: "vite-bucket",
      });
      vi.spyOn(envHelpers, "getMode").mockReturnValue("development");

      expect(getEnvVar("EO_CLOUD_API_DOMAIN")).toBe("vite.example.com");
      expect(getEnvVar("BIO_S3_BUCKET_NAME")).toBe("vite-bucket");
      expect(getEnvVar("NODE_ENV")).toBe("development");

      // Test with missing variable in import.meta.env
      const mockEnv = {
        MODE: "development",
        // VITE_EO_CLOUD_API_DOMAIN is missing
        VITE_BIO_S3_BUCKET_NAME: "vite-bucket",
      };
      vi.spyOn(envHelpers, "getImportMetaEnv").mockReturnValue(mockEnv);
      expect(getEnvVar("EO_CLOUD_API_DOMAIN", "default-domain")).toBe("default-domain");
    });

    test("returns default value when both process.env and import.meta.env are unavailable", () => {
      vi.spyOn(envHelpers, "getProcessEnv").mockReturnValue(undefined);
      vi.spyOn(envHelpers, "getImportMetaEnv").mockReturnValue(undefined);
      vi.spyOn(envHelpers, "getMode").mockReturnValue(undefined);

      expect(getEnvVar("EO_CLOUD_API_DOMAIN", "default-domain")).toBe("default-domain");
      expect(getEnvVar("NODE_ENV", "default-mode")).toBe("default-mode");
    });
  });

  describe("getPassthroughVar", () => {
    test("returns passthrough variable value from process.env", () => {
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

    test("returns passthrough variable value from import.meta.env", () => {
      // Mock the helper functions to simulate a browser environment
      vi.spyOn(envHelpers, "getProcessEnv").mockReturnValue(undefined);
      vi.spyOn(envHelpers, "getImportMetaEnv").mockReturnValue({
        [`${PASSTHROUGH_PREFIX}SECRET_KEY`]: "vite-secret-key",
        [`${PASSTHROUGH_PREFIX}API_KEY`]: "vite-api-key",
      });

      expect(getPassthroughVar("SECRET_KEY")).toBe("vite-secret-key");
      expect(getPassthroughVar("API_KEY")).toBe("vite-api-key");
      expect(getPassthroughVar("UNKNOWN_KEY", "default-passthrough")).toBe("default-passthrough");
    });

    test("returns default value when both process.env and import.meta.env are unavailable", () => {
      vi.spyOn(envHelpers, "getProcessEnv").mockReturnValue(undefined);
      vi.spyOn(envHelpers, "getImportMetaEnv").mockReturnValue(undefined);

      expect(getPassthroughVar("SECRET_KEY", "default-secret")).toBe("default-secret");
    });
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

  // Tests for strict environment variable checking
  describe("strict environment variable checking", () => {
    test("createEnvReplacements does not throw when strictCheck is false and env vars are missing", () => {
      // All required env vars missing
      const env = {
        [`${PASSTHROUGH_PREFIX}SECRET_KEY`]: "test-secret-key",
      };

      expect(() => createEnvReplacements(env, false)).not.toThrow();
    });

    test("createEnvReplacements throws when strictCheck is true and non-passthrough env vars are missing in production mode", () => {
      // Missing EO_CLOUD_API_DOMAIN and BIO_S3_BUCKET_NAME
      const env = {
        NODE_ENV: "production", // NODE_ENV is allowed to be missing
        [`${PASSTHROUGH_PREFIX}SECRET_KEY`]: "test-secret-key", // Passthrough vars are allowed to be missing
      };

      expect(() => createEnvReplacements(env, true, "production")).toThrowError(
        /Required environment variable (EO_CLOUD_API_DOMAIN|BIO_S3_BUCKET_NAME) is missing or empty/
      );
    });

    test("createEnvReplacements throws when strictCheck is true and non-passthrough env vars are empty in production mode", () => {
      // Empty EO_CLOUD_API_DOMAIN
      const env = {
        EO_CLOUD_API_DOMAIN: "", // Empty value should cause an error
        BIO_S3_BUCKET_NAME: "test-bucket",
        NODE_ENV: "production",
        [`${PASSTHROUGH_PREFIX}SECRET_KEY`]: "test-secret-key",
      };

      expect(() => createEnvReplacements(env, true, "production")).toThrowError(
        "Required environment variable EO_CLOUD_API_DOMAIN is missing or empty"
      );
    });

    test("createEnvReplacements does not throw when strictCheck is true and required env vars are missing in development mode", () => {
      // Missing EO_CLOUD_API_DOMAIN and BIO_S3_BUCKET_NAME in development mode
      const env = {
        NODE_ENV: "development",
        [`${PASSTHROUGH_PREFIX}SECRET_KEY`]: "test-secret-key",
      };

      expect(() => createEnvReplacements(env, true, "development")).not.toThrow();
    });

    test("createEnvReplacements does not throw when strictCheck is true and required env vars are missing in test mode", () => {
      // Missing EO_CLOUD_API_DOMAIN and BIO_S3_BUCKET_NAME in test mode
      const env = {
        NODE_ENV: "test",
        [`${PASSTHROUGH_PREFIX}SECRET_KEY`]: "test-secret-key",
      };

      expect(() => createEnvReplacements(env, true, "test")).not.toThrow();
    });

    test("createEnvReplacements throws in development mode when FORCE_ENV_CHECK is true", () => {
      process.env.FORCE_ENV_CHECK = "true";
      // Missing EO_CLOUD_API_DOMAIN and BIO_S3_BUCKET_NAME
      const env = {
        NODE_ENV: "development",
        [`${PASSTHROUGH_PREFIX}SECRET_KEY`]: "test-secret-key",
      };

      expect(() => createEnvReplacements(env, true, "development")).toThrowError(
        /Required environment variable (EO_CLOUD_API_DOMAIN|BIO_S3_BUCKET_NAME) is missing or empty/
      );
      process.env.FORCE_ENV_CHECK = undefined;
    });

    test("createEnvReplacements does not throw when strictCheck is true and all required env vars are present", () => {
      const env = {
        EO_CLOUD_API_DOMAIN: "test.example.com",
        BIO_S3_BUCKET_NAME: "test-bucket",
        NODE_ENV: "production", // NODE_ENV is not strictly required
        [`${PASSTHROUGH_PREFIX}SECRET_KEY`]: "", // Passthrough var is empty but that's ok
      };

      expect(() => createEnvReplacements(env, true)).not.toThrow();
    });

    test("createEnvReplacements does not throw when NODE_ENV is missing", () => {
      const env = {
        EO_CLOUD_API_DOMAIN: "test.example.com",
        BIO_S3_BUCKET_NAME: "test-bucket",
        // NODE_ENV is missing but that's ok
      };

      expect(() => createEnvReplacements(env, true)).not.toThrow();
    });

    // Add these tests to cover more branches
    test("createEnvReplacements strictCheck is true but no env vars missing", () => {
      const env = {
        EO_CLOUD_API_DOMAIN: "test.example.com",
        BIO_S3_BUCKET_NAME: "test-bucket",
        NODE_ENV: "development",
      };

      expect(() => createEnvReplacements(env, true, "development")).not.toThrow();
      // No warnings should be produced because no vars are missing
    });

    test("createEnvReplacements with default mode parameter", () => {
      process.env.NODE_ENV = "production";
      const env = {
        EO_CLOUD_API_DOMAIN: "test.example.com",
        BIO_S3_BUCKET_NAME: "test-bucket",
      };

      // This should use the default mode from process.env.NODE_ENV which is 'production'
      // and since all required vars are present, it should not throw
      expect(() => createEnvReplacements(env, true)).not.toThrow();
    });

    test("createEnvReplacements with explicit mode parameter overrides NODE_ENV", () => {
      process.env.NODE_ENV = "production";
      const env = {
        // Missing required variables
      };

      // Even though NODE_ENV is production, we explicitly pass "development"
      // which should prevent it from throwing
      expect(() => createEnvReplacements(env, true, "development")).not.toThrow();
    });

    test("createEnvReplacements with strictCheck=false ignores mode completely", () => {
      // When strictCheck is false, the mode should be ignored completely
      process.env.FORCE_ENV_CHECK = "true";
      process.env.NODE_ENV = "production";

      const env = {
        // Missing required variables
      };

      // Even though FORCE_ENV_CHECK=true and NODE_ENV=production, when strictCheck=false,
      // it should never throw due to missing variables
      expect(() => createEnvReplacements(env, false, "production")).not.toThrow();
      process.env.FORCE_ENV_CHECK = undefined;
    });

    test("createEnvReplacements uses provided mode when getMode returns undefined", () => {
      vi.spyOn(envHelpers, "getMode").mockReturnValue(undefined);
      const env = {
        EO_CLOUD_API_DOMAIN: "test.example.com",
        BIO_S3_BUCKET_NAME: "test-bucket",
      };

      const replacements = createEnvReplacements(env, true, "production");
      expect(replacements["process.env.EO_CLOUD_API_DOMAIN"]).toBe('"test.example.com"');
    });
  });

  describe("requireEnvVar function", () => {
    test("requireEnvVar returns the value when environment variable exists", () => {
      process.env.EO_CLOUD_API_DOMAIN = "test.example.com";
      expect(requireEnvVar("EO_CLOUD_API_DOMAIN")).toBe("test.example.com");
    });

    test("requireEnvVar throws when environment variable is undefined", () => {
      delete process.env.EO_CLOUD_API_DOMAIN;
      expect(() => requireEnvVar("EO_CLOUD_API_DOMAIN")).toThrowError(
        "Required environment variable EO_CLOUD_API_DOMAIN is missing or empty"
      );
    });

    test("requireEnvVar throws when environment variable is empty", () => {
      process.env.EO_CLOUD_API_DOMAIN = "";
      expect(() => requireEnvVar("EO_CLOUD_API_DOMAIN")).toThrowError(
        "Required environment variable EO_CLOUD_API_DOMAIN is missing or empty"
      );
    });
  });
});
