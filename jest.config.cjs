const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "jsdom", // necesario para React
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // añade jest-dom y fetch polyfill
  transform: {
    ...tsJestTransformCfg,
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
