import { transform } from 'babel-core'

/******************************************************************************/
// Data
/******************************************************************************/

const BABEL_OPTIONS = {

  presets: [
    require('babel-preset-es2015')
  ],
  plugins: [
    require('babel-plugin-transform-es3-member-expression-literals'),
    require('babel-plugin-transform-es3-property-literals'),
    require('babel-plugin-transform-es5-property-mutators')
  ],
  generatorOpts: {
    quotes: 'single'
  },
  sourceType: 'script',
  minified: false

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default function transpile (str) {

  const { code } = transform(str, BABEL_OPTIONS)

  return code

}
