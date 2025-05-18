import React from "react";
import { Button, getApiUrl } from "@repo/ui";
import { ENV_VARS, PASSTHROUGH_PREFIX } from "@repo/env-config";

// Create an interface for environment variables to make testing easier
export interface AppEnvironment {
  apiDomain: string;
  s3BucketName: string;
  nodeEnv: string;
  apiUrl: string;
}

// Create a module for testing purposes
export const AppModule = {
  // Default function to get environment variables from import.meta.env
  getAppEnvironment: (): AppEnvironment => {
    return {
      apiDomain: import.meta.env.VITE_EO_CLOUD_API_DOMAIN || "Not defined",
      s3BucketName: import.meta.env.VITE_BIO_S3_BUCKET_NAME || "Not defined",
      nodeEnv: import.meta.env.MODE || "Not defined",
      apiUrl: getApiUrl(),
    };
  },
};

const getPassthroughEnv = (key: string): string | undefined => {
  return `[RUNTIME VALUE FOR ${key}]`;
};

// Make the App component accept environment as a prop for testing
interface AppProps {
  environment?: AppEnvironment;
}

function App({ environment }: AppProps) {
  // Use provided environment (for tests) or get it from import.meta.env
  const env = environment || AppModule.getAppEnvironment();
  const passthroughExample = getPassthroughEnv("SOME_CREDENTIAL");

  return (
    <div>
      <h1>Turborepo Environment Variables Example</h1>

      <h2>Application Environment</h2>
      <p>The following variables are replaced at build time in the application:</p>
      <ul>
        <li>
          <strong>API Domain:</strong> {env.apiDomain}
        </li>
        <li>
          <strong>S3 Bucket:</strong> {env.s3BucketName}
        </li>
        <li>
          <strong>Node Environment:</strong> {env.nodeEnv}
        </li>
      </ul>

      <h2>Library Environment Integration</h2>
      <p>
        The UI library references <code>process.env.EO_CLOUD_API_DOMAIN</code> which is preserved in the
        library build but replaced when the app is built:
      </p>
      <ul>
        <li>
          <strong>API URL from library:</strong> {env.apiUrl}
        </li>
      </ul>

      <h2>Passthrough Variables</h2>
      <p>
        Variables with the <code>{PASSTHROUGH_PREFIX}</code> prefix are not replaced at build time and are
        loaded from the runtime environment:
      </p>
      <ul>
        <li>
          <strong>Runtime credential:</strong> {passthroughExample}
        </li>
      </ul>

      <Button>Click me</Button>
    </div>
  );
}

export default App;
