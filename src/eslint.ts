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
  nestSupport?: boolean;
  nextSupport?: boolean;
  plugins?: PluginsConfig;
  strict?: boolean;
  tsconfigRootDir?: string;
};

const DEFAULT_PLUGINS = {
  casePolice: true,
  eslintReact: true,
  i18next: true,
  importX: true,
  jest: false,
  js: true,
  jsxA11y: true,
  nestjsTyped: false,
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
  unicorn: true,
  vitest: true,
} as const satisfies Record<string, boolean>;

export type PluginsConfig = { [K in keyof typeof DEFAULT_PLUGINS]?: boolean };

const NEXT_PRESET_PLUGINS: PluginsConfig = {};

const NEST_PRESET_PLUGINS: PluginsConfig = {
  eslintReact: false,
  i18next: false,
  jsxA11y: false,
  nestjsTyped: true,
  next: false,
  playwright: false,
  reactHooks: false,
  storybook: false,
  tanstackQuery: false,
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
const STORY_FILES = ['**/*.stories.{ts,tsx,js,jsx}'];
const TEST_FILES = ['**/*.{test,spec}.{ts,tsx,js,jsx}'];
const PLAYWRIGHT_TEST_FILES = ['**/e2e/**', '**/*.e2e.{js,jsx,ts,tsx}'];
const PLAYWRIGHT_FILES = [...PLAYWRIGHT_TEST_FILES, '**/playwright/**'];
const SERVICE_WORKER_FILES = ['**/{serviceworker,service-worker,sw}.{js,ts,mjs,mts}'];

const STYLISTIC_RULES: RuleOptions = {
  '@stylistic/padding-line-between-statements': [
    'error',
    { blankLine: 'always', next: 'return', prev: '*' },
  ],
};

const UNUSED_VARS_OPTIONS = {
  argsIgnorePattern: '^_',
  destructuredArrayIgnorePattern: '^_',
  varsIgnorePattern: '^_',
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
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': ['error', UNUSED_VARS_OPTIONS],
};

const NATIVE_RULES: RuleOptions = {
  // @ts-expect-error curly options are not modeled in the generated RuleOptions
  curly: ['error', 'all'],
  eqeqeq: ['error', 'always'],
  'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
};

const JS_NATIVE_RULES = {
  'no-unused-vars': ['error', UNUSED_VARS_OPTIONS],
} as unknown as RuleOptions;

const FILENAME_CASE_IGNORE = ['MTP', 'IL', 'SME', 'GTM', 'SMS'];

const UNICORN_RULES: RuleOptions = {
  'unicorn/no-array-reduce': ['error', { allowSimpleOperations: true }],
  'unicorn/no-null': 'off',
  'unicorn/no-process-exit': 'off',
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

const NODE_BUILTINS_BROWSER_IGNORE = [
  'EventSource',
  'Navigator',
  'Storage',
  'localStorage',
  'navigator',
  'sessionStorage',
];

const SONARJS_OVERRIDES: RuleOptions = {
  'sonarjs/deprecation': 'off',
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

function buildDeclarationFilesOverride(enabledPlugins: Required<PluginsConfig>): Linter.Config {
  const rules: Linter.RulesRecord = {
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
  };

  if (enabledPlugins.unicorn) {
    rules['unicorn/require-module-specifiers'] = 'off';
  }

  return { files: ['**/*.d.ts'], rules };
}

const LINTER_OPTIONS: Linter.Config = {
  linterOptions: {
    reportUnusedDisableDirectives: 'warn',
  },
};

const CJS_LANGUAGE_OPTIONS: Linter.Config = {
  files: ['**/*.cjs'],
  languageOptions: {
    globals: {
      __dirname: 'readonly',
      __filename: 'readonly',
      exports: 'writable',
      module: 'readonly',
      require: 'readonly',
    },
    sourceType: 'commonjs',
  },
};

const SERVICE_WORKER_CONFIG: Linter.Config = {
  files: SERVICE_WORKER_FILES,
  languageOptions: { globals: globals.serviceworker },
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
  rules: {
    ...eslintPluginNext.configs['core-web-vitals'].rules,
    '@next/next/no-html-link-for-pages': 'off',
  },
};

const TANSTACK_QUERY_CONFIGS: Linter.Config[] = [
  ...(
    eslintPluginTanstackQuery.configs['flat/recommended-strict'] as unknown as Linter.Config[]
  ).map((config) => ({ ...config, files: [...TS_FILES, ...JSX_FILES] })),
  {
    files: [...TS_FILES, ...JSX_FILES],
    rules: {
      '@tanstack/query/exhaustive-deps': 'off',
    },
  },
];

const I18N_CONFIG: Linter.Config = {
  files: JSX_FILES,
  ignores: ['**/*.{test,spec,stories}.{js,jsx,ts,tsx}', '**/*.e2e.{js,jsx,ts,tsx}', '**/e2e/**'],
  ...eslintPluginI18next.configs['flat/recommended'],
  rules: {
    'i18next/no-literal-string': 'error',
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
  {
    files: PLAYWRIGHT_FILES,
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
];

const JSX_A11Y_CONFIG: Linter.Config = {
  files: JSX_FILES,
  ...eslintPluginJsxA11y.flatConfigs.recommended,
};

const NESTJS_CONFIGS = eslintPluginNestjsTyped.configs.flatRecommended;

export default function flexifinPreset(
  config: MainConfig = {},
  ...userConfigs: TypedFlatConfig[]
): Linter.Config[] {
  if (config.nextSupport && config.nestSupport) {
    throw new Error(
      '@flexifin/eslint-config: `nextSupport` and `nestSupport` are mutually exclusive — pick one.'
    );
  }

  const enabledPlugins: Required<PluginsConfig> = {
    ...DEFAULT_PLUGINS,
    ...(config.nextSupport ? NEXT_PRESET_PLUGINS : {}),
    ...(config.nestSupport ? NEST_PRESET_PLUGINS : {}),
    ...config.plugins,
  };

  return [
    globalIgnores([...IGNORED_DIRECTORIES, ...(config.ignores ?? [])]),
    LINTER_OPTIONS,
    buildLanguageOptions(config),
    SERVICE_WORKER_CONFIG,

    ...buildBaseConfigs(config, enabledPlugins),
    ...buildToolingConfigs(enabledPlugins),
    ...buildBackendConfigs(enabledPlugins),

    CJS_LANGUAGE_OPTIONS,

    { rules: buildUniversalRules(enabledPlugins) },
    { files: TS_FILES, rules: buildTypeScriptRules(config) },
    ...(enabledPlugins.js
      ? [{ files: JS_FILES, rules: JS_NATIVE_RULES as Linter.RulesRecord }]
      : []),

    buildDeclarationFilesOverride(enabledPlugins),
    ...buildTestConfigs(enabledPlugins),
    ...buildFilenameCaseConfigs(config, enabledPlugins),
    ...buildReactStackConfigs(enabledPlugins),
    ...(userConfigs as Linter.Config[]),

    // eslint-config-prettier must run last — disables formatting rules that conflict with Prettier
    ...(enabledPlugins.prettier ? [eslintConfigPrettier] : []),
  ] as Linter.Config[];
}

function buildBackendConfigs(enabledPlugins: Required<PluginsConfig>): Linter.Config[] {
  const configs: Linter.Config[] = [];

  if (enabledPlugins.node) {
    configs.push(eslintPluginNode.configs['flat/recommended'], {
      rules: {
        'n/no-unsupported-features/node-builtins': [
          'error',
          { ignores: NODE_BUILTINS_BROWSER_IGNORE },
        ],
      },
    });
  }

  if (enabledPlugins.nestjsTyped) {
    configs.push(...NESTJS_CONFIGS);
  }

  return configs;
}

function buildBaseConfigs(
  config: MainConfig,
  enabledPlugins: Required<PluginsConfig>
): Linter.Config[] {
  const configs: Linter.Config[] = [];

  if (enabledPlugins.js) {
    configs.push(eslint.configs.recommended);
  }

  configs.push({ plugins: { '@typescript-eslint': tsEslint.plugin } });

  if (config.strict) {
    configs.push(
      ...(defineConfig({
        extends: [
          ...tsEslint.configs.recommendedTypeChecked,
          ...tsEslint.configs.stylisticTypeChecked,
        ],
        files: TS_FILES,
      }) as unknown as Linter.Config[]),
      { files: JS_FILES, ...tsEslint.configs.disableTypeChecked }
    );
  } else {
    configs.push(...(tsEslint.configs.recommended as Linter.Config[]));
  }

  return configs;
}

function buildFilenameCaseConfigs(
  config: MainConfig,
  enabledPlugins: Required<PluginsConfig>
): Linter.Config[] {
  if (!enabledPlugins.unicorn) {
    return [];
  }

  if (config.nestSupport) {
    return [
      {
        files: [...TS_FILES, ...JS_FILES],
        rules: {
          'unicorn/filename-case': ['error', { case: 'kebabCase', ignore: FILENAME_CASE_IGNORE }],
        },
      },
    ];
  }

  return [
    {
      files: [...TS_FILES, ...JS_FILES],
      rules: {
        'unicorn/filename-case': [
          'error',
          {
            cases: { camelCase: true, kebabCase: true, pascalCase: true },
            ignore: FILENAME_CASE_IGNORE,
          },
        ],
      },
    },
  ];
}

function buildLanguageOptions(config: MainConfig): Linter.Config {
  return {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2026,
      },
      parserOptions: {
        ...(config.strict && {
          projectService: {
            allowDefaultProject: ALLOW_DEFAULT_PROJECT_FILES,
            defaultProject: 'tsconfig.json',
          },
          tsconfigRootDir: config.tsconfigRootDir,
        }),
        warnOnUnsupportedTypeScriptVersion: false,
        ...(config.nestSupport && {
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
        }),
      },
    },
  };
}

function buildReactStackConfigs(enabledPlugins: Required<PluginsConfig>): Linter.Config[] {
  const hasAnyReactPlugin =
    enabledPlugins.eslintReact ||
    enabledPlugins.reactHooks ||
    enabledPlugins.jsxA11y ||
    enabledPlugins.next ||
    enabledPlugins.i18next ||
    enabledPlugins.tanstackQuery;

  if (!hasAnyReactPlugin) {
    return [];
  }

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

function buildUniversalRules(enabledPlugins: Required<PluginsConfig>): Linter.RulesRecord {
  const rules: RuleOptions = {
    ...(enabledPlugins.stylistic && STYLISTIC_RULES),
    ...NATIVE_RULES,
    ...(enabledPlugins.unicorn && UNICORN_RULES),
    ...(enabledPlugins.importX && IMPORT_RULES),
    ...(enabledPlugins.node && NODE_RULES),
    ...(enabledPlugins.sonarjs && SONARJS_OVERRIDES),
  };

  return rules as Linter.RulesRecord;
}
