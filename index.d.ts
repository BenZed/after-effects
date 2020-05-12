// @ts-nocheck
/// <reference types="types-for-adobe/AfterEffects/2018"  />


export type allTypes = CompItem | FootageItem | FolderItem | AVLayer | ShapeLayer | TextLayer | LightLayer | CameraLayer | Property | PropertyGroup;
export type allCollectionTypes = CompItem[] | FootageItem[] | FolderItem[] | AVLayer[] | ShapeLayer[] | TextLayer[] | LightLayer[] | CameraLayer[] | Property[] | PropertyGroup[];
export type layerTypes = AVLayer | ShapeLayer | TextLayer | LightLayer | CameraLayer
export type allSelectorTypes = string | RegExp | Function | Number
export type allContexts = ItemCollection | LayerCollection | []

declare type ES3Object = Object




declare global {
  interface Array<T> {
    flatMap: <U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any) => U[]
    sink: <U> (callbackfn: (array: T[]) => U, thisArg?: any) => U
    has: (value: string) => boolean
  }

  declare function convertPath(path: string): File
  var File: FileConstructor = {} as FileConstructor
  declare function toArray<T>(items: Collection | Query | PropertyGroup | allTypes | any): T[]
  declare function has(object: allTypes | Array, key: string, type: string): boolean
  declare function getReflection(object: allTypes | Array): ReflectionInfo
  declare function getValue<T>(obj: allTypes | Array, key: string): T
  declare function open(file: string): [Project]
  declare function close(closeOptions?: CloseOptions): boolean
  declare class Observable<T>{
    create<T>(items: T): Observable<T>
    doOnFinal : (cb:() => void) => Observable<T> 
    //pipe_single<R>(fn: (value: T) => R): Observable<R>

     
    subscribe(subsFn: (value: T) => void, errorFn?: (err: Error) => void, completeFn?: (() => void))
    pipe<A>(op1: OperatorFunction<T, A>): Observable<A>;
    pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): Observable<B>;
    pipe<A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): Observable<C>;
    pipe<A, B, C, D>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>): Observable<D>;
    pipe<A, B, C, D, E>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>): Observable<E>;
    pipe<A, B, C, D, E, F>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>): Observable<F>;
    pipe<A, B, C, D, E, F, G>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>): Observable<G>;
    pipe<A, B, C, D, E, F, G, H>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>): Observable<H>;
    pipe<A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>): Observable<I>;
    pipe<A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>, ...operations: OperatorFunction<any, any>[]): Observable<{}>;
 
  }

  declare class OperatorFunction <T extends Observable,A> {
    filter: (callback: (value: T, index: number, array: T[]) => boolean) =>  A 
    map: (callbackfn: (value: T, index: number, array: T[]) => A) => A
    sink: (callbackfn: (array: T[]) => A) => A
    flatMap : (callback: (value: T, index: number, array: T[]) => U, thisArg?: any) => U[])
  }
  declare function create<T>(items: T): Observable<T>
  declare function fromProject(path?: string , autoClose?:boolean): Observable<Project>
  declare function fromLayers(compItem: CompItem): Observable<Layer[]>
  declare const get: get = {} as get
  declare const ae: ae = {} as ae

  const ops: Operators = {} as Operators


}

interface options {

  debug?: {
    enabled?: boolean,
    dir?: string | undefined
  },
  /**
     * 
     * @description If true, the code will be minified before being sent to After Effects. This is disabled by default, which is different from previous versions of this package. I feel there's little point in spending the extra time to minify code that isn't going over a network. Still, you can set minify to true if you're into that sort of thing.
     */
  multi?: boolean,
  noui?: boolean,
  minify?: boolean,
  /**
   * @description By default, ae will look for an After Effects installation in your platforms default application directory. If you've installed it elsewhere, you'll have to set this to the custom app directory.
   */
  program?: string
  /**
   *  @description Includes is an array which will concatanate the code from other files into your command, for use inside After Effects
   *  @default console.js Provides console.log to the After Effects namespace. 'console.log' inside After Effects will return logs to the node.js console when execution is complete, assuming you correctly have Preferences -> General -> Allow Scripts to Write Files and Access Network set inside After Effects.
   *  @default es5-shim.js The javascript environment within After Effects is very dated, pre ES5. With es5-shim included, methods and functions available in es5 will be available.
   * @default get.js Provides a jQuery inspired selector object to work with items in After Effects inside of an object called 'get' 
   */
  includes?: string[]
  /**
   * @description  With errorHandling enabled, errors thrown in After Effects will be suppressed and returned in the promise result:
     @description  With errorHandling disabled, After Effects will create a popup and prevent further code execution until it is dealt with
   */
  errorHandling?: boolean
  testing?: boolean
  commandSavePath?: string
}
interface ae {

  options: options
  executeSync: <P, R>(fn: (args: P) => R, params?: P) => R
  execute: <T, E>(fn: (param: T) => E, param: T) => Promise<E>
  execute: (fn: () => void) => void
  compile: (fn: () => any) => string
  create: <T>(fn: () => any, path: string) => Promise<T>
  createSync: (fn: () => any, path: string) => void

}
export interface options {

  debug?: {
    enabled?: boolean,
    dir?: string | undefined
  },
  /**
     * 
     * @description If true, the code will be minified before being sent to After Effects. This is disabled by default, which is different from previous versions of this package. I feel there's little point in spending the extra time to minify code that isn't going over a network. Still, you can set minify to true if you're into that sort of thing.
     */
  multi?: boolean,
  noui?: boolean,
  minify?: boolean,
  /**
   * @description By default, ae will look for an After Effects installation in your platforms default application directory. If you've installed it elsewhere, you'll have to set this to the custom app directory.
   */
  program?: string
  /**
   *  @description Includes is an array which will concatanate the code from other files into your command, for use inside After Effects
   *  @default console.js Provides console.log to the After Effects namespace. 'console.log' inside After Effects will return logs to the node.js console when execution is complete, assuming you correctly have Preferences -> General -> Allow Scripts to Write Files and Access Network set inside After Effects.
   *  @default es5-shim.js The javascript environment within After Effects is very dated, pre ES5. With es5-shim included, methods and functions available in es5 will be available.
   * @default get.js Provides a jQuery inspired selector object to work with items in After Effects inside of an object called 'get' 
   */
  includes?: string[]
  /**
   * @description  With errorHandling enabled, errors thrown in After Effects will be suppressed and returned in the promise result:
     @description  With errorHandling disabled, After Effects will create a popup and prevent further code execution until it is dealt with
   */
  errorHandling?: boolean
  testing?: boolean
  commandSavePath?: string
}
export const options: options
// function execute<T,R>( fn:(args:T) => void    ) :Promise<void>  
export function executeSync<P, R>(fn: (args: P) => R, params?: P): R
export function execute<T, E>(fn: (param: T) => E, param: T): Promise<E>
export function execute(fn: () => void): void
export function compile(fn: () => any): string
export function create<T>(fn: () => any, path: string): Promise<T>
export function createSync(fn: () => any, path: string): void
export class Command {

  /**
   * 
   * @param name of the script  
   */
  constructor(fn: (name: string) => void)

}



/** jsx helpers */
/** get api  */
export declare interface Query extends Function {

  (): (selection: string) => Query

  first: allTypes | null
  /**
   * 
   * @param callback apply function to iterate over query result  
   * 
   */
  each<T extends allTypes>(callback: (item: T, index: number) => void): Query
  set<T>(prop: String, value: T): void
  /**
   * 
   * @param index get item from collection 
   */
  selection<T>(index: number | undefined): T[];
  toArray<T>(): T[]
  children(): Query;
  /**
   * 
   * @param prop string  
   */

  get<T>(prop: string): T;

  count(): number;
  types(): string[]
  filter(selector: allSelectorTypes): Query
  comps(selector?: allSelectorTypes): Query
  items(selector?: allSelectorTypes): Query
  sources(selector?: allSelectorTypes): Query
  folders(selector?: allSelectorTypes): Query
  footage(selector?: allSelectorTypes): Query
  root(selector?: allSelectorTypes): Query

  props(context?: AVLayer | TextLayer, selector?: allSelectorTypes): Query

}
/**
* 
* @param value 
* @param checkCls  
*/
export declare function is(value: any, ...checkCls: any): boolean
/**
* general get module 
*/
export declare interface get extends Function {

  (): Query
  /**
        * @description selects CompItem from a project 
        * @param item
        * @param context 
        * @param selector 
        * @returns Query 
        */
  comps(selector?: allSelectorTypes): Query

  /**
   * 
   * @param item 
   * @param context 
   * @param selector 
   * @returns Query 
   */
  items(selector?: allSelectorTypes): Query
  /**
   * 
   * @param item 
   * @param context 
   * @param selector
   * @returns Query  
   */
  sources(selector?: allSelectorTypes): Query
  /**
   * 
   * @param item 
   * @param context 
   * @param selector
   * @returns Query  
   */
  folders(selector?: allSelectorTypes): Query


  /**
   * 
   * @param item 
   * @param context 
   * @param selector
   * @returns Query  
   */
  footage(selector?: allSelectorTypes): Query

  /**
   * 
   * @param item 
   * @param context 
   * @param selector
   * @return Query  
   */
  layers(context?: LayerCollection, selector?: allSelectorTypes): Query
  /** 

  * @param item 
  * @param context 
  * @param selector
  * returns Query  
  */
  props(context?: AVLayer | TextLayer, selector?: allSelectorTypes): Query
  /**
   * 
   * @param selector 
   * @returns Query 
   */
  root(selector?: allSelectorTypes): Query


}




/*
export declare  interface  commons {

  convertPath : (path:string) => File
  toArray : <T> (items : Collection | Query | PropertyGroup | allTypes | any ) => T[]
  has : (object :allTypes | Array  , key:string  ) => boolean
  reflect : (object:allTypes | Array ) => ReflectionInfo
  get : <T>(obj:allTypes | Array, key :string ) => T
  from$ : <T>(...params : T) => T[]
}
*/


