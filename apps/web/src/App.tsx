import React from 'react';
import { Button, getApiUrl } from '@repo/ui';
import * as EnvConfig from '@repo/env-config';

const getPassthroughEnv = (key: string): string | undefined => {
  return `[RUNTIME VALUE FOR ${key}]`;
};

function App() {
  const apiDomain = import.meta.env.VITE_EO_CLOUD_API_DOMAIN || 'Not defined';
  const s3BucketName = import.meta.env.VITE_BIO_S3_BUCKET_NAME || 'Not defined';
  const nodeEnv = import.meta.env.MODE;

  const apiUrl = getApiUrl();

  const passthroughExample = getPassthroughEnv('SOME_CREDENTIAL');

  return (
    <div>
      <h1>Turborepo Environment Variables Example</h1>
      
      <h2>Application Environment</h2>
      <p>The following variables are replaced at build time in the application:</p>
      <ul>
        <li>
          <strong>API Domain:</strong> {apiDomain}
        </li>
        <li>
          <strong>S3 Bucket:</strong> {s3BucketName}
        </li>
        <li>
          <strong>Node Environment:</strong> {nodeEnv}
        </li>
      </ul>

      <h2>Library Environment Integration</h2>
      <p>
        The UI library references <code>process.env.EO_CLOUD_API_DOMAIN</code> which is preserved
        in the library build but replaced when the app is built:
      </p>
      <ul>
        <li>
          <strong>API URL from library:</strong> {apiUrl}
        </li>
      </ul>

      <h2>Passthrough Variables</h2>
      <p>
        Variables with the <code>{EnvConfig.PASSTHROUGH_PREFIX}</code> prefix are not replaced at build time
        and are loaded from the runtime environment:
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
