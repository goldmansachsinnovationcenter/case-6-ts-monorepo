import { describe, it, expect } from "vitest";
import config, { library, react } from "./eslint.config.js";

describe("eslint-config", () => {
  it("should export a valid eslint config array", () => {
    expect(Array.isArray(config)).toBe(true);
    expect(config.length).toBeGreaterThan(0);
  });

  it("should export a valid library config", () => {
    expect(Array.isArray(library)).toBe(true);
    expect(library.length).toBeGreaterThan(0);
  });

  it("should export a valid react config", () => {
    expect(Array.isArray(react)).toBe(true);
    expect(react.length).toBeGreaterThan(0);
  });

  it("should include typescript specific rules", () => {
    const typescriptConfig = config.find(
      (item) => item.files && Array.isArray(item.files) && item.files.includes("**/*.{ts,tsx}")
    );
    expect(typescriptConfig).toBeDefined();
    expect(typescriptConfig.plugins).toHaveProperty("@typescript-eslint");
  });

  it("should include react specific rules", () => {
    const reactConfig = config.find(
      (item) => item.files && Array.isArray(item.files) && item.files.includes("**/*.{jsx,tsx}")
    );
    expect(reactConfig).toBeDefined();
    expect(reactConfig.plugins).toHaveProperty("react");
  });

  it("should include separate rules for test files", () => {
    const testConfig = config.find(
      (item) =>
        item.files &&
        Array.isArray(item.files) &&
        (item.files.includes("**/*.spec.*") || item.files.includes("**/*.test.*"))
    );
    expect(testConfig).toBeDefined();
  });
});
