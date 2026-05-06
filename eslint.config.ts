import flexiFin from './src/eslint';

export default flexiFin({
  ignores: ['**/types.gen.d.ts'],
  tsconfigRootDir: import.meta.dirname,
});
