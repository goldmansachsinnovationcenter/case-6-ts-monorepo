import "@testing-library/jest-dom";

// Global test setup goes here
// This file is referenced in your vitest.config.ts

import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with testing-library matchers
expect.extend(matchers);

// Mock environment variables for tests
process.env = {
  ...process.env,
  NODE_ENV: "test",
  VITE_APP_CLOUD_API_DOMAIN: "test-api.example.com",
  VITE_LAMBDA_S3_BUCKET_NAME: "test-bucket",
  VITE_LIB_ENV_NAME: "test-env",
  PASSTHROUGH_LAMBDA_CREDENTIAL: "test-secret-key",
};
