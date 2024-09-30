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

      await fs.writeFile('src/eslint.gen.d.ts', dts);
    },
  },
});
