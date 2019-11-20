
import  * as ae from ".." 
import {expect} from "chai"
 
describe("Basic Tests", ()=>{


 it("Memory should gt 0 " , async () => {
    
    
    console.log(ae)
    let mem = await   ae.execute<string,number>(() => {
        
        
        return app.memoryInUse 
    }, "test") 
    expect(mem).to.greaterThan(0,"memory should be greater than 0 ") 

 })
})