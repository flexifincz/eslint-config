# flexifin/eslint-config

Code service level repo for sharing common sources through several FF projects.

## Usage

Update ESlint to version 9:

```bash
npm install eslint@^9
```

Remove these packages from your project:

```bash
npm remove prettier \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-prefer-arrow-functions \
  eslint-plugin-unused-imports \
  eslint-config-prettier \
  eslint-plugin-prettier \
  eslint-plugin-react \
  eslint-plugin-unicorn
```

Install package:

<!-- automd:pm-install auto=false dev -->

```sh
# npm
npm install -D @flexifin/eslint-config

# yarn
yarn add -D @flexifin/eslint-config

# pnpm
pnpm add -D @flexifin/eslint-config

# bun
bun install -D @flexifin/eslint-config

# deno
deno install --dev npm:@flexifin/eslint-config
```

<!-- /automd -->

## Migration to FlexiFin code standard

Rename your project root ESLint config file to `eslint.config.mjs` and modify content to extend FlexiFin preset:

```js
import flexiFin from '@flexifin/eslint-config';

export default flexiFin({
  tsconfigRootDir: import.meta.dirname,
  reactSupport: true, // optional (React projects)
  nestSupport: true, // optional (NestJS projects)
  muiSupport: true, // optional (MUI projects, blocks barrel imports for tree-shaking)
  swaggerSupport: false, // optional (NestJS without Swagger — disables Swagger-specific rules)
  plugins: {
    // Every plugin defaults to true EXCEPT `jest` (off — Vitest is the default test runner).
    // Set false to opt out individually. Jest projects opt in:
    // jest: true, vitest: false,
  },
  ignores: [
    // ignore paths
  ],
  rules: {
    // rule overrides
  },
});
```

Real world example:

```js
import flexiFin from '@flexifin/eslint-config';

export default flexiFin(
  {
    reactSupport: true,
    ignores: ['src/_api'],
    rules: {
      'unicorn/no-array-reduce': 'off',
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
```

Rename your project root Prettier config file to `prettier.config.mjs` and modify content to extend FlexiFin preset:

```js
import flexiFin from '@flexifin/eslint-config/prettier';

export default flexiFin();
```

## Performance tips

The preset bundles ~22 plugins with type-aware rules from `typescript-eslint`'s `strictTypeChecked`. A cold run on a typical NestJS/Next app touches every file through the TypeScript checker, so use these defaults to keep things fast:

```jsonc
// package.json
{
  "scripts": {
    "lint": "eslint . --cache --cache-location node_modules/.cache/eslint",
    "lint:fix": "eslint . --cache --cache-location node_modules/.cache/eslint --fix",
  },
}
```

`--cache` skips files whose hash and config haven't changed; the second run is typically 2–3× faster than the first.

For IDE / pre-commit feedback, run `eslint_d` (daemon mode) — it keeps the parser and TS checker warm between invocations:

```sh
pnpm dlx eslint_d start
# point your editor at `eslint_d` instead of `eslint`
```

For pre-commit hooks, lint only changed files via `lint-staged` — full-repo lint should be reserved for CI.

## Silencing peer-dependency warnings

Some bundled plugins declare peers that don't apply to every project: `@darraghor/eslint-plugin-nestjs-typed` peer-deps on `class-validator` (relevant only for NestJS apps), `eslint-plugin-jsx-a11y` is still pinned to ESLint ≤9, and `eslint-plugin-storybook` requires Storybook 10.3.6+. Add the following to your monorepo root `package.json` to silence the noise:

```json
{
  "pnpm": {
    "peerDependencyRules": {
      "allowedVersions": {
        "eslint-plugin-jsx-a11y>eslint": "10",
        "eslint-plugin-storybook>storybook": ">=10.3.5"
      },
      "ignoreMissing": ["class-validator"]
    }
  }
}
```

NestJS apps already use `class-validator` at runtime, so the `ignoreMissing` entry only matters for front-end / non-Nest packages — keep it monorepo-wide and the warning disappears regardless of project type.

To approve native build scripts (`unrs-resolver` etc.), run `pnpm approve-builds` once.

## Contributors

<a href="https://github.com/flexifincz/eslint-config/graphs/contributors">
<img src="https://contrib.rocks/image?repo=flexifincz/eslint-config" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
