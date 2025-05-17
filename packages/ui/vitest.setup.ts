import { expect, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom";

// Extend Vitest's expect with testing-library matchers
expect.extend(matchers);

// Mock environment variables for UI package tests
process.env = {
  ...process.env,
  EO_CLOUD_API_DOMAIN: "test-api.example.com",
};
