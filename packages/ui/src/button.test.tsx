import React from "react";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    // Restore original environment variables after each test
    process.env = { ...originalEnv };
  });

  test("renders button with children and environment", () => {
    render(<Button>Click me</Button>);

    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Click me (test)");
  });

  test("applies custom className", () => {
    render(<Button className="custom-class">Click me</Button>);

    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveClass("custom-class");
    // Make sure it still has the default classes too
    expect(buttonElement).toHaveClass("bg-blue-500");
    expect(buttonElement).toHaveClass("hover:bg-blue-700");
  });

  test("handles different environment values", () => {
    process.env.NODE_ENV = "production";
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveTextContent("Click me (production)");
  });

  test("handles empty NODE_ENV by defaulting to development", () => {
    delete process.env.NODE_ENV;
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveTextContent("Click me (development)");
  });

  test("executes onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const buttonElement = screen.getByRole("button");
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("does not throw error when onClick is not provided", () => {
    render(<Button>Click me</Button>);

    const buttonElement = screen.getByRole("button");
    expect(() => {
      fireEvent.click(buttonElement);
    }).not.toThrow();
  });
});
