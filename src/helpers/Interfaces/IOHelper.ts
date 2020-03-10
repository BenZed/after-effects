

import {resolve} from "path"; 
 
import  * as ae from "../.." 
import { Query  , getType  ,allTypes  } from "../../.."

export const File : FileConstructor = <FileConstructor>{}
export interface IOHelper {

    getFile(path:string) : File 
    convertPath(path:string) : string 
    importFile(file:string ) : FootageItem 
    importFiles(files:string[]) : FootageItem[] 
}