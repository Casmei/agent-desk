import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export const base = [
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      'no-console': 'error',
    },
  },
  prettier,
];
