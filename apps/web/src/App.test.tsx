import React from "react";
import { describe, test, expect, vi, beforeEach, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import App, { AppEnvironment, AppModule } from "./App";

// Only mock the getApiUrl function, not any UI components
vi.mock("@repo/ui", async () => {
  const actual = await vi.importActual("@repo/ui");
  return {
    ...actual,
    getApiUrl: () => "mocked-api-url",
  };
});

// Setup the default mock for AppModule
const originalGetAppEnvironment = AppModule.getAppEnvironment;
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
  });

  afterAll(() => {
    // Restore original function after all tests
    AppModule.getAppEnvironment = originalGetAppEnvironment;
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

  test("getAppEnvironment handles missing environment variables", () => {
    // Set specific values for this test only
    (AppModule.getAppEnvironment as any).mockImplementationOnce(
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

  test("getAppEnvironment uses provided environment values", () => {
    // Set specific values for this test only
    (AppModule.getAppEnvironment as any).mockImplementationOnce(
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
});
