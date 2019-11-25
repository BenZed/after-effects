const path = require("path")
beforeAll(()=> {
    console.log("proccess cwd ")
    console.log(process.cwd())
    jasmine.program = process.cwd()
})