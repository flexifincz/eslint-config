import type { Linter } from 'eslint';

import nestjsTyped from '@darraghor/eslint-plugin-nestjs-typed';
import eslintPluginReact from '@eslint-react/eslint-plugin';
import eslint from '@eslint/js';
import eslintPluginNext from '@next/eslint-plugin-next';
import stylistic from '@stylistic/eslint-plugin';
import pluginQuery from '@tanstack/eslint-plugin-query';
import vitest from '@vitest/eslint-plugin';
import prettierConfig from 'eslint-config-prettier/flat';
import eslintPluginCasePolice from 'eslint-plugin-case-police';
import eslintPluginI18next from 'eslint-plugin-i18next';
import importX from 'eslint-plugin-import-x';
import jest from 'eslint-plugin-jest';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import nodePlugin from 'eslint-plugin-n';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import regexpPlugin from 'eslint-plugin-regexp';
import sonarjs from 'eslint-plugin-sonarjs';
import eslintPluginStorybook from 'eslint-plugin-storybook';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import type { RuleOptions } from './types.gen';

export type MainConfig = {
  enablePerfectionist?: boolean;
  /** @deprecated Use `enablePerfectionist` instead. */
  experimental?: {
    enablePerfectionistPlugin?: boolean;
  };
  ignores?: string[];
  muiSupport?: boolean;
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
  'build',
  'coverage',
  'coverage-reports',
  'dist',
  'monocart-report',
  'next-env.d.ts',
  'out',
  'playwright-report',
  'test-results',
];

const ALLOWED_ABBREVIATIONS = [
  'app',
  'args',
  'db',
  'dev',
  'env',
  'fn',
  'i18n',
  'params',
  'prod',
  'props',
  'ref',
  'refNo',
  'e2e',
];

const ALLOW_DEFAULT_PROJECT_FILES = ['*.js', '*.mjs', '*.cjs', '*.config.js', '*.config.mjs'];

const TS_FILES = ['**/*.{ts,tsx,mts,cts}'];
const JS_FILES = ['**/*.{js,mjs,cjs,jsx}'];
const JSX_FILES = ['**/*.{jsx,tsx}'];
const STORY_FILES = ['**/*.stories.{ts,tsx,js,jsx,mdx}'];
const TEST_FILES = ['**/*.{test,spec}.{ts,tsx,js,jsx}'];
const PLAYWRIGHT_TEST_FILES = ['**/e2e/**', '**/*.e2e.{js,jsx,ts,tsx}'];

const STYLISTIC_RULES: RuleOptions = {
  '@stylistic/padding-line-between-statements': [
    'error',
    { blankLine: 'always', next: 'return', prev: '*' },
  ],
};

const TYPESCRIPT_RULES: RuleOptions = {
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
};

const NATIVE_RULES: RuleOptions = {
  // @ts-expect-error curly options are not modeled in the generated RuleOptions
  curly: ['error', 'all'],
  'no-nested-ternary': 'error',
  // Superseded by @typescript-eslint/no-unused-vars — https://typescript-eslint.io/rules/no-unused-vars/
  'no-unused-vars': 'off',
};

const UNICORN_RULES: RuleOptions = {
  'unicorn/better-regex': 'warn',
  'unicorn/filename-case': [
    'error',
    {
      cases: {
        camelCase: true,
        kebabCase: true,
        pascalCase: true,
      },
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
};

const IMPORT_RULES: RuleOptions = {
  'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
  // Resolver-dependent rules duplicate TypeScript's own checks; defer to tsc.
  'import-x/default': 'off',
  'import-x/first': 'error',
  'import-x/named': 'off',
  'import-x/namespace': 'off',
  'import-x/newline-after-import': 'error',
  'import-x/no-duplicates': ['error', { 'prefer-inline': false }],
  'import-x/no-mutable-exports': 'error',
  'import-x/no-named-as-default': 'off',
  'import-x/no-named-as-default-member': 'off',
  'import-x/no-self-import': 'error',
  'import-x/no-unresolved': 'off',
  'import-x/no-useless-path-segments': 'error',
};

const NODE_RULES: RuleOptions = {
  // TypeScript handles module resolution; n's check produces false positives on TS path aliases.
  'n/no-missing-import': 'off',
};

const SONARJS_OVERRIDES: RuleOptions = {
  'sonarjs/todo-tag': 'off',
};

// sonarjs.configs is typed as optional but is always defined at runtime.
const SONARJS_CONFIG = (sonarjs.configs ?? { recommended: {} }).recommended;

// Hooks ownership: react-hooks (official) owns hooks-related rules — @eslint-react v5 still
// ships duplicates we must silence to avoid double-reporting. react-hooks v7 uniquely covers
// `refs` and `preserve-manual-memoization`, which is why we keep it as the source of truth.
const REACT_DUPLICATE_RULES_OFF = {
  '@eslint-react/error-boundaries': 'off',
  '@eslint-react/exhaustive-deps': 'off',
  '@eslint-react/purity': 'off',
  '@eslint-react/rules-of-hooks': 'off',
  '@eslint-react/set-state-in-effect': 'off',
  '@eslint-react/set-state-in-render': 'off',
  '@eslint-react/static-components': 'off',
  '@eslint-react/unsupported-syntax': 'off',
  '@eslint-react/use-memo': 'off',
} as unknown as RuleOptions;

const DECLARATION_FILES_OVERRIDES: Linter.Config = {
  files: ['**/*.d.ts'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    'unicorn/require-module-specifiers': 'off',
  },
};

const LINTER_OPTIONS: Linter.Config = {
  linterOptions: {
    reportUnusedDisableDirectives: 'warn',
  },
};

const PERFECTIONIST_CONFIGS: Linter.Config[] = [
  eslintPluginPerfectionist.configs['recommended-natural'],
  { rules: { 'perfectionist/sort-arrays': 'off' } },
];

const STORYBOOK_CONFIGS: Linter.Config[] = (
  eslintPluginStorybook.configs['flat/recommended'] as Linter.Config[]
).map((c) => ({ ...c, files: STORY_FILES }));

const PLAYWRIGHT_CONFIG: Linter.Config = {
  files: PLAYWRIGHT_TEST_FILES,
  ...eslintPluginPlaywright.configs['flat/recommended'],
};

const VITEST_CONFIG: Linter.Config = {
  files: TEST_FILES,
  ...vitest.configs.recommended,
};

const JEST_CONFIG: Linter.Config = {
  files: TEST_FILES,
  ...jest.configs['flat/recommended'],
};

const NEXT_CONFIG: Linter.Config = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  ...eslintPluginNext.configs['core-web-vitals'],
};

const TANSTACK_QUERY_CONFIGS = pluginQuery.configs[
  'flat/recommended-strict'
] as unknown as Linter.Config[];

const I18N_CONFIG: Linter.Config = {
  files: JSX_FILES,
  ignores: ['**/*.{test,spec,stories}.{js,jsx,ts,tsx}', '**/*.e2e.{js,jsx,ts,tsx}', '**/e2e/**'],
  ...eslintPluginI18next.configs['flat/recommended'],
  rules: {
    // Recommended severity is 'error' — downgraded to 'warn' for gradual i18n migration
    'i18next/no-literal-string': 'warn',
  },
};

const REACT_CONFIGS = [
  { settings: { react: { version: 'detect' } } },
  {
    files: ['**/*.tsx'],
    ...eslintPluginReact.configs['recommended-typescript'],
  },
  {
    files: ['**/*.tsx'],
    rules: REACT_DUPLICATE_RULES_OFF,
  },
  {
    files: [...TS_FILES, ...JSX_FILES],
    ...eslintPluginReactHooks.configs.flat['recommended-latest'],
  },
  {
    files: JSX_FILES,
    ...eslintPluginJsxA11y.flatConfigs.recommended,
  },
  {
    files: ['**/*.stories.{ts,tsx}'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
] as Linter.Config[];

const NESTJS_CONFIGS = nestjsTyped.configs.flatRecommended;

const MUI_CONFIG: Linter.Config = {
  files: [...TS_FILES, ...JS_FILES],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@mui/*/*/*', '!@mui/material/test-utils/*'],
            message: 'Import from the package root for tree-shaking, e.g. `@mui/material/Button`.',
          },
        ],
      },
    ],
  },
};

export default function flexifinPreset(
  config: MainConfig = {},
  ...userConfigs: TypedFlatConfig[]
): Linter.Config[] {
  const enablePerfectionist =
    // eslint-disable-next-line @typescript-eslint/no-deprecated, sonarjs/deprecation -- legacy compatibility
    config.experimental?.enablePerfectionistPlugin ?? config.enablePerfectionist ?? true;

  return [
    { ignores: [...IGNORED_DIRECTORIES, ...(config.ignores ?? [])] },
    LINTER_OPTIONS,
    buildLanguageOptions(config),

    eslint.configs.recommended,

    ...(defineConfig({
      extends: [...tsEslint.configs.strictTypeChecked, ...tsEslint.configs.stylisticTypeChecked],
      files: TS_FILES,
    }) as unknown as Linter.Config[]),
    { files: JS_FILES, ...tsEslint.configs.disableTypeChecked },

    eslintPluginUnicorn.configs.recommended,
    importX.flatConfigs.recommended,
    SONARJS_CONFIG,
    regexpPlugin.configs['flat/recommended'],
    ...(enablePerfectionist ? PERFECTIONIST_CONFIGS : []),
    { plugins: { '@stylistic': stylistic } },
    ...eslintPluginCasePolice.configs.recommended,

    ...(config.nestSupport ? [] : [nodePlugin.configs['flat/recommended']]),
    ...(config.nestSupport ? NESTJS_CONFIGS : []),

    { rules: buildUniversalRules(config) },
    { files: TS_FILES, rules: buildTypeScriptRules(config) },

    DECLARATION_FILES_OVERRIDES,
    ...STORYBOOK_CONFIGS,
    PLAYWRIGHT_CONFIG,
    VITEST_CONFIG,
    JEST_CONFIG,

    ...(config.reactSupport
      ? [
          ...REACT_CONFIGS,
          NEXT_CONFIG,
          I18N_CONFIG,
          ...TANSTACK_QUERY_CONFIGS,
          ...(config.muiSupport ? [MUI_CONFIG] : []),
        ]
      : []),

    ...(userConfigs as Linter.Config[]),

    // eslint-config-prettier must run last — disables formatting rules that conflict with Prettier
    prettierConfig,
  ] as Linter.Config[];
}

function buildLanguageOptions(config: MainConfig): Linter.Config {
  return {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2026,
        ...(config.reactSupport ? globals.browser : {}),
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ALLOW_DEFAULT_PROJECT_FILES,
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
  };
}

function buildTypeScriptRules(config: MainConfig): Linter.RulesRecord {
  const rules: RuleOptions = {
    ...TYPESCRIPT_RULES,
    // Nest framework types (e.g. OnModuleInit) follow `interface` convention; relax outside Nest.
    ...(!config.nestSupport && {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    }),
  };

  return rules as Linter.RulesRecord;
}

function buildUniversalRules(config: MainConfig): Linter.RulesRecord {
  const rules: RuleOptions = {
    ...STYLISTIC_RULES,
    ...NATIVE_RULES,
    ...UNICORN_RULES,
    ...IMPORT_RULES,
    ...NODE_RULES,
    ...SONARJS_OVERRIDES,
    ...config.rules,
  };

  return rules as Linter.RulesRecord;
}
