import React from "react";
import { describe, test, expect, vi, beforeEach, afterEach, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App, { AppEnvironment, AppModule } from "./App";

// Only mock the getApiUrl function, not any UI components
vi.mock("@repo/ui", async () => {
  const actual = await vi.importActual("@repo/ui");
  return {
    ...actual,
    getApiUrl: () => "mocked-api-url",
  };
});

// Setup the default mock for AppModule for most tests
const originalGetAppEnvironment = AppModule.getAppEnvironment; // Actual function from initial import
AppModule.getAppEnvironment = vi.fn().mockImplementation(
  (): AppEnvironment => ({
    apiDomain: "default-api.example.com",
    s3BucketName: "default-bucket",
    nodeEnv: "development",
    apiUrl: "mocked-api-url",
  })
);

describe("App", () => {
  beforeEach(() => {
    // Reset mocks between tests
    vi.clearAllMocks();
    // Ensure the global AppModule mock is reset to the default vi.fn() for tests that rely on it
    AppModule.getAppEnvironment = vi.fn().mockImplementation(
      (): AppEnvironment => ({
        apiDomain: "default-api.example.com",
        s3BucketName: "default-bucket",
        nodeEnv: "development",
        apiUrl: "mocked-api-url",
      })
    );
  });

  afterEach(() => {
    // Clean up any stubs on `import` global
    vi.unstubAllGlobals();
    // Clean up any environment stubs as a good measure, though stubGlobal was used here.
    vi.unstubAllEnvs();
  });

  afterAll(() => {
    // Restore original function after all tests
    AppModule.getAppEnvironment = originalGetAppEnvironment;
    vi.resetModules(); // Clean up module cache alterations
  });

  test("renders environment variables correctly with passed environment prop", () => {
    // Create mock environment for testing
    const mockEnvironment: AppEnvironment = {
      apiDomain: "test-api.example.com",
      s3BucketName: "test-bucket-name",
      nodeEnv: "test",
      apiUrl: "mocked-api-url",
    };

    // Render App with mock environment
    render(<App environment={mockEnvironment} />);

    // Check for the heading
    expect(screen.getByText("Turborepo Environment Variables Example")).toBeInTheDocument();

    // Get the list items by their strong element labels
    const apiDomainItem = screen.getByText("API Domain:").closest("li");
    const s3BucketItem = screen.getByText("S3 Bucket:").closest("li");
    const nodeEnvItem = screen.getByText("Node Environment:").closest("li");
    const apiUrlItem = screen.getByText("API URL from library:").closest("li");
    const runtimeCredItem = screen.getByText("Runtime credential:").closest("li");

    // Check if they contain the expected values
    expect(apiDomainItem).toHaveTextContent("test-api.example.com");
    expect(s3BucketItem).toHaveTextContent("test-bucket-name");
    expect(nodeEnvItem).toHaveTextContent("test");
    expect(apiUrlItem).toHaveTextContent("mocked-api-url");
    expect(runtimeCredItem).toHaveTextContent("[RUNTIME VALUE FOR SOME_CREDENTIAL]");

    // Check if the Button component is rendered (without mocking it)
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders App without environment prop", () => {
    render(<App />);

    // Check for the heading
    expect(screen.getByText("Turborepo Environment Variables Example")).toBeInTheDocument();

    // Get the list items by their strong element labels
    const apiDomainItem = screen.getByText("API Domain:").closest("li");
    const s3BucketItem = screen.getByText("S3 Bucket:").closest("li");
    const nodeEnvItem = screen.getByText("Node Environment:").closest("li");

    expect(apiDomainItem).toHaveTextContent("default-api.example.com");
    expect(s3BucketItem).toHaveTextContent("default-bucket");
    expect(nodeEnvItem).toHaveTextContent("development");
  });

  test("getAppEnvironment handles missing environment variables (using mock)", () => {
    // This test uses the globally mocked AppModule.getAppEnvironment
    (AppModule.getAppEnvironment as ReturnType<typeof vi.fn>).mockImplementationOnce(
      (): AppEnvironment => ({
        apiDomain: "Not defined",
        s3BucketName: "Not defined",
        nodeEnv: "Not defined",
        apiUrl: "mocked-api-url",
      })
    );

    render(<App />);

    // Get the list items by their strong element labels
    const apiDomainItem = screen.getByText("API Domain:").closest("li");
    const s3BucketItem = screen.getByText("S3 Bucket:").closest("li");
    const nodeEnvItem = screen.getByText("Node Environment:").closest("li");

    expect(apiDomainItem).toHaveTextContent("Not defined");
    expect(s3BucketItem).toHaveTextContent("Not defined");
    expect(nodeEnvItem).toHaveTextContent("Not defined");
  });

  test("getAppEnvironment uses provided environment values (using mock)", () => {
    // This test uses the globally mocked AppModule.getAppEnvironment
    (AppModule.getAppEnvironment as ReturnType<typeof vi.fn>).mockImplementationOnce(
      (): AppEnvironment => ({
        apiDomain: "api.test.com",
        s3BucketName: "test-s3-bucket",
        nodeEnv: "production",
        apiUrl: "mocked-api-url",
      })
    );

    render(<App />);

    // Get the list items by their strong element labels
    const apiDomainItem = screen.getByText("API Domain:").closest("li");
    const s3BucketItem = screen.getByText("S3 Bucket:").closest("li");
    const nodeEnvItem = screen.getByText("Node Environment:").closest("li");

    expect(apiDomainItem).toHaveTextContent("api.test.com");
    expect(s3BucketItem).toHaveTextContent("test-s3-bucket");
    expect(nodeEnvItem).toHaveTextContent("production");
  });

  // Tests for the actual AppModule.getAppEnvironment implementation from App.tsx
  describe("actual AppModule.getAppEnvironment implementation", () => {
    beforeEach(() => {
      // Reset modules before each test to ensure ./App is re-evaluated
      // with the (newly stubbed) import.meta.env for that specific test.
      vi.resetModules();
    });

    // Note: The afterEach from the parent describe block will call vi.unstubAllEnvs()

    test("with environment variables", async () => {
      vi.stubEnv("VITE_EO_CLOUD_API_DOMAIN", "real-domain-from-test");
      vi.stubEnv("VITE_BIO_S3_BUCKET_NAME", "real-bucket-from-test");
      vi.stubEnv("MODE", "test-mode-from-test");

      // Dynamically import the module - it will use the stubbed import.meta.env
      const { AppModule: FreshAppModule } = await import("./App");
      const result = FreshAppModule.getAppEnvironment();

      expect(result.apiDomain).toBe("real-domain-from-test");
      expect(result.s3BucketName).toBe("real-bucket-from-test");
      expect(result.nodeEnv).toBe("test-mode-from-test");
    });

    test("without environment variables (defaults)", async () => {
      // Stubbing with empty strings will make them falsy,
      // so the '|| "Not defined"' logic in App.tsx will apply.
      vi.stubEnv("VITE_EO_CLOUD_API_DOMAIN", "");
      vi.stubEnv("VITE_BIO_S3_BUCKET_NAME", "");
      vi.stubEnv("MODE", ""); // For env.MODE || "Not defined"

      // Dynamically import the module
      const { AppModule: FreshAppModule } = await import("./App");
      const result = FreshAppModule.getAppEnvironment();

      expect(result.apiDomain).toBe("Not defined");
      expect(result.s3BucketName).toBe("Not defined");
      expect(result.nodeEnv).toBe("Not defined");
    });
  });
});
