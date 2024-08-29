module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        // Maps "@" to the "src" directory
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};