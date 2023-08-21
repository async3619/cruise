import { Config } from "jest";

const config: Config = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "jest-environment-jsdom",
    testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts", "!src/**/index.{ts,tsx}"],
    coveragePathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {}],
    },
};

export default config;
