export interface  I_File extends   FileConstructor  {}
export interface I_IOHelper {

    getFile(path:string) : File 
    convertPath(path:string) : string 
    importFile(file:string ) : FootageItem 
    importFiles(files:string[]) : FootageItem[] 
    joinPath(...paths:string[]) : File  
}

export interface I_CompHelper {

    get  : {
        layers : (layerType?: string[]  ) => Layer[] 
    } 

}

export interface QueryParams {
    multi : boolean
} 
export interface I_ProjectHelper {

     
     

 
 
  
   
 
    toArray( collection : Collection | PropertyGroup   ) :   [] 
    
}