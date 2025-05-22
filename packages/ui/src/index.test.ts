import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { getApiUrl } from "./index";

describe("UI utility functions", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment variables after each test
    process.env = { ...originalEnv };
  });

  describe("getApiUrl", () => {
    test("returns the VITE_APP_CLOUD_API_DOMAIN environment variable", () => {
      process.env.VITE_APP_CLOUD_API_DOMAIN = "api.example.com";
      expect(getApiUrl()).toBe("api.example.com");
    });

    test("returns empty string when VITE_APP_CLOUD_API_DOMAIN is not set", () => {
      delete process.env.VITE_APP_CLOUD_API_DOMAIN;
      expect(getApiUrl()).toBe("");
    });

    test("returns empty string when VITE_APP_CLOUD_API_DOMAIN is empty", () => {
      process.env.VITE_APP_CLOUD_API_DOMAIN = "";
      expect(getApiUrl()).toBe("");
    });
  });
});
