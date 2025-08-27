// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./Backend/tests/setup'],
  testTimeout: 10000,
};