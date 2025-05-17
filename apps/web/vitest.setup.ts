import { expect, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom";

// Extend Vitest's expect with testing-library matchers
expect.extend(matchers);
