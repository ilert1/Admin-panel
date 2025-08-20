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
        collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/index.ts", "!src/**/types.ts"],
        coverageThreshold: {
            global: { branches: 80, functions: 80, lines: 80, statements: 80 }
        },
        moduleNameMapper: {
            "^.+\\.svg\\?react$": "<rootDir>/src/__mocks__/svgReactMock.tsx",
            "^.+\\.svg$": "<rootDir>/src/__mocks__/svgMock.ts",
            "^.+\\.(css|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.ts",
            "^@/(.*)$": "<rootDir>/src/$1"
        }
    };
};
