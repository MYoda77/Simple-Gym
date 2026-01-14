/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  // Module name mapper for imports
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.js",
  },

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Transform files
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/**/*.stories.tsx",
    "!src/**/__tests__/**",
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Module directories
  moduleDirectories: ["node_modules", "src"],

  // Ignore patterns
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/build/",
    "/__tests__/test-utils.tsx",
    "/__tests__/fixtures.ts",
    "/__tests__/jest-dom.d.ts",
  ],

  // Transform ignore patterns
  transformIgnorePatterns: ["node_modules/(?!(.*\\.mjs$))"],
};
