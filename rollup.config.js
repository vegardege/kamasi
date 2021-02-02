import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/kamasi.js',
        format: 'umd',
        name: 'kamasi',
      },
      {
        file: 'dist/kamasi.min.js',
        format: 'umd',
        name: 'kamasi',
        plugins: [terser()],
      }
    ]
  }
]
