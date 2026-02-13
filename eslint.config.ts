import flexiFin from './src/eslint';

export default flexiFin(
  { tsconfigRootDir: import.meta.dirname, ignores: ['**/types.gen.d.ts'] },
  { rules: {} }
);
