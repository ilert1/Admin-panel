/** @jest-config-loader ts-node */
import type { Config } from "jest";

export default async (): Promise<Config> => {
    return {
        preset: "ts-jest",
        testEnvironment: "jsdom",
        roots: ["<rootDir>/src"],
        transform: {
            "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json", babelConfig: true }],
            "^.+\\.(js|jsx)$": "babel-jest"
        },
        setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
        testMatch: [
            "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
            "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
        ],
        moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
        collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/index.ts", "!src/**/types.ts"],
        coverageThreshold: {
            global: { branches: 80, functions: 80, lines: 80, statements: 80 }
        },
        moduleNameMapper: {
            "^@/(.*)$": "<rootDir>/source/$1",
            "\\.(css|scss|sass)$": "<rootDir>/source/__mocks__/styleMock.ts",
            "^(.*)\\.svg\\?react$": "<rootDir>/source/__mocks__/svgReactMock.ts",
            "\\.svg$": "<rootDir>/source/__mocks__/svgMock.ts"
        }
    };
};
