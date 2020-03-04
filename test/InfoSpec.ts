import  * as ae from ".."
import {resolve} from "path"
import AEHelperInterface from "../src/lib/AEHelper"
import Info from "../src/lib/Info" 


import {expect} from "chai"

let builtinIncludes = ae.options.includes  as string[]

let mergedInclues = [...builtinIncludes , resolve("..", "lib/includes/error.jsx")] 
ae.options.includes = 
ae.options.debug = true 
const TestProject =  resolve(".","ae-templates","sample-project.aep")


const AEHelper : AEHelperInterface = {} as AEHelperInterface
describe("Info Tests", () => {

    it("should detect collection " , (done)=>{



    })

})