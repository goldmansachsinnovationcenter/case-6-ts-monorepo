import "@testing-library/jest-dom";

declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toHaveTextContent(text: string): void;
    }
  }
}

// This empty export is needed to make TypeScript treat this as a module
export {};
