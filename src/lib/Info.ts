import {resolve} from "path"; 
import ErrorEnumDecleration     from "./error" 
import  * as ae from "../.." 
import { Query  , get as getT   ,allTypes  } from "../.."
const File : FileConstructor = <FileConstructor>{}

export interface QueryParams {
    multi : boolean
}
export default interface InfoInterface  {
    isFile(item : any) : boolean 
   
    toArray( collection : Collection | PropertyGroup   ) :   [] 
} 
 
const get   : getT   = {} as getT 
ae.options.includes = [] 

const ErrorEnum = ErrorEnumDecleration
ae.execute(()=>{

    class InfoImplementation implements InfoInterface{

        isFile(item:Reflection){
            //item.isCollection 
            return item.properties.filter(key => key.name  == "encoding" ).length > 0 
        } 
    
        isCollection(item : any) {
        
            if(item.hasOwnProperty("length") && !item.hasOwnProperty("join")){
                return true 
            }
            
        }
        toArray( item :  any     ) :   []{

           let itemReflection : ReflectionInfo =  item.reflect  
           if(! itemReflection.isCollection ){
               throw new Error(ErrorEnum.IS_NOT_COLLECTION)
           }

           

            let array :   [] = [] 
            // @ts-ignore
            
            let length = collection.hasOwnProperty("numProperties") ?  collection.numProperties  :  collection.length 
             
            for(let i = 1 ; i != length + 1  ; i++){
                    let reflection : Reflection
                    // @ts-ignore
                     array.push(collection[i].name) 
                   }
                return array 

          }
    }

})
