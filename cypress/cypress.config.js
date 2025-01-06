const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrlhttps: "https://stg-safe.bako.global/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
