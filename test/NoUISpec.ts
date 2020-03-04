
import  * as ae from ".." 
import {options } from ".."
import {expect} from "chai"
import { dirname } from "path"
import path from "path" 


describe("Basic Tests", ()=>{

    beforeEach( () => ae.options.noui = true )  
    afterEach( () => ae.options.noui = false  )  


xit("Memory should gt 0 " , async () => {
  
    
    //let file = path.resolve(dirname(__filename) , ".." , "Program" , "AfterEffects" , "App" , "Ae"  , "Support Files" ) 

    // ae.options.program = file 
     
    let mem = await   ae.execute<string,number>(() => {
        
      
        return app.memoryInUse 
    }, "test")  
     
    expect(mem).to.greaterThan(0,"memory should be greater than 0 ") 

 })
 
  
})