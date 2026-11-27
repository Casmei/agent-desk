import { config } from 'dotenv';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

config({ path: '../../.env', quiet: true });

export default defineConfig({
  plugins: [swc.vite()],
  test: {
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
          exclude: ['**/*.integration.spec.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          // Integration files share one database and clear its tables before each test.
          fileParallelism: false,
          include: [
            'src/**/*.integration.spec.ts',
            'test/**/*.integration.spec.ts',
          ],
        },
      },
    ],
  },
});
