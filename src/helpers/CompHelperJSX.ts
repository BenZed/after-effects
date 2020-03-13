import { layerTypes } from './../../index.d';
 
import {resolve} from "path"; 
 
import  * as ae from "../.." 
import { Query  , getType  ,allTypes  } from "../.."

import {I_CompHelper ,QueryParams , I_ProjectHelper , InsertOptions } from "./Interfaces"
const  get : getType = {} as getType
const File : FileConstructor = {} as FileConstructor
const ProjectHelper : I_ProjectHelper = {} as I_ProjectHelper
ae.options.includes  =[]

ae.createSync(() => {

    const checkStrech  = (strech  : number) =>  {

        if(strech <  0 ){
            return 0 
        }
        if(strech >1 ) return 1 
    }


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
         },
         insert : {

                footage : (comp: CompItem , options: InsertOptions = { 
                   
                     
                    order : 0 , 
                    inPoint: 0 , 
                    outPoint : -1  
                    
                }as InsertOptions) => {

                    let layer = comp.layers.add(options.importedFile) 
                    layer.inPoint = 0 
                     if(options.outPoint > 0) {

                        layer.timeRemapEnabled  = true 
                        let propTimeRemap  = get.props(layer,"Time Remap").selection("")
                     }
                } 
         } 
    } 
       
   
  $.global[scriptId] =  HelperImpl
},  resolve(__dirname,".."  ,".." , "lib", "includes"   ,"helpers" , "2_CompHelper.jsx"))
