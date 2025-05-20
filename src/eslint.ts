import eslint from '@eslint/js';
import type { Linter } from 'eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import type { RuleOptions } from './eslint.gen';

export type MainConfig = {
  ignores?: string[];
  reactSupport?: boolean;
  rules?: RuleOptions;
};

export type TypedFlatConfig = {
  rules?: RuleOptions;
} & Omit<Linter.Config, 'rules'>;

export default function flexifinPreset(
  config: MainConfig = {},
  ...userConfigs: TypedFlatConfig[]
): Linter.Config[] {
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
          kebabCase: true,
        },
        // Flexifin specific shortcuts
        ignore: ['MTP', 'IL', 'SME', 'GTM', 'SMS'],
      },
    ],
    'unicorn/no-keyword-prefix': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-ternary': ['error', 'only-single-line'],
    'unicorn/prefer-type-error': 'off',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        replacements: {
          app: false,
          dev: false,
          env: false,
          fn: false,
          params: false,
          prod: false,
          props: false,
          ref: false,
          refNo: false,
        },
        ignore: ['iSpis'],
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
    ...(tsEslint.configs.recommended as Linter.Config[]),
    // https://github.com/sindresorhus/eslint-plugin-unicorn
    eslintPluginUnicorn.configs['flat/recommended'] as Linter.Config,
    // https://github.com/lydell/eslint-plugin-simple-import-sort
    {
      plugins: {
        'simple-import-sort': eslintPluginSimpleImportSort,
      },
    },
    // https://github.com/prettier/eslint-plugin-prettier
    eslintPluginPrettierRecommended as Linter.Config,

    // Preset overrides
    { rules: rules as Linter.RulesRecord },
    {
      languageOptions: {
        parserOptions: {
          warnOnUnsupportedTypeScriptVersion: false,
        },
        globals: Object.fromEntries(
          Object.keys(globals).flatMap((group) =>
            Object.keys(globals[group as keyof typeof globals]).map((key) => [key, true])
          )
        ),
      },
    },
    {
      ignores: [
        '.features-gen',
        '.idea',
        '.next',
        '.nyc_output',
        '.v8-coverage',
        'coverage',
        'coverage-reports',
        'dist',
        'monocart-report',
        'playwright-report',
        'test-results',
        ...(config.ignores || []),
      ],
    },

    // File specific rules
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
      } as RuleOptions,
    },

    // React specific rules
    ...((config.reactSupport
      ? [
          {
            settings: {
              react: {
                version: 'detect',
              },
            },
          },
          {
            files: ['**/*.tsx'],
            ...eslintPluginReact.configs.flat.recommended,
            rules: {
              'react/boolean-prop-naming': 2,
              'react/jsx-sort-props': 2,
              'react/jsx-max-depth': [2, { max: 10 }],
              'react/no-children-prop': [
                2,
                {
                  allowFunctions: true,
                },
              ],
              'react/function-component-definition': [
                2,
                {
                  namedComponents: ['arrow-function', 'function-declaration'],
                },
              ],
            },
          },
        ]
      : []) as Linter.Config[]),

    // User overrides
    ...(userConfigs as Linter.Config[]),
  ].filter(Boolean) as Linter.Config[];

  return resultConfig;
}
