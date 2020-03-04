import {resolve} from "path"
import  * as ae from "../.." 
import { Query  , get as getT   ,allTypes  } from "../.."
const File : FileConstructor = <FileConstructor>{}

export interface QueryParams {
    multi : boolean
}
type   callbackType  =  (items : allTypes) => []
export default interface  GetInterface   {
      
    comps : (name : string | callbackType    , first? : boolean ) => CompItem[] | null  
    layers : (name : string | callbackType  , first? :boolean , comp? : CompItem  )  => Layer[] | null 
    
    

} 

 
ae.options.includes = []
 
ae.createSync(() => {


    class GetImplementation implements GetInterface{
         
        comps(name : string | callbackType   , first? : boolean ) { 

             if(typeof name == "string" ){


                
                app.project.items.filter 
             }

        } 
    }

    let  _AEHelper = new AEHelperImpl()
    _AEHelper.addToGlobal("AEHelper",_AEHelper)


}, resolve(__dirname,".." , ".." ,   "lib" , "includes"  , "get.jsx"))