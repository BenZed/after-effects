import { I_ProjectHelper } from './Interfaces/I_ProjectHelper';
 
 
 
import {resolve} from "path"; 
 
import  * as ae from "../.." 
import { Query  , getType  ,allTypes  } from "../.."
const File : FileConstructor = <FileConstructor>{}
 
const ProjectHelper : I_ProjectHelper = {} as I_ProjectHelper
const  get : getType = {} as getType
ae.options.includes  =[]
ae.createSync(() => {
    
      class AEHelperImpl implements I_ProjectHelper  {
        private globalRegistry:Array<String>  = []
       
         
        
       
      
         
            
        
          getFromEffects(remainChar: string, context: any): PropertyBase {
             
            
            if(! (context instanceof AVLayer)){

                throw new Error("context is not a layer " + context)
            }
           return  (<AVLayer>context).effect(remainChar)
          }
          
         
          
          toArray( collection : Collection | PropertyGroup    ) :   []{

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
   let  _PHelper = new AEHelperImpl()
    _PHelper.addToGlobal("ProjectHelper",_PHelper)
},  resolve(__dirname,".."  ,".." ,   "lib" ,"includes" ,"helpers" , "0_ProjectHelper.jsx"))
