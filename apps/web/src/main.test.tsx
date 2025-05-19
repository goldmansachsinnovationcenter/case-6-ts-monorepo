import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock React DOM using importActual pattern
vi.mock("react-dom/client", async () => {
  const renderMock = vi.fn();
  const createRootMock = vi.fn(() => ({
    render: renderMock,
  }));

  return {
    createRoot: createRootMock,
    default: {
      createRoot: createRootMock,
    },
  };
});

// Mock the App component
vi.mock("./App", () => ({
  default: () => <div data-testid="app-mock">App Component</div>,
}));

// Mock document.getElementById
document.getElementById = vi.fn(() => document.createElement("div"));

describe("main", () => {
  // Mock console.log before each test
  const originalConsoleLog = console.log;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    // Properly spy on console.log
    console.log = vi.fn();
  });

  afterEach(() => {
    // Restore original console.log after each test
    console.log = originalConsoleLog;
  });

  it("renders the App component into the DOM", async () => {
    // Reset module registry to ensure clean import
    vi.resetModules();

    // Import main.tsx which will execute the code
    await import("./main");

    // Check that getElementById was called with 'root'
    expect(document.getElementById).toHaveBeenCalledWith("root");

    // Check that ReactDOM.createRoot was called
    const reactDomClient = await import("react-dom/client");
    expect(reactDomClient.createRoot).toHaveBeenCalled();
  });

  it("logs the environment mode", async () => {
    // Reset module registry to ensure clean import
    vi.resetModules();

    // Import main.tsx which will execute the code
    await import("./main");

    // Check that console.log was called with the right arguments
    expect(console.log).toHaveBeenCalledWith("Environment:", expect.any(String));
  });
});
