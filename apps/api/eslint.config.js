import { base } from '@agent-desk/eslint-config';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/'] },
  ...base,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-extraneous-class': [
        'error',
        { allowWithDecorator: true },
      ],
      '@typescript-eslint/no-unsafe-class-instance-assignment': 'off',
    },
  },
  { files: ['**/*.js'], ...tseslint.configs.disableTypeChecked },
];
