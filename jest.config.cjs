module.exports = {
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    transform: {
        "^.+\\.[tj]sx?$": "babel-jest",
    },

    moduleNameMapper: {
        "\\.(css|less|scss)$": "identity-obj-proxy",
    },

    setupFiles: ["<rootDir>/jest.setup.js"],
};