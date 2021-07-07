import ae from ".."
import {exists, fstat, unlink, existsSync} from "fs"
import { expect } from "chai"
import {mkdirSync , readdirSync , unlinkSync} from "fs"
 
import { resolve, format, dirname } from "path"
describe("Test For Render System " , ()=>{

    beforeEach(()=>{
        ae.options.noui = true 
    })
    it("should output modules length > 0 " , (done) =>{


        ae.options.noui = true 
        ae.options.debug.dir = resolve(process.cwd(),"debug") 
        ae.options.debug.enabled  = true 
        let expectedOutputModule = "Lossless with Alpha"
        ae.execute(((params)=>{

           
            let project = openProject(params.projectFile) 
            let comp1 : CompItem= get.comps(/Comp 1/).first  as CompItem
            let renderer   = new Renderer(comp1) 
            let outputTemplates = renderer.getOutputTemplates()
             
            return {
                outputTemplates :  outputTemplates
            }
        }),{
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep")
        } ).then(result => {
            console.log(result)
            expect(result).not.to.be.undefined
            expect(result.outputTemplates).not.to.be.undefined
           
          
            expect(result.outputTemplates).to.include.members([expectedOutputModule])
            
            done()
        })

    })


    it("should render to photoshop files completed successfully " , (done) =>{


        ae.options.noui = true 
        ae.options.debug.dir = resolve(process.cwd(),"debug") 
        ae.options.debug.enabled  = true 
        let params = {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep") ,
            outputDir: resolve(__dirname,"..","tmp"), 
            outputFile : resolve(__dirname,"..","tmp" , "test1_[#####].png")
        }
        if(!existsSync(params.outputDir)){
            mkdirSync(params.outputDir) 
        }
        
        ae.execute(((params)=>{

            let expectedOutputModule = "Lossless With Alpha"
            let project = openProject(params.projectFile) 
            let comp1 : CompItem= get.comps(/Comp 1/).first  as CompItem
            
            let renderer   = new Renderer(comp1) 
            let outputTemplates = renderer.getOutputTemplates()
            renderer.applyTemplate("Photoshop")
            renderer.setOutputFile(params.outputFile)
            renderer.getRQItem().timeSpanDuration = 2 
            renderer.getRQItem().render  = true 
            render()
            app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)
        }
             
            
        ),{
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep") ,
            outputDir : resolve(__dirname,"..","tmp" ), 
            outputFile : resolve(__dirname,"..","tmp" , "test1_[#####].psd")
        } ).then(result => {  
            console.log(result)
            expect(result).to.be.undefined
             
            let psdFiles = readdirSync(params.outputDir).filter(file => file.endsWith("psd"))
            let psdFilesLength = psdFiles.length 
            psdFiles.forEach(file=> unlinkSync(resolve(params.outputDir,file)))
            expect(psdFilesLength).to.gt(10)

            done()
        })

    })     
    

})