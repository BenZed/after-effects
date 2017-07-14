import { transform } from 'babel-core'

/******************************************************************************/
// Data
/******************************************************************************/

const BABEL_OPTIONS = {
  presets: [
    require('babel-preset-es2015')
  ],
  plugins: [
    // require('babel-plugin-transform-runtime'),
    require('babel-plugin-transform-es3-member-expression-literals'),
    require('babel-plugin-transform-es3-property-literals'),
    require('babel-plugin-transform-es5-property-mutators')
  ]
}

/******************************************************************************/
// Exports
/******************************************************************************/

export default function babelify (str) {

  console.log(transform(str, BABEL_OPTIONS).ast)
  return transform(str, BABEL_OPTIONS).code

}
