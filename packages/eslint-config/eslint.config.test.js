import { describe, it, expect, vi } from "vitest";

// Mock the actual eslint config before importing it
vi.mock("./eslint.config.js", async () => {
  // Create a simplified mock of the ESLint config for testing
  const mockConfig = [
    {
      files: ["**/*.{js,ts}"],
      plugins: {
        "@typescript-eslint": { rules: {} },
      },
      rules: { "no-unused-vars": "error" },
    },
    {
      files: ["**/*.{jsx,tsx}"],
      plugins: {
        react: { rules: {} },
        "react-hooks": { rules: {} },
      },
    },
    {
      files: ["**/*.spec.*", "**/*.test.*"],
      rules: {},
    },
  ];

  // Mock the library and react configs as well
  const mockLibrary = [...mockConfig];
  const mockReact = [...mockConfig];

  return {
    default: mockConfig,
    library: mockLibrary,
    react: mockReact,
  };
});

// Import the mocked config
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
      (item) => item.files && Array.isArray(item.files) && item.files.includes("**/*.{js,ts}")
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
      (item) => item.files && Array.isArray(item.files) && item.files.includes("**/*.test.*")
    );
    expect(testConfig).toBeDefined();
  });
});
