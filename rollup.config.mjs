import json from '@rollup/plugin-json';

export default {
  input: 'dist/esm/src/index.js',
  plugins: [json()],
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'capacitorTransactPlugin',
      globals: {
        '@capacitor/core': 'capacitorExports',
        '@atomicfi/transact-javascript': 'atomicTransactJavascript',
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/plugin.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  external: ['@capacitor/core', '@atomicfi/transact-javascript'],
};
