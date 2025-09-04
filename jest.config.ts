import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", {
      tsconfig: "<rootDir>/tsconfig.jest.json"
    }]
  },
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    "^@database$": "<rootDir>/src/database.ts",
    "^@database.test$": "<rootDir>/src/database.test.ts", 
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@app$": "<rootDir>/src/app.ts"
  },
  testTimeout: 30000,
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true
};

export default config;