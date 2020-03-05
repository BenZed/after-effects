 
 
 
import {resolve} from "path"; 
 
import  * as ae from ".." 
import { Query  , getType  ,allTypes  } from ".."
const File : FileConstructor = <FileConstructor>{}

export interface QueryParams {
    multi : boolean
}
export default interface AEHelperInterface  {
    convertPath(path:string) : string 
    getFile(path:string): File

    File(path:string) : File 
    addToGlobal(id: string, object: any) : void
    getItem(query: string , params : QueryParams ) : Query
    joinPath(...paths:string[]) : File  
    getAllLayers(byType?:string): Layer[]
    toArray( collection : Collection | PropertyGroup   ) :   [] 
    import(file:string ) : FootageItem 
    importFiles(files:string[]) : FootageItem[] 
   
} 
 
const get   : getType  = {} as getType  
ae.options.includes = []
 
ae.createSync(() => {
    enum AETypes {

        CompItem  = "CompItem"   , 
        FolderItem = "FolderItem"
    }
      class AEHelperImpl implements AEHelperInterface {
        private globalRegistry:Array<String>  = []
        constructor(){
         
        }

         
        joinPath (...paths : string[]) : File  {

            paths.map( path => this.convertPath(path)) 

            return this.getFile(paths.join("/"))
            

        }
        convertPath   (path :string) : string   {

            let regexStart = new RegExp(/^([C-Z]):/m)
        
            var replacedString = path.replace(regexStart,  (match,_1)=>{
                  return "/"+_1;
            }) ;

            return replacedString;
        }
        File(path:string ){
            return this.getFile(path)
        } 
        getFile(path:string   ){

            path = this.convertPath(path)
            
            let file = new File(path) 

            return file ;  
        }
        addToGlobal(id: string, object: any){
           if(this.globalRegistry.filter(it => it == id).length > 0 ){
                throw new Error( `Cannot add ${id} , because before already registered to globals `)
            }
            this.globalRegistry.push(id) 
            $.global[id] = object 
        } 
            
        getItem<T>(query: string , params : QueryParams) : T {

             let  returnType : T  
            let splited = query.split(".") 

            let context :any  = null 
            splited.every(it => {

        
                let firstChar = it.slice(0,1)  
                let remainChar = it.slice(1,it.length)
                switch(firstChar){
                    case "#" : 
                    //   context =  this.getFromComps(remainChar,context)
                        break  
                    case "!" : 
                      // context =  this.getFromLayers(remainChar,context) 
                        break 
                    case "&" : 
                        context = this.getFromEffects(remainChar,context) 

                }

                if(context == null){
                    return false 
                }
                    
            })

            returnType = context  as T 
            return returnType 

            
        }
          getFromEffects(remainChar: string, context: any): PropertyBase {
             
            
            if(! (context instanceof AVLayer)){

                throw new Error("context is not a layer " + context)
            }
           return  (<AVLayer>context).effect(remainChar)
          }
          getFromItems(remainChar: string, context: any): any {
              throw new Error("Method not implemented.");
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
          filter(array : [] , by : string  , type : string  ){
                // @ts-ignore
                array.map(value => { 
                    //@ts-ignore
                    let xml = (<Reflection>value.reflect).toXML() 
                    
                    //<Reflection>value.reflect).to 
                    return value 
                } )

          }

          getAllLayers(byType?:string){
            let comps = get.layers()
            if(byType == null){
                byType = "ADBE Text Layer" 
            }
            let selected : Layer[] = []
            for(let i = 0 ; i != comps.count(); i++){
                let layer = comps.selection(i) as Layer 
                if(layer.matchName == byType){
                        selected.push(layer)
                }
            }
            return selected 
        } 

        importFiles(files:string[]){

            let footageItems : FootageItem[] = []
            files.forEach(file =>{

                let converted = this.convertPath(file) 
                let importOptions = new ImportOptions(new File(converted))
                
                let importedFile = app.project.importFile( importOptions)  as FootageItem
                footageItems.push(importedFile)
            })
            return footageItems
        }

        import(file:string){
            let imports =  this.importFiles([file]) 
            if(imports.length<1)
                throw new Error(`cannot import file ${file}`)
                return imports[0]
            
        }

       
    }
   let  _AEHelper = new AEHelperImpl()
    _AEHelper.addToGlobal("AEHelper",_AEHelper)
},  resolve(__dirname,".."   ,   "lib" , "includes"  , "AEHelper.jsx"))
