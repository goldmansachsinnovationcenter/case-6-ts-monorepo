// eslint.config.js
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import globals from "globals";

// Calculate __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create compat object for legacy config
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// Common config for all files
const commonConfig = [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
  // Import legacy configs
  ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended", "turbo", "prettier"),
];

// TypeScript specific config
const typescriptConfig = [
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": compat.plugins["@typescript-eslint"],
    },
    languageOptions: {
      parser: compat.plugins["@typescript-eslint"].parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];

// React specific config
const reactConfig = [
  ...compat.extends("plugin:react/recommended", "plugin:react-hooks/recommended"),
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: compat.plugins.react,
      "react-hooks": compat.plugins["react-hooks"],
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
];

// Strict ruleset for non-test files
const strictConfig = [
  {
    files: ["**/*.{js,jsx,ts,tsx}", "!**/*.spec.*", "!**/*.test.*"],
    ...compat.extends("plugin:@typescript-eslint/strict"),
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

// Recommended ruleset for test files
const testConfig = [
  {
    files: ["**/*.spec.*", "**/*.test.*"],
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-console": "off",
    },
  },
];

export default [...commonConfig, ...typescriptConfig, ...reactConfig, ...strictConfig, ...testConfig];

// Export a simplified config for libraries that don't use React
export const library = [...commonConfig, ...typescriptConfig, ...strictConfig, ...testConfig];

// Export a React-specific config
export const react = [...commonConfig, ...typescriptConfig, ...reactConfig, ...strictConfig, ...testConfig];
