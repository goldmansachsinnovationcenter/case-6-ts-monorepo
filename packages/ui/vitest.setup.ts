import "@testing-library/jest-dom";

// Global test setup goes here
// This file is referenced in your vitest.config.ts

import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with testing-library matchers
expect.extend(matchers);

// Mock environment variables for UI package tests
process.env = {
  ...process.env,
  EO_CLOUD_API_DOMAIN: "test-api.example.com",
};
