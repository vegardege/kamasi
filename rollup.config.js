import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/kamasi.js',
      format: 'umd',
      name: 'kamasi',
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/kamasi.min.js',
      format: 'umd',
      name: 'kamasi',
    },
    plugins: [terser()]
  }
]
