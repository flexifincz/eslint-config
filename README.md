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

## Silencing peer-dependency warnings

Some bundled plugins declare peer dependencies that don't apply to every project (e.g. `class-validator` is only relevant for NestJS apps; `eslint-plugin-jsx-a11y` lags behind ESLint v10). Add the following to your monorepo root `package.json` to silence the noise:

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

NestJS apps that already use `class-validator` do not need the `ignoreMissing` entry — install the dependency normally. Front-end / non-Nest packages should keep it.

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
