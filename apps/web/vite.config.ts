import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { isPassthroughVar, PASSTHROUGH_PREFIX } from '@repo/env-config';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const envReplacement = Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => !isPassthroughVar(key))
      .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
  );

  const passthroughVars = Object.keys(env)
    .filter(isPassthroughVar)
    .map(key => key.replace(PASSTHROUGH_PREFIX, ''));

  return {
    plugins: [react()],
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
