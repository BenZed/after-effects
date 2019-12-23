import {allTypes , allSelectorTypes} from "../.."

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