
import  * as ae from ".." 
import { io , get } from ".."
import {expect} from "chai"

 
import {  readdirSync} from "fs" 
import {resolve} from "path"

const get : get = {} as get 
const io : io = {} as io
const File : FileConstructor = {} as FileConstructor 
  
describe("Basic Tests", ()=>{

   beforeEach( () => ae.options.noui = true )  
    afterEach( () => ae.options.noui = false  )  
 

it("Memory should gt 0 " ,  (done) => {
  
    
    //let file = path.resolve(dirname(__filename) , ".." , "Program" , "AfterEffects" , "App" , "Ae"  , "Support Files" ) 

    // ae.options.program = file 
     
       ae.execute<string,number>(() => {
        
      
        return app.memoryInUse 
    }, "test").then(mem => {

        expect(mem).to.greaterThan(0,"memory should be greater than 0 ")  
        done()
    })
     
   

 })
 
    it("should write debug info to debug" ,  ()=>{ 
     
        let debugDir = resolve(process.cwd() , "debug")
        let files = readdirSync(debugDir) 
        ae.options.debug.dir = debugDir 
        ae.options.debug.enabled =  true 
        
        ae.executeSync ((params)=>{
           console.log(params.projectFile)
            let file = io.convertPath(params.projectFile) 
        
            app.open( file ) 
            app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)
            
         
        },{
            projectFile : resolve(__dirname,"..","ae-templates","sample-project.aep")
        }) 

        let files2 = readdirSync(debugDir) 
     
        expect(files.length).to.be.eq(files2.length - 1)
    })
  
 
  
})