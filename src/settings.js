import path from 'path'

/******************************************************************************/
// Data
/******************************************************************************/

export const DefaultSettings = Object.freeze({
  errorHandling: true,
  program: null,
  includes: [
    path.join(__dirname, '/lib/includes/console.js'),
    path.join(__dirname, '/lib/includes/extendscript-es5-shim.js'),
    path.join(__dirname, '/lib/includes/get.js')
  ]
})

const settings = Object.assign({}, DefaultSettings)

export default settings
