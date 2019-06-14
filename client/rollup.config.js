import scss from 'rollup-plugin-scss'
import serve from 'rollup-plugin-serve'
import replace from 'rollup-plugin-replace';
import livereload from 'rollup-plugin-livereload'
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/app.js',
  output: {
    name: 'app',
    file: 'build/bundle.js',
    format: 'iife',
    sourceMap: true
  },
  plugins: [
    resolve({

      // some package.json files have a "browser" field which specifies
      // alternative files to load for people bundling for the browser. If
      // that's you, either use this option or add "browser" to the
      // "mainfields" option, otherwise pkg.browser will be ignored
      browser: true,  // Default: false

      // not all files you want to resolve are .js files
      extensions: [ '.js', '.jsx', '.json' ],  // Default: [ '.mjs', '.js', '.json', '.node' ]


      // If true, inspect resolved files to check that they are
      // ES2015 modules
      modulesOnly: true, // Default: false

      // Force resolving for these modules to root's node_modules that helps
      // to prevent bundling the same package multiple times if package is
      // imported from dependencies.
      dedupe: [ 'react', 'react-dom' ], // Default: []
    }),
    scss(),
    serve('build'),
    livereload('build'),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'dev'),
    }),
  ]
};
