# flexifin/eslint-config

Code service level repo for sharing common sources through several FF projects.

## Usage

Remove these packages from your project:

```bash
npm remove eslint \
  prettier \
  @typescript-eslint/parser \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-prefer-arrow-functions \
  eslint-plugin-unused-imports \
  eslint-config-prettier \
  eslint-plugin-prettier \
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
pnpm install -D @flexifin/eslint-config

# bun
bun install -D @flexifin/eslint-config
```

<!-- /automd -->

## Migration to FlexiFin code standard

Rename your project root ESLint config file to `eslint.config.mjs` and modify content to extend FlexiFin preset:

```js
import flexiFin from '@flexifin/eslint-config';

export default flexiFin({
  ignores: [
    // ignore paths
  ],
  rules: {
    // rule overrides
  },
});
```

Rename your project root Prettier config file to `prettier.config.mjs` and modify content to extend FlexiFin preset:

```js
import flexiFin from '@flexifin/eslint-config/prettier';

export default flexiFin();
```

## Contributors

<a href="https://github.com/flexifincz/eslint-config/graphs/contributors">
<img src="https://contrib.rocks/image?repo=flexifincz/eslint-config" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
