module.exports = {
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  testMatch: [
    '**/tests/**/*.spec.js', // You can customize this pattern
    '**/__tests__/**/*.{js,jsx,ts,tsx}'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // To use jest-dom matchers
  testEnvironment: 'jsdom', // Simulates a browser-like environment for Jest
};
