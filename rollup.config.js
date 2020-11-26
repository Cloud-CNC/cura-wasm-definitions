/**
 * @fileoverview Rollup Build Config
 */

//Imports
import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

//Export
export default {
  input: 'src/index.ts',
  plugins: [
    json(),
    resolve(),
    commonjs(),
    typescript(),
    terser()
  ],
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs'
    },
    {
      dir: 'dist/es',
      format: 'es'
    }
  ]
};