# Turborepo Vite Environment Variables Strategy

This is a monorepo environment variables strategy example using [Turborepo](https://turbo.build/repo) with [Vite](https://vitejs.dev/).

## What's inside?

This repository includes the following packages/apps:

### Apps and Packages

- `web`: a [Vite](https://vitejs.dev/) React application
- `@repo/ui`: a stub React component library shared by the `web` application
- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: TypeScript configurations
- `@repo/env-config`: Environment configuration shared across the monorepo

Each package/app is built with [TypeScript](https://www.typescriptlang.org/).

### Environment Variable Strategy

This monorepo implements a robust environment variable handling strategy:

- Environment variables are shared across the entire monorepo
- Libraries can reference environment variables (e.g., `process.env.BIO_API_URL`)
- When libraries are built, environment variable references are NOT replaced
- When applications are built, environment variables are replaced by default
- Variables with the prefix `PASSTHROUGH_` are NOT replaced at build time
- Environment switching is supported via different .env files

### Shared Environment Variables

- `EO_CLOUD_API_DOMAIN`: Domain for the cloud API
- `BIO_S3_BUCKET_NAME`: S3 bucket name for Bio service
- `NODE_ENV`: Environment mode (development, production, etc.)

### Utilities

This repo uses [PNPM](https://pnpm.io) as a package manager. It includes the following scripts:

- `build`: Builds all applications and packages
- `dev`: Develops all applications and packages
- `lint`: Lints all applications and packages
- `format`: Formats the code

### Build

To build all apps and packages, run the following command:

```bash
pnpm build
```
