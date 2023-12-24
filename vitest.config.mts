// vitest.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['./src/**/*.test-d.ts'],
      provider: 'v8',
      reporter: ['lcovonly', 'html', 'cobertura', 'text', 'json', 'json-summary'],
      reportOnFailure: true,
      thresholds: {
        branches: 95,
        functions: 95,
        lines: 95,
        statements: 95,
      },
    },
  },
})
