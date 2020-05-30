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
    in_array : (value:string ) => boolean
    first : ()=> T 
  }
  declare function importFootage(path:string,importAs?:ImportAsType) : FootageItem 
  declare function openProject(path: string): Project
  declare function convertPath(path: string): File
  var File: FileConstructor = {} as FileConstructor
  declare function toArray<T>(items: Collection | Query | PropertyGroup | allTypes | any): T[]
  declare function has(object: allTypes | Array, key: string, type: string): boolean
  declare function getReflection(object: allTypes | Array): ReflectionInfo
  declare function getValue<T>(obj: allTypes | Array, key: string): T
  declare function open(file: string): [Project]
  declare function close(closeOptions?: CloseOptions): boolean
  declare function getLayersByName(name:string, context? : CompItem , regex?: RegExp) : Layer[] 
  declare function getLayersByName(name:string, regex?: RegExp) : Layer[] 

  declare function getCompsByName(name:string, regex?:Regexp) : CompItem[] 
  declare class Observable<T>{
    create<T>(items: T): Observable<T>
    doOnFinal: (cb: () => void) => Observable<T>
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
  declare class OperatorFunction<T extends Observable, A> {
    filter: (callback: (value: T, index: number, array: T[]) => boolean) => A
    map: (callbackfn: (value: T, index: number, array: T[]) => A) => A
    sink: (callbackfn: (array: T[]) => A) => A
    flatMap: (callback: (value: T, index: number, array: T[]) => U, thisArg?: any) => U[]  
  }
  declare function create<T>(items: T): Observable<T>
  declare function fromProject(path?: string, autoClose?: boolean): Observable<Project>
  declare function fromLayers(compItem: CompItem): Observable<Layer[]>
  declare const get: get = {} as get
  declare const ae: ae = {} as ae
  const ops: Operators = {} as Operators
  declare class Renderer {
    constructor(compItem)  
    getRenderTemplates : () => string[] 
    getOutputTemplates : () => string[] 
    getRQItem : ()=> RenderQueueItem
    applyTemplate : (name:string) => void 
    setOutputFile : (path:string ) => void 
     

  }
  declare function render () : void 
}
interface options {
  debug?: {
    enabled?: boolean,
    dir?: string | undefined
  },
  multi?: boolean,
  noui?: boolean,
  minify?: boolean,
  program?: string
  includes : string[]
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
  addInclude : (path:string) => void 
}
export interface options {
  debug?: {
    enabled?: boolean,
    dir?: string | undefined
  },
  multi?: boolean,
  noui?: boolean,
  minify?: boolean,
  program?: string
  includes?: string[]
  errorHandling?: boolean
  testing?: boolean
  commandSavePath?: string
}
export const options: options
export function executeSync<P, R>(fn: (args: P) => R, params?: P): R
export function execute<T, E>(fn: (param: T) => E, param: T): Promise<E>
export function execute(fn: () => void): void
export function compile(fn: () => any): string
export function create<T>(fn: () => any, path: string): Promise<T>
export function createSync(fn: () => any, path: string): void
export class Command {

  constructor(fn: (name: string) => void)
}

export declare interface Query extends Function {
  (): (selection: string) => Query
  first: allTypes | null
  each<T extends allTypes>(callback: (item: T, index: number) => void): Query
  set<T>(prop: String, value: T): void
  selection<T>(index: number | undefined): T[];
  toArray<T>(): T[]
  children(): Query;

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
export declare function is(value: any, ...checkCls: any): boolean
export declare interface get extends Function {
  (): Query
  comps(selector?: allSelectorTypes): Query

  items(selector?: allSelectorTypes): Query
  sources(selector?: allSelectorTypes): Query
  folders(selector?: allSelectorTypes): Query

  footage(selector?: allSelectorTypes): Query

  layers(context?: LayerCollection, selector?: allSelectorTypes): Query

  props(context?: AVLayer | TextLayer, selector?: allSelectorTypes): Query
  root(selector?: allSelectorTypes): Query

}



