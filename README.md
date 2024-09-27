# flexifincz/eslint-config

Code service level repo for sharing common sources through several FF projects.

## Usage

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

Modify your project `.eslintrc.js` to extend Flexifin config:

```js
module.exports = {
  extends: '@flexifincz/eslint-config',
};
```

And modify your project `.prettierrc.js` to extend Flexifin config:

```js
import config from '@flexifincz/eslint-config/prettier';

export default config;
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
