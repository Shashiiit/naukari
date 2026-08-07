const { defineConfig } = require("cypress");

module.exports = defineConfig({
  watchForFileChanges: false,
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 10000,
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      // Pass environment variables to Cypress (used by GitHub Actions)
      config.env.NAUKRI_USERNAME = process.env.NAUKRI_USERNAME || '';
      config.env.NAUKRI_PASSWORD = process.env.NAUKRI_PASSWORD || '';
      return config;
    },
  },
});
