// Mock environment variables for web app tests
process.env = {
  ...process.env,
  NODE_ENV: "test",
  VITE_APP_CLOUD_API_DOMAIN: "test-api.example.com",
  VITE_LAMBDA_S3_BUCKET_NAME: "test-bucket",
  VITE_LIB_ENV_NAME: "test-env",
  PASSTHROUGH_LAMBDA_CREDENTIAL: "test-secret-key",
};

// Setup test environment for any browser API mocks if needed
if (typeof window !== "undefined") {
  // Mock any browser APIs that might be used but aren't available in the test environment
}

// If your app uses fetch, you might want to add a global fetch mock
global.fetch = vi.fn();

// Mock for import.meta.env to improve coverage for browser environment code
if (typeof window !== "undefined") {
  window.import = {
    meta: {
      env: {
        MODE: "test",
        VITE_APP_CLOUD_API_DOMAIN: "test-api.example.com",
        VITE_LAMBDA_S3_BUCKET_NAME: "test-bucket",
        VITE_LIB_ENV_NAME: "test-env",
      },
    },
  };
}
