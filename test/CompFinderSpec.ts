import  * as ae from ".."
import {resolve} from "path"
import AEHelperInterface from "../src/ts/AEHelper"
import {expect} from "chai"
const TestProject =  resolve("..","ae-templates","sample-project.aep")
const AEHelper : AEHelperInterface = {} as AEHelperInterface
describe("Test for component Finder spec" ,() =>[



    it("simply #comp returns comp with name 'Comp 1'", (done)=>{

        ae.execute((params)=>{

             
            let project1 = app.open(AEHelper.getFile(params.projectFile))  
            expect(project1).not.be.null
             AEHelper.getItem("#Comp1", {
                 multi:false 
             })

            
        } ,{
            projectFile : TestProject
        })
    })
])