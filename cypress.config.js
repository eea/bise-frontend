const { defineConfig } = require('cypress');
module.exports = defineConfig({
  viewportWidth: 1280,
  defaultCommandTimeout: 15000,
  chromeWebSecurity: false,

  reporter: 'junit',
  video: true,
  reporterOptions: {
    mochaFile: 'cypress/reports/cypress-[hash].xml',
    jenkinsMode: true,
    toConsole: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // e2e testing node events setup code

      return config;
    },
    baseUrl: 'http://localhost:3000',
  },
});
