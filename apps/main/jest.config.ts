import { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

export const config: Config = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverageFrom: ["**/*.(t|j)s", "!**/*.module.(t|j)s", "!**/(main|preload|context).(t|j)s"],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    roots: ["<rootDir>"],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
    coveragePathIgnorePatterns: ["<rootDir>/nest", "<rootDir>/electron"],
};

export default config;
