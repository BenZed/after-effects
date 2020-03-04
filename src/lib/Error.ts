import {resolve} from "path"; 
 
import  * as ae from "../.." 
import AEHelperInterface from "./AEHelper"
import { Query  , get as getT   ,allTypes  } from "../.."
import { userInfo } from "os";
const File : FileConstructor = <FileConstructor>{}
const packageName = "error.jsx"
export interface QueryParams {
    multi : boolean
}
enum   ErrorEnumDecleration  {
    IS_NOT_COLLECTION = "IS NOT COLLECTION"
}
export default ErrorEnumDecleration 
ae.options.includes = []

const AEHelper = {} as AEHelperInterface
ae.createSync(() => {

    enum ErrorEnum  {
        IS_NOT_COLLECTION = "IS NOT COLLECTION" 
    }
    $.global["ErrorEnum"] = ErrorEnum 

     
},  resolve(__dirname,".." , ".." ,   "lib" , "includes"  , packageName))