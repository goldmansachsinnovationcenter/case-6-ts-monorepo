import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { getApiUrl } from "./index";

describe("UI utilities", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment variables after each test
    process.env = { ...originalEnv };
  });

  test("getApiUrl returns the cloud API domain from environment variable", () => {
    process.env.EO_CLOUD_API_DOMAIN = "api.example.com";
    expect(getApiUrl()).toBe("api.example.com");
  });

  test("getApiUrl returns empty string when environment variable is not set", () => {
    delete process.env.EO_CLOUD_API_DOMAIN;
    expect(getApiUrl()).toBe("");
  });
});
