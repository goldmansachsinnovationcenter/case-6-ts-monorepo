/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add any custom environment variables used in your project
  readonly VITE_EO_CLOUD_API_DOMAIN?: string;
  readonly VITE_BIO_S3_BUCKET_NAME?: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
