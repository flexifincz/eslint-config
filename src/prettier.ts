import type { Options } from 'prettier';

export default function flexifinPreset() {
  return {
    printWidth: 100,
    singleQuote: true,
    trailingComma: 'es5',
  } as Options;
}
