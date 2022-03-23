module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  globalSetup: '<rootDir>/src/jest/globalSetup.ts',
  globalTeardown: '<rootDir>/src/jest/globalTeardown.ts',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['@effect-ts/jest/Extend'],
};
