const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions: ts } = require('./tsconfig.json');

module.exports = {
  coveragePathIgnorePatterns: ['<rootDir>/src/tests/helpers'],
  globals: { 'ts-jest': { useESM: true } },
  moduleNameMapper: pathsToModuleNameMapper(ts.paths, { prefix: '<rootDir>/' }),
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/tests/**/*.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/tests/helpers'],
  verbose: true
};
