import { I_ProjectHelper } from './Interfaces' 
 
 
import {resolve} from "path"; 
 
import  * as ae from "../.." 
import { Query  , getType  ,allTypes  } from "../.."
import { userInfo } from 'os';
const File : FileConstructor = <FileConstructor>{}
 
const ProjectHelper : I_ProjectHelper = {} as I_ProjectHelper
const  get : getType = {} as getType
ae.options.includes  =[]
ae.createSync(() => {
    
      const  ProjectHelperImpl :  I_ProjectHelper =  {
       
          toArray : ( collection : Collection | PropertyGroup    ) :   []=>{

            let array :   [] = [] 
            // @ts-ignore
            let length = collection.hasOwnProperty("numProperties") ?  collection.numProperties  :  collection.length 
             
            for(let i = 1 ; i != length + 1  ; i++){
                    let reflection : Reflection
                    // @ts-ignore
                     array.push(collection[i].name) 
                   }
                return array 

          } ,
          removeLayer : (layerType : string = "ADBE Text Layer")  =>{
              
              let layers = get.layers()
              for(let i = 0 ; i != layers.length ; i++){
                let layer = layers.selection(i) as Layer
                if(layer.matchName == layerType) {
                    layer.remove()
                }
              }
          }
        

          

         

       
    }
   
  $.global["ProjectHelper"] = ProjectHelperImpl
},  resolve(__dirname,".."  ,".." ,   "lib" ,"includes" ,"helpers" , "0_ProjectHelper.jsx"))
