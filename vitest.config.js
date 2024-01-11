import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
      reporters: ['default','junit'],
      outputFile: 'junit.xml',
      watch: false,
      testTimeout: 30000,
    },
  })
  