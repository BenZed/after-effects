import  * as ae from ".."
import {resolve} from "path"
import AEHelperInterface from "../src/lib/AEHelper"
import {expect} from "chai"

ae.options.debug = true 
const TestProject =  resolve(".","ae-templates","sample-project.aep")
const AEHelper : AEHelperInterface = {} as AEHelperInterface
describe("Test for component Finder spec" ,() =>[



    it("simply #comp returns comp with name 'Comp 1'",  async (done)=>{

let result =     await    ae.execute((params)=>{

            let projectFile = AEHelper.getFile(params.projectFile)
            let project1 = app.open(projectFile)  
            
           let comp1 =   AEHelper.getItem("#Comp1", {
                 multi:false 
             })
             return {
                 length : comp1.length , 
                 file : projectFile.name
             }
            
        } ,{
            projectFile : TestProject
        })
        await new Promise(resolve => setTimeout(resolve, 5000));
        expect(result.length).not.be.null
    })
])