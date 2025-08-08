import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:9002", // Assuming the app runs on this port from package.json
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Set a higher default command timeout to handle async operations like AI generation
    defaultCommandTimeout: 10000,
  },
  // Set a longer timeout for page loads
  pageLoadTimeout: 60000,
  // RNF2: Set a longer response timeout for network requests, especially for design generation
  responseTimeout: 60000,
  // RNF4: Enable video recording to review test runs
  video: true,
  // Configure for different viewports to test responsiveness
  viewportWidth: 1280,
  viewportHeight: 720,
  // To simulate cross-browser testing, you would configure different browsers here.
  // For Firebase Test Lab, you would integrate via CI/CD pipeline configuration.
});
