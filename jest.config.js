module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { isolatedModules: true }]
  },
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['./tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90
    }
  }
};