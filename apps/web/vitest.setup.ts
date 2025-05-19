import "@testing-library/jest-dom";
import { expect } from "vitest";

// Directly import all the matchers from jest-dom
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with all the jest-dom matchers
expect.extend(matchers);

// Mock environment variables for web app tests
process.env = {
  ...process.env,
  EO_CLOUD_API_DOMAIN: "test-api.example.com",
};
