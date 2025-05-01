import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { 
  isPassthroughVar, 
  PASSTHROUGH_PREFIX, 
  createEnvReplacements 
} from '@repo/env-config';

/**
 * Vite configuration for web application
 * 
 * This configuration:
 * 1. Loads environment variables based on the current mode
 * 2. Replaces process.env references with actual values at build time
 * 3. Preserves variables with PASSTHROUGH_ prefix for runtime loading
 */
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  const envReplacement = createEnvReplacements(env);

  const passthroughVars = Object.keys(env)
    .filter(isPassthroughVar)
    .map(key => key.replace(PASSTHROUGH_PREFIX, ''));

  return {
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
        include: ['src/**/*.ts', 'src/**/*.tsx'],
      }),
    ],
    define: {
      ...envReplacement,
      '__PASSTHROUGH_VARS__': JSON.stringify(passthroughVars),
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            ui: ['@repo/ui'],
          },
        },
      },
    },
  };
});
