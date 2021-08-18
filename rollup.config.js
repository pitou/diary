import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import injectProcessEnv from 'rollup-plugin-inject-process-env'
import { terser } from 'rollup-plugin-terser'
import staticFiles from 'rollup-plugin-static-files'

export default {
  input: 'src/index.js',
  output: {
    name: 'bundle',
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
    intro: 'const global = window;',
  },
  plugins: [
    commonjs(),
    globals(),
    builtins(),
    injectProcessEnv(
      {
        NODE_ENV: 'staging',
      },
      {
        exclude: 'node_modules/**',
      }
    ),
    nodeResolve({ preferBuiltins: false }),
    terser(),
    staticFiles({
      include: ['./public'],
    }),
  ],
}
