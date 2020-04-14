
export interface ValuesAtTime<T>  {
    values : ValueAtTime<T>[]
}
export interface ValueAtTime<T>  {

    
    time : number , 
    value : T  
}
let AudioSpectrumMeta  = {

    "Audio Layer" : PropertyValueType.LAYER_INDEX , 
    "Start Point" : PropertyValueType.TwoD , 
    "End Point" : PropertyValueType.TwoD , 
    "Path" : undefined , 
    "Use Polar Path" : Boolean , 
    "Start Frequency" : Number, 
    "End Frequency"  : Number ,  
    "Maximum Height" : Number , 
    "Audio Duration" : Number , 
    "Audio Offset" : Number , 
    "Thickness" : Number, 
    "Softness" : Number  , 
    "Inside Color" : Number 
               
} 

interface Spatial2d {

    x : number , 
    y : number 
}
