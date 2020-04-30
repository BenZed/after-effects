
const os  = require("os")
const path = require("path")
export const debugScript   = (command , jsx_script , jsx_script_file) => {


    if(!command.options.debug.enabled) return 0 
    let fileName = path.baseName(jsx_script_file) 
    let path = ( typeof command.options.debug.dir != undefined)   ? command.options.debug.dir  : os.homedir()   
    let savePath = path.join(path,fileName)
    
    fs.writeFileSync(savePath, jsx_script, 'utf-8');

    
}