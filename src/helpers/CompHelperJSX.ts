import { layerTypes } from './../../index.d';
 
import {resolve} from "path"; 
 
import  * as ae from "../.." 
import { Query  , getType  ,allTypes  } from "../.."
 
import {I_CompHelper ,QueryParams , I_ProjectHelper } from "./Interfaces"
const  get : getType = {} as getType
ae.options.includes  =[]

ae.createSync(() => {
    let scriptId = "CompHelper" 
    let HelperImpl : I_CompHelper =  {

         get : {
             layers : (layerTypes? : string[] ) => {

                let comps = get.layers() 
                if(layerTypes == null ){
                    layerTypes = []
                }
                let selected : Layer[] = []
                for(let i = 0 ; i != comps.count(); i++){
                    let layer = comps.selection(i) as Layer 
                    if(layerTypes.length < 1 ){
                            selected.push(layer)
                    }else {
                        layerTypes.filter(t => t == layer.matchName).length > 0 ? selected.push(layer) : null 
                    }
                }
                return selected
             }
         }
    } 
       
    
  $.global[scriptId] =  HelperImpl
},  resolve(__dirname,".."  ,".." , "lib", "includes"   ,"helpers" , "2_CompHelper.jsx"))
