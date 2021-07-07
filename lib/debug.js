
const os  = require("os")
const path = require("path")
const fs = require("fs")
const debugScript   = (command , jsx_script , jsx_script_file) => {


    if(!command.options.debug.enabled) return 0 
    let fileName = path.basename(jsx_script_file) 
    let homedir  = ( typeof command.options.debug.dir != undefined)   ? command.options.debug.dir  : os.homedir()   
    let savePath = path.join(homedir,fileName)
    
    fs.writeFileSync(savePath, jsx_script, 'utf-8');

    
}
module.exports = {
    debugScript 
}