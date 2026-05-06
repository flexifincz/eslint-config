import type { Linter } from 'eslint';

import eslintPluginNestjsTyped from '@darraghor/eslint-plugin-nestjs-typed';
import eslintPluginReact from '@eslint-react/eslint-plugin';
import eslint from '@eslint/js';
import eslintPluginNext from '@next/eslint-plugin-next';
import eslintPluginStylistic from '@stylistic/eslint-plugin';
import eslintPluginTanstackQuery from '@tanstack/eslint-plugin-query';
import eslintPluginVitest from '@vitest/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginCasePolice from 'eslint-plugin-case-police';
import eslintPluginI18next from 'eslint-plugin-i18next';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginNode from 'eslint-plugin-n';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginRegexp from 'eslint-plugin-regexp';
import eslintPluginSonarjs from 'eslint-plugin-sonarjs';
import eslintPluginStorybook from 'eslint-plugin-storybook';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import type { RuleOptions } from './types.gen';

export type MainConfig = {
  ignores?: string[];
  muiSupport?: boolean;
  nestSupport?: boolean;
  plugins?: PluginsConfig;
  reactSupport?: boolean;
  rules?: RuleOptions;
  swaggerSupport?: boolean;
  tsconfigRootDir?: string;
};

export type PluginsConfig = {
  casePolice?: boolean;
  eslintReact?: boolean;
  i18next?: boolean;
  importX?: boolean;
  jest?: boolean;
  js?: boolean;
  jsxA11y?: boolean;
  nestjsTyped?: boolean;
  next?: boolean;
  node?: boolean;
  perfectionist?: boolean;
  playwright?: boolean;
  prettier?: boolean;
  reactHooks?: boolean;
  regexp?: boolean;
  sonarjs?: boolean;
  storybook?: boolean;
  stylistic?: boolean;
  tanstackQuery?: boolean;
  typescriptEslint?: boolean;
  unicorn?: boolean;
  vitest?: boolean;
};

export type TypedFlatConfig = Omit<Linter.Config, 'rules'> & {
  rules?: RuleOptions;
};

const DEFAULT_PLUGINS: Required<PluginsConfig> = {
  casePolice: true,
  eslintReact: true,
  i18next: true,
  importX: true,
  jest: false,
  js: true,
  jsxA11y: true,
  nestjsTyped: true,
  next: true,
  node: true,
  perfectionist: true,
  playwright: true,
  prettier: true,
  reactHooks: true,
  regexp: true,
  sonarjs: true,
  storybook: true,
  stylistic: true,
  tanstackQuery: true,
  typescriptEslint: true,
  unicorn: true,
  vitest: true,
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
      replacements: Object.fromEntries(
        ALLOWED_ABBREVIATIONS.map((abbreviation) => [abbreviation, false])
      ),
    },
  ],
};

const IMPORT_RULES: RuleOptions = {
  'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
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
  'n/no-missing-import': 'off',
};

const SONARJS_OVERRIDES: RuleOptions = {
  'sonarjs/todo-tag': 'off',
};

const SONARJS_CONFIG = (eslintPluginSonarjs.configs ?? { recommended: {} }).recommended;

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
).map((config) => ({ ...config, files: STORY_FILES }));

const PLAYWRIGHT_CONFIG: Linter.Config = {
  files: PLAYWRIGHT_TEST_FILES,
  ...eslintPluginPlaywright.configs['flat/recommended'],
};

const VITEST_CONFIG: Linter.Config = {
  files: TEST_FILES,
  ...eslintPluginVitest.configs.recommended,
  languageOptions: { globals: eslintPluginVitest.environments.env.globals },
};

const JEST_CONFIG: Linter.Config = {
  files: TEST_FILES,
  ...eslintPluginJest.configs['flat/recommended'],
};

const NEXT_CONFIG: Linter.Config = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  ...eslintPluginNext.configs['core-web-vitals'],
};

const TANSTACK_QUERY_CONFIGS = (
  eslintPluginTanstackQuery.configs['flat/recommended-strict'] as unknown as Linter.Config[]
).map((config) => ({ ...config, files: [...TS_FILES, ...JSX_FILES] }));

const I18N_CONFIG: Linter.Config = {
  files: JSX_FILES,
  ignores: ['**/*.{test,spec,stories}.{js,jsx,ts,tsx}', '**/*.e2e.{js,jsx,ts,tsx}', '**/e2e/**'],
  ...eslintPluginI18next.configs['flat/recommended'],
  rules: {
    'i18next/no-literal-string': 'warn',
  },
};

const REACT_BASE_CONFIG: Linter.Config = {
  settings: {
    // @eslint-react v5 reads `react-x.version`; classic eslint-plugin-react reads `react.version`.
    react: { version: 'detect' },
    'react-x': { version: 'detect' },
  },
};

const ESLINT_REACT_CONFIGS: Linter.Config[] = [
  {
    files: [...TS_FILES, ...JSX_FILES],
    ...eslintPluginReact.configs['recommended-typescript'],
  },
];

const REACT_HOOKS_CONFIGS: Linter.Config[] = [
  {
    files: [...TS_FILES, ...JSX_FILES],
    ...eslintPluginReactHooks.configs.flat['recommended-latest'],
  },
  {
    files: ['**/*.stories.{ts,tsx}'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
];

const JSX_A11Y_CONFIG: Linter.Config = {
  files: JSX_FILES,
  ...eslintPluginJsxA11y.flatConfigs.recommended,
};

const NESTJS_CONFIGS = eslintPluginNestjsTyped.configs.flatRecommended;

const MUI_CONFIG: Linter.Config = {
  files: [...TS_FILES, ...JS_FILES],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            message: 'Use a deep path import for tree-shaking, e.g. `@mui/material/Button`.',
            regex: '^@mui/[^/]+$',
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
  const enabledPlugins: Required<PluginsConfig> = { ...DEFAULT_PLUGINS, ...config.plugins };

  return [
    globalIgnores([...IGNORED_DIRECTORIES, ...(config.ignores ?? [])]),
    LINTER_OPTIONS,
    buildLanguageOptions(config),

    ...buildBaseConfigs(enabledPlugins),
    ...buildToolingConfigs(enabledPlugins),
    ...buildBackendConfigs(config, enabledPlugins),

    { rules: buildUniversalRules(config, enabledPlugins) },
    { files: TS_FILES, rules: buildTypeScriptRules(config) },

    DECLARATION_FILES_OVERRIDES,
    ...buildTestConfigs(enabledPlugins),
    ...(config.reactSupport ? buildReactConfigs(config, enabledPlugins) : []),
    ...(userConfigs as Linter.Config[]),

    // eslint-config-prettier must run last — disables formatting rules that conflict with Prettier
    ...(enabledPlugins.prettier ? [eslintConfigPrettier] : []),
  ] as Linter.Config[];
}

function buildBackendConfigs(
  config: MainConfig,
  enabledPlugins: Required<PluginsConfig>
): Linter.Config[] {
  if (!config.nestSupport) {
    return enabledPlugins.node ? [eslintPluginNode.configs['flat/recommended']] : [];
  }

  if (!enabledPlugins.nestjsTyped) {
    return [];
  }

  const configs: Linter.Config[] = [...NESTJS_CONFIGS];

  if (config.swaggerSupport === false) {
    configs.push(...eslintPluginNestjsTyped.configs.flatNoSwagger);
  }

  return configs;
}

function buildBaseConfigs(enabledPlugins: Required<PluginsConfig>): Linter.Config[] {
  const configs: Linter.Config[] = [];

  if (enabledPlugins.js) {
    configs.push(eslint.configs.recommended);
  }

  if (enabledPlugins.typescriptEslint) {
    configs.push(
      ...(defineConfig({
        extends: [...tsEslint.configs.strictTypeChecked, ...tsEslint.configs.stylisticTypeChecked],
        files: TS_FILES,
      }) as unknown as Linter.Config[]),
      { files: JS_FILES, ...tsEslint.configs.disableTypeChecked }
    );
  }

  return configs;
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

function buildReactConfigs(
  config: MainConfig,
  enabledPlugins: Required<PluginsConfig>
): Linter.Config[] {
  const configs: Linter.Config[] = [REACT_BASE_CONFIG];

  if (enabledPlugins.eslintReact) {
    configs.push(...ESLINT_REACT_CONFIGS);
  }

  if (enabledPlugins.eslintReact && enabledPlugins.reactHooks) {
    configs.push({
      files: [...TS_FILES, ...JSX_FILES],
      rules: REACT_DUPLICATE_RULES_OFF as Linter.RulesRecord,
    });
  }

  if (enabledPlugins.reactHooks) {
    configs.push(...REACT_HOOKS_CONFIGS);
  }

  if (enabledPlugins.jsxA11y) {
    configs.push(JSX_A11Y_CONFIG);
  }

  if (enabledPlugins.next) {
    configs.push(NEXT_CONFIG);
  }

  if (enabledPlugins.i18next) {
    configs.push(I18N_CONFIG);
  }

  if (enabledPlugins.tanstackQuery) {
    configs.push(...TANSTACK_QUERY_CONFIGS);
  }

  if (config.muiSupport) {
    configs.push(MUI_CONFIG);
  }

  return configs;
}

function buildTestConfigs(enabledPlugins: Required<PluginsConfig>): Linter.Config[] {
  const configs: Linter.Config[] = [];

  if (enabledPlugins.storybook) {
    configs.push(...STORYBOOK_CONFIGS);
  }

  if (enabledPlugins.playwright) {
    configs.push(PLAYWRIGHT_CONFIG);
  }

  if (enabledPlugins.vitest) {
    configs.push(VITEST_CONFIG);
  }

  if (enabledPlugins.jest) {
    configs.push(JEST_CONFIG);
  }

  return configs;
}

function buildToolingConfigs(enabledPlugins: Required<PluginsConfig>): Linter.Config[] {
  const configs: Linter.Config[] = [];

  if (enabledPlugins.unicorn) {
    configs.push(eslintPluginUnicorn.configs.recommended);
  }

  if (enabledPlugins.importX) {
    configs.push(eslintPluginImportX.flatConfigs.recommended);
  }

  if (enabledPlugins.sonarjs) {
    configs.push(SONARJS_CONFIG as Linter.Config);
  }

  if (enabledPlugins.regexp) {
    configs.push(eslintPluginRegexp.configs['flat/recommended']);
  }

  if (enabledPlugins.perfectionist) {
    configs.push(...PERFECTIONIST_CONFIGS);
  }

  if (enabledPlugins.stylistic) {
    configs.push({ plugins: { '@stylistic': eslintPluginStylistic } });
  }

  if (enabledPlugins.casePolice) {
    configs.push(...(eslintPluginCasePolice.configs.recommended as unknown as Linter.Config[]));
  }

  return configs;
}

function buildTypeScriptRules(config: MainConfig): Linter.RulesRecord {
  const rules: RuleOptions = {
    ...TYPESCRIPT_RULES,
    ...(!config.nestSupport && {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    }),
  };

  return rules as Linter.RulesRecord;
}

function buildUniversalRules(
  config: MainConfig,
  enabledPlugins: Required<PluginsConfig>
): Linter.RulesRecord {
  const rules: RuleOptions = {
    ...(enabledPlugins.stylistic && STYLISTIC_RULES),
    ...NATIVE_RULES,
    ...(enabledPlugins.unicorn && UNICORN_RULES),
    ...(enabledPlugins.importX && IMPORT_RULES),
    ...(enabledPlugins.node && NODE_RULES),
    ...(enabledPlugins.sonarjs && SONARJS_OVERRIDES),
    ...config.rules,
  };

  return rules as Linter.RulesRecord;
}
