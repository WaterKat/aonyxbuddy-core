/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.[jt]sx?$": ["ts-jest", {
      useESM: true,
    }],
  },
  resolver: "ts-jest-resolver",
};