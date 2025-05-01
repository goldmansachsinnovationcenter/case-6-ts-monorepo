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

### Environment Variable Usage Guide

This section provides detailed instructions on how to use environment variables in different scenarios within the monorepo.

#### Case 1: Environment Variables in Apps (Replaced at Build Time)

These are standard environment variables that should be replaced with their actual values during the application build process.

**Configuration:**
1. Add the variable to your `.env`, `.env.development`, or `.env.production` file at the root:
   ```
   EO_CLOUD_API_DOMAIN=api.example.com
   ```

2. Reference the variable in your application code:
   ```tsx
   // apps/web/src/components/ApiClient.tsx
   export const getApiEndpoint = () => {
     // In Vite apps, use import.meta.env with VITE_ prefix
     return import.meta.env.VITE_EO_CLOUD_API_DOMAIN || 'default-api.example.com';
   };
   ```

3. Make sure the variable is included in the Vite configuration:
   ```ts
   // apps/web/vite.config.ts
   export default defineConfig(({ mode }) => {
     const env = loadEnv(mode, process.cwd(), 'VITE_');
     
     return {
       define: {
         ...createEnvReplacements(env),
       },
       // other config...
     };
   });
   ```

#### Case 2: Environment Variables in Apps (NOT Replaced at Build Time)

These variables should be loaded at runtime rather than being replaced during build. This is useful for credentials or configuration that changes between environments without rebuilding.

**Configuration:**
1. Add the variable with the `PASSTHROUGH_` prefix to your `.env` file:
   ```
   PASSTHROUGH_API_KEY=runtime-value-not-in-build
   ```

2. Reference the variable in your application code:
   ```tsx
   // apps/web/src/components/SecureClient.tsx
   import { getPassthroughVar } from '@repo/env-config';
   
   export const getApiKey = () => {
     // Use the helper to get the runtime value
     return getPassthroughVar('API_KEY');
   };
   ```

3. Ensure the passthrough variables are excluded from replacement in Vite config:
   ```ts
   // apps/web/vite.config.ts
   import { isPassthroughVar, createEnvReplacements } from '@repo/env-config';
   
   export default defineConfig(({ mode }) => {
     const env = loadEnv(mode, process.cwd(), 'VITE_');
     
     // createEnvReplacements automatically filters out PASSTHROUGH_ variables
     const envReplacement = createEnvReplacements(env);
     
     return {
       define: {
         ...envReplacement,
       },
       // other config...
     };
   });
   ```

#### Case 3: Environment Variables in Libraries (NOT Replaced in Library Build, but Replaced in App Build)

These variables are preserved in the library build but will be replaced when the application that imports the library is built.

**Configuration:**
1. Add the variable to your `.env` file:
   ```
   EO_CLOUD_API_DOMAIN=api.example.com
   ```

2. Reference the variable in your library code:
   ```ts
   // packages/ui/src/components/ApiComponent.ts
   export const getApiUrl = () => {
     // Use process.env directly - this will NOT be replaced in the library build
     return process.env.EO_CLOUD_API_DOMAIN || 'default-api.example.com';
   };
   ```

3. Configure the library's Vite build to preserve process.env references:
   ```ts
   // packages/ui/vite.config.ts
   export default defineConfig({
     // No define section or empty define section
     define: {},
     // other config...
   });
   ```

4. When the app imports and builds with this library, the environment variable will be replaced:
   ```tsx
   // apps/web/src/App.tsx
   import { getApiUrl } from '@repo/ui';
   
   function App() {
     // This will contain the actual value after the app is built
     const apiUrl = getApiUrl();
     
     return (
       <div>API URL from library: {apiUrl}</div>
     );
   }
   ```

#### Case 4: Environment Variables in Libraries (NOT Replaced in Library or App Build)

These variables should remain as references to `process.env` in both the library build and when used in an application.

**Configuration:**
1. Add the variable with the `PASSTHROUGH_` prefix to your `.env` file:
   ```
   PASSTHROUGH_SECRET_KEY=runtime-secret-value
   ```

2. Reference the variable in your library code:
   ```ts
   // packages/ui/src/components/SecureComponent.ts
   import { getPassthroughVar } from '@repo/env-config';
   
   export const getSecretKey = () => {
     // Use the helper to get the runtime value
     return getPassthroughVar('SECRET_KEY');
   };
   ```

3. Configure the library's Vite build to preserve process.env references:
   ```ts
   // packages/ui/vite.config.ts
   export default defineConfig({
     // No define section or empty define section
     define: {},
     // other config...
   });
   ```

4. Ensure the app's Vite config excludes passthrough variables from replacement:
   ```ts
   // apps/web/vite.config.ts
   import { isPassthroughVar, createEnvReplacements } from '@repo/env-config';
   
   export default defineConfig(({ mode }) => {
     const env = loadEnv(mode, process.cwd(), 'VITE_');
     
     // createEnvReplacements automatically filters out PASSTHROUGH_ variables
     const envReplacement = createEnvReplacements(env);
     
     return {
       define: {
         ...envReplacement,
       },
       // other config...
     };
   });
   ```

5. When the app imports and uses this library function:
   ```tsx
   // apps/web/src/App.tsx
   import { getSecretKey } from '@repo/ui';
   
   function App() {
     // This will be evaluated at runtime, not build time
     const secretKey = getSecretKey();
     
     return (
       <div>Secret Key (masked): {secretKey ? '****' : 'Not set'}</div>
     );
   }
   ```

### Best Practices

1. **Naming Convention**: 
   - Use `PASSTHROUGH_` prefix consistently for runtime variables
   - Use `VITE_` prefix for variables in Vite applications

2. **Type Safety**:
   - Use the `@repo/env-config` package's typed helpers
   - Define constants for environment variable names

3. **Default Values**:
   - Always provide sensible defaults when accessing environment variables
   - Use the helper functions that support default values

4. **Environment Switching**:
   - Use `.env.development` and `.env.production` for environment-specific values
   - Override with `.env.local` for local development (gitignored)

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
