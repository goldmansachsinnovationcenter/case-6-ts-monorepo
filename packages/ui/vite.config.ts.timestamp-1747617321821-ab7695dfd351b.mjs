// vite.config.ts
import { defineConfig } from "file:///Users/joelgs/Documents/code/case-6-ts-monorepo/node_modules/.pnpm/vite@5.4.19_@types+node@20.17.32/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import react from "file:///Users/joelgs/Documents/code/case-6-ts-monorepo/node_modules/.pnpm/@vitejs+plugin-react@4.4.1_vite@5.4.19_@types+node@20.17.32_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///Users/joelgs/Documents/code/case-6-ts-monorepo/node_modules/.pnpm/vite-plugin-dts@4.5.3_@types+node@20.17.32_rollup@4.40.1_typescript@5.8.3_vite@5.4.19_@types+node@20.17.32_/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/joelgs/Documents/code/case-6-ts-monorepo/packages/ui";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.ts", "src/**/*.tsx"]
    })
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "UI",
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["react", "react-dom", "@repo/env-config"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        },
        preserveModules: false
      }
    },
    minify: true,
    target: "esnext",
    sourcemap: true
  },
  // Make sure environmental definitions are properly handled
  define: {
    "process.env": process.env
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvam9lbGdzL0RvY3VtZW50cy9jb2RlL2Nhc2UtNi10cy1tb25vcmVwby9wYWNrYWdlcy91aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2pvZWxncy9Eb2N1bWVudHMvY29kZS9jYXNlLTYtdHMtbW9ub3JlcG8vcGFja2FnZXMvdWkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2pvZWxncy9Eb2N1bWVudHMvY29kZS9jYXNlLTYtdHMtbW9ub3JlcG8vcGFja2FnZXMvdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgZHRzKHtcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXG4gICAgICBpbmNsdWRlOiBbXCJzcmMvKiovKi50c1wiLCBcInNyYy8qKi8qLnRzeFwiXSxcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXG4gICAgICBuYW1lOiBcIlVJXCIsXG4gICAgICBmaWxlTmFtZTogXCJpbmRleFwiLFxuICAgICAgZm9ybWF0czogW1wiZXNcIl0sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIiwgXCJAcmVwby9lbnYtY29uZmlnXCJdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICByZWFjdDogXCJSZWFjdFwiLFxuICAgICAgICAgIFwicmVhY3QtZG9tXCI6IFwiUmVhY3RET01cIixcbiAgICAgICAgfSxcbiAgICAgICAgcHJlc2VydmVNb2R1bGVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBtaW5pZnk6IHRydWUsXG4gICAgdGFyZ2V0OiBcImVzbmV4dFwiLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgfSxcbiAgLy8gTWFrZSBzdXJlIGVudmlyb25tZW50YWwgZGVmaW5pdGlvbnMgYXJlIHByb3Blcmx5IGhhbmRsZWRcbiAgZGVmaW5lOiB7XG4gICAgXCJwcm9jZXNzLmVudlwiOiBwcm9jZXNzLmVudixcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVyxTQUFTLG9CQUFvQjtBQUNoWSxTQUFTLGVBQWU7QUFDeEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUhoQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixrQkFBa0I7QUFBQSxNQUNsQixTQUFTLENBQUMsZUFBZSxjQUFjO0FBQUEsSUFDekMsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDeEMsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNoQjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxNQUNuRCxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxhQUFhO0FBQUEsUUFDZjtBQUFBLFFBQ0EsaUJBQWlCO0FBQUEsTUFDbkI7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsRUFDYjtBQUFBO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixlQUFlLFFBQVE7QUFBQSxFQUN6QjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
