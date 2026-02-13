import type { Linter } from 'eslint';

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import eslintPluginCasePolice from 'eslint-plugin-case-police';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import type { RuleOptions } from './types.gen';

export type MainConfig = {
  experimental?: {
    enablePerfectionistPlugin?: boolean;
  };
  ignores?: string[];
  nestSupport?: boolean;
  reactSupport?: boolean;
  rules?: RuleOptions;
  tsconfigRootDir?: string;
};

export type TypedFlatConfig = Omit<Linter.Config, 'rules'> & {
  rules?: RuleOptions;
};

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
  const enablePerfectionist = config.experimental?.enablePerfectionistPlugin ?? false;

  const rules: RuleOptions = {
    // ### STYLISTIC RULES
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', next: 'return', prev: '*' },
    ],

    // ### TYPESCRIPT RULES
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
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

    // ### NATIVE RULES
    // @ts-expect-error This is OK
    curly: ['error', 'all'],
    'no-duplicate-imports': [
      'error',
      {
        allowSeparateTypeImports: true,
        includeExports: true,
      },
    ],
    'no-nested-ternary': 'error',
    'no-unused-vars': 'off', // more info https://typescript-eslint.io/rules/no-unused-vars/#how-to-use

    // ### UNICORN RULES
    'unicorn/better-regex': 'warn',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          kebabCase: true,
          pascalCase: true,
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
        ignore: ['iSpis', 'utils', 'e2e'],
        replacements: Object.fromEntries(ALLOWED_ABBREVIATIONS.map((abbr) => [abbr, false])),
      },
    ],

    // ### USER RULES
    ...config.rules,
  };

  const resultConfig: Linter.Config[] = [
    // https://eslint.org/docs/latest/rules/
    eslint.configs.recommended,
    // https://typescript-eslint.io/
    ...tsEslint.configs.recommended,
    // https://github.com/sindresorhus/eslint-plugin-unicorn
    eslintPluginUnicorn.configs.recommended,

    // https://perfectionist.dev/
    ...(enablePerfectionist
      ? [
          eslintPluginPerfectionist.configs['recommended-natural'],
          {
            rules: {
              'perfectionist/sort-arrays': 'off',
            },
          },
        ]
      : []),

    {
      plugins: {
        // https://eslint.style
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
        globals: {
          ...globals.node,
          ...globals.es2025,
          ...(config.reactSupport ? globals.browser : {}),
        },
        parserOptions: {
          projectService: {
            allowDefaultProject: ['*.js', '*.mjs', '*.cjs', '*.config.js', '*.config.mjs'],
            defaultProject: 'tsconfig.json',
          },
          tsconfigRootDir: config.tsconfigRootDir,
          warnOnUnsupportedTypeScriptVersion: false,
          ...(config.nestSupport && {
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
          }),
        },
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
              react: { version: 'detect' },
            },
          },
          {
            files: ['**/*.tsx'],
            ...eslintPluginReact.configs.flat.recommended,
          },
          {
            files: ['**/*.tsx', '**/*.ts'],
            ...eslintPluginReactHooks.configs.flat.recommended,
          },
          {
            files: ['**/*.tsx'],
            rules: {
              'react/boolean-prop-naming': 2,
              'react/function-component-definition': [
                2,
                {
                  namedComponents: ['arrow-function', 'function-declaration'],
                },
              ],
              'react/jsx-max-depth': [2, { max: 10 }],
              'react/no-children-prop': [
                2,
                {
                  allowFunctions: true,
                },
              ],
              'react/prop-types': 'off',
              'react/react-in-jsx-scope': 'off',
            },
          },
          {
            files: ['**/*.stories.tsx', '**/*.stories.ts'],
            rules: {
              'react-hooks/rules-of-hooks': 'off',
            },
          },
        ]
      : []) as Linter.Config[]),

    // User overrides
    ...(userConfigs as Linter.Config[]),
  ].filter(Boolean) as Linter.Config[];

  return resultConfig;
}
