 
import {resolve} from "path"; 
 
import  * as ae from "../.." 
import { Query  , getType  ,allTypes  } from "../../.."

export interface QueryParams {
    multi : boolean
} 
export interface AEHelper {

     
     

 
    addToGlobal(id: string, object: any) : void
    getItem(query: string , params : QueryParams ) : Query
    joinPath(...paths:string[]) : File  
    getAllLayers(byType?:string): Layer[]
    toArray( collection : Collection | PropertyGroup   ) :   [] 
    
}