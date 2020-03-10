 
import {resolve} from "path"; 
 
import  * as ae from "../.." 
import { Query  , getType  ,allTypes  } from "../../.."
 

export interface CompHelper {

    get  : {
        layers : (layerType?: string  ) => Layer[] 
    } 

}