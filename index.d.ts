/// <reference types="types-for-adobe/AfterEffects/2018"  />
 
 
export type allTypes = CompItem|FootageItem|FolderItem|AVLayer| ShapeLayer| TextLayer| LightLayer| CameraLayer|Property|PropertyGroup;
export type allCollectionTypes = CompItem[]|FootageItem[]|FolderItem[]|AVLayer[]| ShapeLayer[]| TextLayer[]| LightLayer[]| CameraLayer[]|Property[]|PropertyGroup[];
export type layerTypes = AVLayer| ShapeLayer|TextLayer| LightLayer| CameraLayer
export type allSelectorTypes = string|RegExp | Function | Number
export type allContexts = ItemCollection|LayerCollection|[]

declare type ES3Object= Object 

 




 
 export   interface  options {
      /**
       * @description If true, the code will be minified before being sent to After Effects. This is disabled by default, which is different from previous versions of this package. I feel there's little point in spending the extra time to minify code that isn't going over a network. Still, you can set minify to true if you're into that sort of thing.
       */
      multi? : boolean , 
      noui? : boolean , 
      minify? : boolean ,
      /**
       * @description By default, ae will look for an After Effects installation in your platforms default application directory. If you've installed it elsewhere, you'll have to set this to the custom app directory.
       */ 
      program? : string 
      /**
       *  @description Includes is an array which will concatanate the code from other files into your command, for use inside After Effects
       *  @default console.js Provides console.log to the After Effects namespace. 'console.log' inside After Effects will return logs to the node.js console when execution is complete, assuming you correctly have Preferences -> General -> Allow Scripts to Write Files and Access Network set inside After Effects.
       *  @default es5-shim.js The javascript environment within After Effects is very dated, pre ES5. With es5-shim included, methods and functions available in es5 will be available.
       * @default get.js Provides a jQuery inspired selector object to work with items in After Effects inside of an object called 'get' 
       */
      includes? : string[  ]
      /**
       * @description  With errorHandling enabled, errors thrown in After Effects will be suppressed and returned in the promise result:
         @description  With errorHandling disabled, After Effects will create a popup and prevent further code execution until it is dealt with
       */ 
     errorHandling? : boolean 
     testing? : boolean 
     commandSavePath? : string
    }
    export const options  : options  
   // function execute<T,R>( fn:(args:T) => void    ) :Promise<void>  
     export  function executeSync<T>( fn:(args:T) => void   ) :void 
     export function execute<T,E>(fn:(param:T)=> E , param:T):Promise<E> 
     export  function execute(fn:()=>void):void  
     export function compile(fn :()=> any):string 
     export  function create<T>(fn :()=> any , path : string):Promise<T>
     export  function createSync(fn:()=> any,path:string) :void 
     export  class  Command  {

        /**
         * 
         * @param name of the script  
         */
        constructor( fn:(name:string)=>void)
   
      }


    
/** jsx helpers */
/** get api  */
export declare class Query {
  /**
   * 
   * @param callback apply function to iterate over query result  
   * 
   */
  each<T extends allTypes>(callback:(item:T ,index:number)=>void):Query 
  set<T>(prop:String , value : T ) : void 
  /**
   * 
   * @param index get item from collection 
   */
  selection(index:number) :allTypes; 
  children() : Query; 
  /**
   * 
   * @param prop string  
   */

  get<T>(prop:string) : T;

 
  
}
/**
* 
* @param value 
* @param checkCls  
*/
export declare function is(value : any , ...checkCls: any  ) : boolean
/**
* general get module 
*/
export declare module  get { 
  
 
 /**
       * @description selects CompItem from a project 
       * @param item
       * @param context 
       * @param selector 
       * @returns Query 
       */
  function   comps(  selector?:allSelectorTypes):Query 
      
      /**
       * 
       * @param item 
       * @param context 
       * @param selector 
       * @returns Query 
       */
    function   items( selector?:allSelectorTypes):Query 
      /**
       * 
       * @param item 
       * @param context 
       * @param selector
       * @returns Query  
       */
      function      sources( selector?:allSelectorTypes):Query 
      /**
       * 
       * @param item 
       * @param context 
       * @param selector
       * @returns Query  
       */
    function   folders(  selector?:allSelectorTypes):Query 
      

      /**
       * 
       * @param item 
       * @param context 
       * @param selector
       * @returns Query  
       */
        function  footage( selector?:allSelectorTypes):Query 

      /**
       * 
       * @param item 
       * @param context 
       * @param selector
       * @return Query  
       */
     function   layers( context?:LayerCollection, selector?:allSelectorTypes):Query 
      /**
       * 
       * @param item 
       * @param context 
       * @param selector
       * returns Query  
       */
      function  props(  context?:AVLayer  | TextLayer  , selector?:allSelectorTypes):Query 
     /**
      * 
      * @param selector 
      * @returns Query 
      */
     function  root(selector?:allSelectorTypes):Query

      
}
/**
* @returns all items in the project 
*/
export declare function get(selector? : allSelectorTypes) :Query 
   

 /*
 export interface AEHelper   {
  convertPath(path:string) : string 
  getFile(path:string): File

  
  addToGlobal(id: string, object: any) : void
  getItem(query: string ) : Query
  joinPath(...paths:string[]) : File  
 
  toArray( collection : Collection | PropertyGroup   ) :   [] 
}
*/ 
export type File = FileConstructor



