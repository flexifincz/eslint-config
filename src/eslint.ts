/* eslint-disable unicorn/prefer-string-raw */

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import eslintPluginCasePolice from 'eslint-plugin-case-police';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import type { RuleOptions } from './types.gen';
import type { Linter } from 'eslint';

export type MainConfig = {
  ignores?: string[];
  reactSupport?: boolean;
  nestSupport?: boolean;
  rules?: RuleOptions;
};

export type TypedFlatConfig = {
  rules?: RuleOptions;
} & Omit<Linter.FlatConfig, 'rules'>;

const IGNORED_DIRECTORIES = [
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
];

const ALLOWED_ABBREVIATIONS = [
  'app',
  'dev',
  'env',
  'fn',
  'params',
  'prod',
  'props',
  'ref',
  'refNo',
  'e2e',
] as const;

export default function flexifinPreset(
  config: MainConfig = {},
  ...userConfigs: TypedFlatConfig[]
): Linter.Config[] {
  const rules: RuleOptions = {
    // ### NATIVE RULES
    // @ts-expect-error This is OK
    curly: ['error', 'all'],
    'no-unused-vars': 'off', // more info https://typescript-eslint.io/rules/no-unused-vars/#how-to-use
    'no-nested-ternary': 'error',
    'no-duplicate-imports': [
      'error',
      {
        includeExports: true,
        allowSeparateTypeImports: true,
      },
    ],

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
        replacements: Object.fromEntries(ALLOWED_ABBREVIATIONS.map((abbr) => [abbr, false])),
        ignore: ['iSpis', 'utils', 'e2e'],
      },
    ],
    'unicorn/better-regex': 'warn',

    // ### TYPESCRIPT RULES
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: true,
      },
    ],
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // ### SIMPLE IMPORT SORT RULES
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^node:(?!.*\\u0000$)'],
          ['^@?\\w(?!.*\\u0000$)'],
          ['^(?!.*\\u0000$)'],
          ['^\\.(?!.*\\u0000$)'],
          ['\\u0000$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',

    // ### STYLISTIC RULES
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
    ],

    // ### USER RULES
    ...config.rules,
  };

  // noinspection UnnecessaryLocalVariableJS
  const resultConfig: Linter.FlatConfig[] = [
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
    // https://eslint.style
    {
      plugins: {
        '@stylistic': stylistic,
      },
    },
    // https://github.com/prettier/eslint-plugin-prettier
    eslintPluginPrettierRecommended,
    // https://github.com/antfu/case-police
    ...eslintPluginCasePolice.configs.recommended,

    // Preset overrides
    { rules: rules as Linter.RulesRecord },
    {
      languageOptions: {
        parserOptions: {
          warnOnUnsupportedTypeScriptVersion: false,
          ...(config.nestSupport && {
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
          }),
        },
        globals: Object.fromEntries(
          Object.keys(globals).flatMap((group) =>
            Object.keys(globals[group as keyof typeof globals]).map((key) => [key, true])
          )
        ),
      },
    },
    {
      ignores: [...IGNORED_DIRECTORIES, ...(config.ignores || [])],
    },

    // File specific rules
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/triple-slash-reference': 'off',
        'unicorn/require-module-specifiers': 'off',
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
