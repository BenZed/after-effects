import {resolve} from "path"
import  * as ae from "../.." 
import { Query  , get as getT   ,allTypes  } from "../.."
const File : FileConstructor = <FileConstructor>{}

export interface QueryParams {
    multi : boolean
}
 
 

export default interface  get2  {
     comps(name : string ) : [] 
     layers( name : string , context : CompItem | null ) : []      

} 
 
const get   : getT   = {} as getT 
ae.options.includes = []
 
ae.createSync(() => {


    class GetImplementation implements GetInterface{


    }

    let  _AEHelper = new AEHelperImpl()
    _AEHelper.addToGlobal("AEHelper",_AEHelper)


}, resolve(__dirname,".." , ".." ,   "lib" , "includes"  , "get.jsx"))