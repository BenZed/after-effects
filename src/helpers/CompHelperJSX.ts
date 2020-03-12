import { layerTypes } from './../../index.d';
 
import {resolve} from "path"; 
 
import  * as ae from "../.." 
import { Query  , getType  ,allTypes  } from "../.."

import {I_CompHelper ,QueryParams , I_ProjectHelper , InsertOptions } from "./Interfaces"
const  get : getType = {} as getType
const File : FileConstructor = {} as FileConstructor
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
                    strecth  : 1 , 
                    isStill : false , 
                    order : 0 , 
                    startTime: 0 , 
                    endTime : -1  
                    
                }as InsertOptions) => {
                    const strech = checkStrech(options.strecth )
                    const footage = options.importedFile  
                    let footageToComp = footage.duration / comp.duration 
                    if(footageToComp < 1){
                        // footage shorter than the comp 
                   //     let remaining = Math 1 - footageToComp 

                    }
                    return null 
                } 
         } 
    } 
       
   
  $.global[scriptId] =  HelperImpl
},  resolve(__dirname,".."  ,".." , "lib", "includes"   ,"helpers" , "2_CompHelper.jsx"))
