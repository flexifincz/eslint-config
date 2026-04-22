import type { Linter } from 'eslint';

import eslintPluginReact from '@eslint-react/eslint-plugin';
import eslint from '@eslint/js';
import eslintPluginNext from '@next/eslint-plugin-next';
import stylistic from '@stylistic/eslint-plugin';
import prettierConfig from 'eslint-config-prettier/flat';
import eslintPluginCasePolice from 'eslint-plugin-case-police';
import eslintPluginI18next from 'eslint-plugin-i18next';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginStorybook from 'eslint-plugin-storybook';
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
  'dev',
  'env',
  'fn',
  'params',
  'prod',
  'props',
  'ref',
  'refNo',
  'e2e',
];

const ALLOW_DEFAULT_PROJECT_FILES = ['*.js', '*.mjs', '*.cjs', '*.config.js', '*.config.mjs'];

const PLAYWRIGHT_TEST_FILES = ['**/e2e/**', '**/*.e2e.{js,jsx,ts,tsx}'];

const JSX_FILES = ['**/*.jsx', '**/*.tsx'];

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
  'no-duplicate-imports': [
    'error',
    {
      allowSeparateTypeImports: true,
      includeExports: true,
    },
  ],
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

const STORYBOOK_CONFIGS = eslintPluginStorybook.configs['flat/recommended'] as Linter.Config[];

const PLAYWRIGHT_CONFIG: Linter.Config = {
  files: PLAYWRIGHT_TEST_FILES,
  ...eslintPluginPlaywright.configs['flat/recommended'],
};

const NEXT_CONFIG: Linter.Config = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  ...eslintPluginNext.configs.recommended,
};

const I18N_CONFIG: Linter.Config = {
  files: ['**/*.jsx', '**/*.tsx'],
  ignores: ['**/*.{test,spec,stories}.{js,jsx,ts,tsx}', '**/*.e2e.{js,jsx,ts,tsx}', '**/e2e/**'],
  ...eslintPluginI18next.configs['flat/recommended'],
  rules: {
    // Recommended severity is 'error' — downgraded to 'warn' for gradual i18n migration
    'i18next/no-literal-string': 'warn',
  },
};

const REACT_CONFIGS: Linter.Config[] = [
  { settings: { react: { version: 'detect' } } },
  {
    files: ['**/*.tsx'],
    ...eslintPluginReact.configs['recommended-typescript'],
  },
  {
    // eslint-plugin-react-hooks owns hook linting — disable duplicate checks from @eslint-react
    files: ['**/*.tsx'],
    rules: {
      '@eslint-react/rules-of-hooks': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      '@eslint-react/set-state-in-render': 'off',
      '@eslint-react/use-memo': 'off',
    },
  },
  {
    files: ['**/*.tsx', '**/*.ts'],
    ...eslintPluginReactHooks.configs.flat.recommended,
  },
  {
    files: JSX_FILES,
    ...eslintPluginJsxA11y.flatConfigs.recommended,
  },
  {
    files: ['**/*.stories.tsx', '**/*.stories.ts'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
];

export default function flexifinPreset(
  config: MainConfig = {},
  ...userConfigs: TypedFlatConfig[]
): Linter.Config[] {
  const enablePerfectionist = config.experimental?.enablePerfectionistPlugin ?? false;

  return [
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    eslintPluginUnicorn.configs.recommended,
    ...(enablePerfectionist ? PERFECTIONIST_CONFIGS : []),
    { plugins: { '@stylistic': stylistic } },
    ...eslintPluginCasePolice.configs.recommended,

    LINTER_OPTIONS,
    { rules: buildRules(config) },
    buildLanguageOptions(config),
    { ignores: [...IGNORED_DIRECTORIES, ...(config.ignores ?? [])] },

    DECLARATION_FILES_OVERRIDES,
    ...STORYBOOK_CONFIGS,
    PLAYWRIGHT_CONFIG,
    // reactSupport bundles the full flexifin React stack: React + hooks + a11y + Next.js + next-intl
    ...(config.reactSupport ? [...REACT_CONFIGS, NEXT_CONFIG, I18N_CONFIG] : []),

    ...(userConfigs as Linter.Config[]),

    // eslint-config-prettier must run last — disables formatting rules that conflict with Prettier
    prettierConfig,
  ];
}

function buildLanguageOptions(config: MainConfig): Linter.Config {
  return {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2025,
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

function buildRules(config: MainConfig): Linter.RulesRecord {
  const rules: RuleOptions = {
    ...STYLISTIC_RULES,
    ...TYPESCRIPT_RULES,
    ...(!config.nestSupport && {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    }),
    ...NATIVE_RULES,
    ...UNICORN_RULES,
    ...config.rules,
  };

  return rules as Linter.RulesRecord;
}
