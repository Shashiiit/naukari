const { defineConfig } = require("cypress");

module.exports = defineConfig({
  watchForFileChanges: false,
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 6000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
