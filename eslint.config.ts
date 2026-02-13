import flexiFin from './src/eslint';

export default flexiFin(
  {
    experimental: { enablePerfectionistPlugin: true },
    ignores: ['**/types.gen.d.ts'],
    tsconfigRootDir: import.meta.dirname,
  },
  { rules: {} }
);
