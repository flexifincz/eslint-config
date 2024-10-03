import eslint from '@eslint/js';
import type { Linter } from 'eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import type { RuleOptions } from './eslint.gen';

export type MainConfig = {
  rules?: RuleOptions;
  ignores?: string[];
};

export type TypedFlatConfig = {
  rules?: RuleOptions;
} & Omit<Linter.FlatConfig, 'rules'>;

export default function flexiFinPreset(
  config: MainConfig = {},
  ...userConfigs: TypedFlatConfig[]
): Linter.FlatConfig[] {
  const rules: RuleOptions = {
    // ### NATIVE RULES
    // @ts-expect-error This is OK
    curly: ['error', 'all'],
    'newline-before-return': 'error',
    'no-unused-vars': 'off', // more info https://typescript-eslint.io/rules/no-unused-vars/#how-to-use

    // ### UNICORN RULES
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
    'unicorn/no-keyword-prefix': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-type-error': 'off',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        ignore: ['env'],
      },
    ],

    // ### TYPESCRIPT RULES
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],

    // ### SIMPLE IMPORT SORT RULES
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // ### USER RULES
    ...config.rules,
  };

  // noinspection UnnecessaryLocalVariableJS
  const resultConfig = [
    // https://eslint.org/docs/latest/rules/
    eslint.configs.recommended,
    // https://typescript-eslint.io/
    ...(tseslint.configs.recommended as Linter.FlatConfig[]),
    // https://github.com/sindresorhus/eslint-plugin-unicorn
    eslintPluginUnicorn.configs['flat/recommended'] as Linter.FlatConfig,
    // https://github.com/lydell/eslint-plugin-simple-import-sort
    {
      plugins: {
        'simple-import-sort': eslintPluginSimpleImportSort,
      },
    },
    // https://github.com/prettier/eslint-plugin-prettier
    eslintPluginPrettierRecommended as Linter.FlatConfig,

    // Preset overrides
    { rules: rules as Linter.RulesRecord },
    {
      languageOptions: {
        globals: Object.fromEntries(
          Object.keys(globals).flatMap((group) =>
            Object.keys(globals[group as keyof typeof globals]).map((k) => [k, true])
          )
        ),
      },
    },
    { ignores: ['dist', 'coverage', '.nyc_output', '.idea', '.next', ...(config.ignores || [])] },

    // User overrides
    ...(userConfigs as Linter.FlatConfig[]),
  ].filter(Boolean) as Linter.FlatConfig[];

  return resultConfig;
}
