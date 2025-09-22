import fs from 'node:fs/promises';

import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  hooks: {
    async 'build:before'() {
      const flexiFinPreset = await import('./src/eslint').then((m) => m.default);
      const { flatConfigsToRulesDTS } = await import('eslint-typegen/core');
      const dts = await flatConfigsToRulesDTS(flexiFinPreset(), {
        includeAugmentation: false,
      });
      await fs.writeFile('src/types.gen.d.ts', dts);
    },
    async 'build:done'() {
      await fs.rm('dist/eslint.d.ts');
      await fs.rm('dist/prettier.d.ts');
    },
  },
});
