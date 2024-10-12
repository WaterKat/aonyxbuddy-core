import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import rollupDelete from 'rollup-plugin-delete';

// rollup.config.mjs
export default [
  //? Library Build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es'
    },
    plugins: [
      typescript({ tsconfig: './tsconfig.lib.json' })
    ]
  }, {
    input: 'dist/dts/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [
      dts(),
      rollupDelete({ hook: "buildEnd", targets: 'dist/dts', verbose: true })
    ],
  },
  //? Minified Web Build
  {
    input: 'src/app.ts',
    output: [{
      file: 'dist/app.js',
      format: 'es',
    }, {
      file: 'dist/app.min.js',
      format: 'es',
      plugins: [terser()]
    }],
    plugins: [typescript()]
  }
];