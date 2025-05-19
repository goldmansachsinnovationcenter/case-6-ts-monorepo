import { describe, it, expect, beforeAll } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Calculate __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("typescript-config", () => {
  // Fix file paths to point to the root directory instead of src
  const baseConfigPath = path.join(__dirname, "..", "base.json");
  const reactLibraryConfigPath = path.join(__dirname, "..", "react-library.json");

  let baseConfig;
  let reactLibraryConfig;

  beforeAll(() => {
    baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, "utf8"));
    reactLibraryConfig = JSON.parse(fs.readFileSync(reactLibraryConfigPath, "utf8"));
  });

  it("should have a valid base config", () => {
    expect(baseConfig).toBeDefined();
    expect(baseConfig.$schema).toBe("https://json.schemastore.org/tsconfig");
    expect(baseConfig.display).toBe("Default");
    expect(baseConfig.compilerOptions).toBeDefined();
  });

  it("should have required compiler options in base config", () => {
    const { compilerOptions } = baseConfig;
    expect(compilerOptions.strict).toBe(true);
    expect(compilerOptions.declaration).toBe(true);
    expect(compilerOptions.esModuleInterop).toBe(true);
  });

  it("should have a valid react-library config", () => {
    expect(reactLibraryConfig).toBeDefined();
    expect(reactLibraryConfig.$schema).toBe("https://json.schemastore.org/tsconfig");
    expect(reactLibraryConfig.display).toBe("React Library");
    expect(reactLibraryConfig.extends).toBe("./base.json");
    expect(reactLibraryConfig.compilerOptions).toBeDefined();
  });

  it("should have React-specific compiler options", () => {
    const { compilerOptions } = reactLibraryConfig;
    expect(compilerOptions.jsx).toBe("react-jsx");
    expect(compilerOptions.lib).toContain("DOM");
    expect(compilerOptions.module).toBe("ESNext");
  });
});
