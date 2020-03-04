import {resolve} from "path"; 
 
import  * as ae from ".." 
import { Query  , get as getT   ,allTypes  } from ".." 
import { fstat, lstat ,  } from "fs";


class App<T>  {

    private includes : string[]    
    private params : T  
    constructor(){
        if(ae.options.includes){
            this.includes = ae.options.includes
        }else {
            this.includes = []
        }
        this.params = {} as T 
       
    }

    setParams (params: T) {
        this.params  = params 
    }
    getParams(): T {
        return this.params
    }
    resetIncludes(){
        this.includes = []
    }
    async addInclude(path: string ) {
        
        let file = await lstat(path,(err,stats) => {
            if(stats.isFile()){
                this.includes.push(path)
            }
        })
        
    }

    execute<E>(fn:(param:T)=> E):Promise<E> {

        ae.options.includes = this.includes  
         
       return  ae.execute(fn,this.params)
     }

     executeX(fn:()=>void):void   {

        ae.options.includes = this.includes  

       return  ae.execute(fn)
     }  

     executeWithParams<T,E>(fn:(param:T)=> E, params: T ):Promise<E> {

        ae.options.includes = this.includes  
         
       return  ae.execute(fn,params)
     }




}