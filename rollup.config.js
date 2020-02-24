import { uglify } from "rollup-plugin-uglify";
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/parse5-helper.js',
    format: 'umd'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify(),
  ],
};
