import { terser } from "rollup-plugin-terser";

export default [
	{
    input: 'lib/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'default'
    }
  },
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      esModule: true,
      exports: 'named',
      plugins: [terser()]
    }
  },
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      sourcemap: 'inline',
      name: 'Chain',
      plugins: [terser()]
    }
  }
];
