import { terser } from 'rollup-plugin-terser'

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/kamasi.js',
    format: 'umd',
    name: 'kamasi',
  }
}

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: 'dist/kamasi.min.js',
    },
    plugins: [terser()]
  }
]
