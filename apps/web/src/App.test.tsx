import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App, { AppEnvironment } from "./App";

// Mock modules before importing App
vi.mock("@repo/ui", () => ({
  Button: ({ children }) => <button>{children} (test)</button>,
  getApiUrl: () => "mocked-api-url",
}));

describe("App", () => {
  test("renders environment variables correctly", () => {
    // Create mock environment for testing
    const mockEnvironment: AppEnvironment = {
      apiDomain: "test-api.example.com",
      s3BucketName: "test-bucket-name",
      nodeEnv: "test",
      apiUrl: "mocked-api-url",
    };

    // Render App with mock environment
    const { container, debug } = render(<App environment={mockEnvironment} />);

    // Debug the rendered output to see what's actually there
    debug();

    // Check if environment variables are rendered correctly
    // Use more specific selectors to avoid potential mismatches
    const apiDomainElement = screen.getByText(/API Domain:/i);
    console.log("API Domain element text:", apiDomainElement.textContent);

    expect(apiDomainElement).toHaveTextContent("API Domain: test-api.example.com");
    expect(screen.getByText(/S3 Bucket:/i)).toHaveTextContent("S3 Bucket: test-bucket-name");
    expect(screen.getByText(/Node Environment:/i)).toHaveTextContent("Node Environment: test");

    // Check if the UI library integration is working
    expect(screen.getByText(/API URL from library:/i)).toHaveTextContent(
      "API URL from library: mocked-api-url"
    );

    // Check if passthrough variables section is rendered
    expect(screen.getByText(/Runtime credential:/i)).toBeInTheDocument();

    // Check if the Button component is rendered
    expect(screen.getByText(/Click me/i)).toBeInTheDocument();
  });
});
