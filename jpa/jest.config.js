module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
         "^kuromojiDictionaries/(.*)$": "<rootDir>/public/kuromojiDictionaries/$1",
        "^@/(.*)$": "<rootDir>/src/$1",
    },
};