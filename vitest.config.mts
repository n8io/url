// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['lcovonly', 'html', 'cobertura', 'text'],
      reportOnFailure: true,
    },
  },
})
