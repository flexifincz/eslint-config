import type { Rules } from './types';

const rules: Rules = {
  // Native rules
  curly: ['error', 'all'],
  'newline-before-return': 'error',
  'no-unused-vars': 'off', // more info https://typescript-eslint.io/rules/no-unused-vars/#how-to-use
  // ...

  // Unicorn rules
  'unicorn/no-keyword-prefix': 'off',
  'unicorn/no-null': 'off',
  'unicorn/prefer-type-error': 'off',
  'unicorn/filename-case': [
    'error',
    {
      cases: {
        camelCase: true,
        pascalCase: true,
      },
    },
  ],
  'unicorn/prevent-abbreviations': [
    'error',
    {
      ignore: ['env'],
    },
  ],
  // ...

  // TypeScript rules
  '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  // ...
};

export default {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:unicorn/all',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules,
};
