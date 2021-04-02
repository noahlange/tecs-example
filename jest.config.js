const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/tests/**/*.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/tests/helpers'],
  coveragePathIgnorePatterns: ['<rootDir>/src/tests/helpers'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  }),
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};
