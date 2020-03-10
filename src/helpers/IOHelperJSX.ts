 
import {resolve} from "path"; 
 
import  * as ae from "../.." 
import { Query  , getType  ,allTypes  } from "../.."

import {QueryParams , AEHelper} from "./Interfaces/AEHelper"
import {IOHelper , File } from "./Interfaces/IOHelper"
let get : getType = {} as getType

ae.createSync(() => {
    let scriptId = "IOHelper" 
    let IOHelperImpl : IOHelper =  {

        getFile : (path:string) => {
            
            let cPath = this.convertPath(path) 
            return new File(path)
        } , 
        convertPath : (path:string) => {

            let regexStart = new RegExp(/^([C-Z]):/m)
        
            return  path.replace(regexStart,  (match,_1)=>{
                  return "/"+_1;
            }) ;
        } , 
        importFiles : (files:string[]) =>  {

            let footageItems : FootageItem[] = []
            files.forEach(file =>{

                let converted = this.convertPath(file) 
                let importOptions = new ImportOptions(new File(converted))
                
                let importedFile = app.project.importFile( importOptions)  as FootageItem
                footageItems.push(importedFile)
            })
            return footageItems
        }, 

        importFile:(file:string)=> this.importFiles([file])[0]
          
    } 
       
    
  $.global[scriptId] =  IOHelperImpl
},  resolve(__dirname,".."   ,   "lib" , "includes"  , "AEHelper.jsx"))
