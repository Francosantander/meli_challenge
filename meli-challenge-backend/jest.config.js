export default {
    testEnvironment: 'node',
    transform: {},
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    testMatch: [
        "**/src/__tests__/**/*.test.js"
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/src/__tests__/'
    ],
    coverageThreshold: {
        global: {
            branches: 40,
            functions: 40,
            lines: 40,
            statements: 40
        }
    },
    testPathIgnorePatterns: [
        '/node_modules/'
    ],
    verbose: true,
    detectOpenHandles: true,
    testTimeout: 10000,
    globals: {
        __DEV__: true
    }
};