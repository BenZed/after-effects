
 
import {resolve} from "path"; 
 
import  * as ae from "../.." 
import {  getType   } from "../.."

 
import {I_IOHelper , I_File } from "./Interfaces"
const  get : getType = {} as getType
const  File : I_File = {} as I_File
ae.options.includes  =[]
const IOHelper : I_IOHelper = {} as I_IOHelper
/// IOHelper 
ae.createSync(() => {
    let scriptId = "IOHelper" 
    let IOHelperImpl : I_IOHelper =  {

        getFile : (path:string) => {
            
            let cPath = IOHelper.convertPath(path) 
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

                let converted = IOHelper.convertPath(file) 
                let importOptions = new ImportOptions(new File(converted))
                
                let importedFile = app.project.importFile( importOptions)  as FootageItem
                footageItems.push(importedFile)
            })
            return footageItems
        }, 

        importFile:(file:string)=> IOHelper.importFiles([file])[0] , 
        joinPath :(...paths : string[] ) => {
            paths.map( path => IOHelper.convertPath(path)) 

            return IOHelper.getFile(paths.join("/"))
        }
          
    } 
       
    
  $.global[scriptId] =  IOHelperImpl
},  resolve(__dirname,".." ,".."  ,   "lib" ,"includes"  ,"helpers" , "1_IOHelper.jsx"))

