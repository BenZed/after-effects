import { AEApp } from './../AEApp';
import { I_PropertyHelper } from './Interfaces' 
 
 
import {resolve} from "path"; 
import {D2ValueYType,D3ValueType, D1ValueType} from "./Interfaces"
import  * as ae from "../.." 
import { Query  , getType  ,allTypes  } from "../.."
import { userInfo } from 'os';
const File : FileConstructor = <FileConstructor>{}
const  get  = AEApp.get()

ae.options.includes  =[]
ae.createSync(() => {

    const PropertyHelper : I_PropertyHelper = {

        convertValue : (x, y? , z? ) => {
            if(typeof z != undefined && typeof y != undefined){
                return `[${x} , ${y} , ${z}]`
            }
            if(typeof y != undefined) {
                return `[${x} , ${y}}`
            }
            return `[${x}]`
            
          
        } , 
        getMetaPropValue  : (propValueType  : PropertyValueType , currentValue , comp : CompItem ) => {

            let layer : Layer  
            layer.index
                switch(propValueType) { 
                    case PropertyValueType.LAYER_INDEX : 
                        if(typeof currentValue == "number" ) {
                            return currentValue
                        }else if(typeof currentValue == "string"){
                            return get.layers(comp.layers,currentValue).selection(0)
                        }else {
                            throw Error("you must define property as index or layer name ")
                        }
                    case PropertyValueType.ThreeD: 
                    case PropertyValueType.ThreeD_SPATIAL : 
                        currentValue = currentValue as D3ValueType
                        return PropertyHelper.convertValue(currentValue.x , currentValue.y , currentValue.z)
                    case PropertyValueType.TwoD : 
                    case PropertyValueType.TwoD_SPATIAL:
                        currentValue = currentValue as D2ValueYType 
                        return PropertyHelper.convertValue(currentValue.x, currentValue.y)
                    case PropertyValueType.OneD : 
                          currentValue = currentValue as D1ValueType 
                        return PropertyHelper.convertValue(currentValue.x) 
                    break 
                }
        }
    }


    
},resolve(__dirname, "..", "..", "lib", "includes", "helpers", "0_PropertyHelper.jsx"))
 

 


