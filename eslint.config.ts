import flexiFin from './src/eslint';

export default flexiFin({
  ignores: ['**/types.gen.d.ts'],
  strict: true,
  tsconfigRootDir: import.meta.dirname,
});
