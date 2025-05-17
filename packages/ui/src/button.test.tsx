import React from "react";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
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
  });

  test("handles different environment values", () => {
    process.env.NODE_ENV = "production";

    render(<Button>Click me</Button>);

    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveTextContent("Click me (production)");
  });
});
