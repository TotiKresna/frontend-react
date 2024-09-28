import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    defaultCommandTimeout: 15000,
    responseTimeout: 30000,
    requestTimeout: 15000,
  },
})