import ae from ".."

import { expect } from "chai"

import { readdirSync } from "fs"
import { resolve, format } from "path"


describe("Commons Tests", () => {
    
    beforeEach(() => ae.options.noui = true )
    afterEach(() => ae.options.noui = false)

    it(" should  used memory gt 0 ", (done) => {

        //let file = path.resolve(dirname(__filename) , ".." , "Program" , "AfterEffects" , "App" , "Ae"  , "Support Files" ) 
        // ae.options.program = file 
        ae.options.noui = true
        ae.options.debug.enabled = true

        ae.options.debug.dir = resolve(process.cwd(), "debug")
        ae.execute<string, number>(() => {

            return app.memoryInUse
        }, "test").then(mem => {
            expect(mem).to.greaterThan(0, "memory should be greater than 0 ")
            done()
        }).catch(e => {
            expect(true).to.be.false
            done()
        })

    })
    it("should  all items  array gt 1", (done) => {
        ae.options.noui = true
        let debugDir = resolve(process.cwd(), "debug")
        ae.options.debug.dir = debugDir
        ae.options.debug.enabled = true
        ae.execute((params) => {
            let file = convertPath(params.projectFile)
            app.open(file)
            let allItems = get().toArray()
            app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)
            return {
                itemsSize: allItems.length,
            }
        }, {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep")
        }).then(result => {
            console.log(result)
            expect(result).not.to.be.undefined
            expect(result.itemsSize).not.to.be.null
            expect(result.itemsSize).to.be.greaterThan(1)
            done()
        })
    })
    it("should layer size gt 2 ", (done) => {
        let debugDir = resolve(process.cwd(), "debug")
        ae.options.noui = true
        ae.options.debug.dir = debugDir
        ae.options.debug.enabled = true
        ae.execute((params) => {
            let file = convertPath(params.projectFile)
            let layersize = 0
            app.open(file)
            let comp1 = get.comps(/Comp 1/).first as CompItem
            let compItemAsArray = toArray(comp1)
            if (comp1) {
                let layers = toArray(comp1.layers)
                layersize = layers.length
            }
            app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)
            return {
                layerSize: layersize,
                compItemAsArraySize: compItemAsArray.length
            }
        }, {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep")
        }).then(result => {
            console.log(result)
            expect(result).not.to.be.undefined
            expect(result.layerSize).not.to.be.null
            expect(result.compItemAsArraySize).not.to.be.null
            expect(result.layerSize).to.be.greaterThan(2)
            expect(result.compItemAsArraySize).to.be.eq(1)
            done()
        })
    })
    it("should layer has addComp method ", (done) => {
        let debugDir = resolve(process.cwd(), "debug")
        ae.options.debug.dir = debugDir
        ae.options.debug.enabled = true
        ae.options.noui = true
        ae.execute((params) => {
            let file = convertPath(params.projectFile)
            let hasOwnPropery = false
            app.open(file)
            let layer = get.layers().first as Layer
            if (layer) {
                hasOwnPropery = has(layer, "activeAtTime", "both")
            }

            app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)
            return {
                hasOwnPropery: hasOwnPropery

            }
        }, {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep")
        }).then(result => {
            expect(result).not.to.be.undefined
            expect(result.hasOwnPropery).not.to.be.null
            expect(result.hasOwnPropery).to.be.eq(true)
            done()
        })
    })
    it("should layer name return from commons.get", (done) => {
        //let a = [] 
        let debugDir = resolve(process.cwd(), "debug")
        ae.options.noui = true
        ae.options.debug.dir = debugDir
        ae.options.debug.enabled = true
        ae.execute((params) => {
            let file = convertPath(params.projectFile)
            let matchName = null
            let name = null
            app.open(file)
            let layer = get.layers().first as Layer
            if (layer) {
                matchName = getValue<string>(layer, "matchName"),
                    name = getValue<string>(layer, "name")
            }

            app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)
            return {
                matchName: matchName,
                name: name

            }
        }, {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep")
        }).then(result => {
            expect(result).not.to.be.undefined
            expect(result.matchName).not.to.be.null
            expect(result.name).not.to.be.null
            expect(result.name).to.be.eq("Light 1")
            expect(result.matchName).to.be.eq("ADBE Light Layer")
            done()
        })
    })

    
    it("array sink should return layers length  > 0 ", (done) => {
        //let a = [] 
        let debugDir = resolve(process.cwd(), "debug")
        ae.options.noui = true
        ae.options.debug.dir = debugDir
        ae.options.debug.enabled = true
        ae.execute((params) => {
            let f: File
            let file = convertPath(params.projectFile)
            let project = open(params.projectFile)
            toArray(project).sink(p => get.layers().toArray().length)
            let layers = get.layers().toArray()
            let valuesLength = layers.sink(values => values.length)

            close(CloseOptions.DO_NOT_SAVE_CHANGES)
            return {
                length: valuesLength

            }
        }, {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep")
        }).then(result => {
            expect(result).not.to.be.undefined
            expect(result.length).not.to.be.null
            expect(result.length).to.be.gt(0)

            done()
        })
    })
   
    it("should find test layer with observables ", (done) => {
        //let a = [] 
        let debugDir = resolve(process.cwd(), "debug")
        ae.options.noui = true
        ae.options.debug.dir = debugDir
        ae.options.debug.enabled = true
        ae.execute((params) => {

            let result  = {
                size : 0
            } 
         
            let ob$ = fromProject(params.projectFile)
                .pipe<Layer[],Layer[]>(ops.map(project=> get.layers().toArray() ) 
                 ,  ops.filter (layer => layer.name == "testlayer")
                
                ).subscribe(layers => {

    
                        result.size  =  layers.length
                }) 

            return result


        }, {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep")
        }).then(result => {
            expect(result).not.to.be.undefined
            expect(result.size).not.to.be.null
            expect(result.size).to.be.greaterThan(0,"layer named testlayer must exits  ")
            done()
        })
    })

    it("should getCompByName  comps gt 0  ", (done) => {
        //let a = [] 
        let debugDir = resolve(process.cwd(), "debug")
        ae.options.noui = true
        ae.options.debug.dir = debugDir
        ae.options.debug.enabled = true
        ae.execute((params) => {

            let result  = {
                size : 0
            } 
           let project =  open(params.projectFile) 
           let comp1 = getCompsByName("comp 1") 
           result.size = comp1.length 
            close(CloseOptions.DO_NOT_SAVE_CHANGES)
            return result


        }, {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep")
        }).then(result => {
            expect(result).not.to.be.undefined
            expect(result.size).not.to.be.null
            expect(result.size).to.be.greaterThan(0,"layer named testlayer must exits  ")
            done()
        })
    })

    it("should getCompByName with regex  comps gt 0  ", (done) => {
        //let a = [] 
        let debugDir = resolve(process.cwd(), "debug")
        ae.options.noui = true
        ae.options.debug.dir = debugDir
        ae.options.debug.enabled = true
        ae.execute((params) => {

            let result  = {
                size : 0
            } 
           let project =  open(params.projectFile) 
           let comp1 = getCompsByName("comp 1",/^comp/i) 
           result.size = comp1.length 
            close(CloseOptions.DO_NOT_SAVE_CHANGES)
            return result


        }, {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep")
        }).then(result => {
            expect(result).not.to.be.undefined
            expect(result.size).not.to.be.null
            expect(result.size).to.be.greaterThan(0,"layer named testlayer must exits  ")
            done()
        })
    })

    it("should getLayerByName(dark gray solid)   comps gt 0  ", (done) => {
        //let a = [] 
        let debugDir = resolve(process.cwd(), "debug")
        ae.options.noui = true
        ae.options.debug.dir = debugDir
        ae.options.debug.enabled = true
        ae.execute((params) => {

            let result  = {
                size : 0
            } 
           let project =  open(params.projectFile) 
           let comp1 = getLayersByName("Dark Gray Solid 1",/^dark/i) 
           result.size = comp1.length 
            close(CloseOptions.DO_NOT_SAVE_CHANGES)
            return result


        }, {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep")
        }).then(result => {
            expect(result).not.to.be.undefined
            expect(result.size).not.to.be.null
            expect(result.size).to.be.greaterThan(0,"layer named testlayer must exits  ")
            done()
        })
    })

    
    it("should getLayerByName(dark gray solid)  in a comp context  comps gt 0  ", (done) => {
        //let a = [] 
        let debugDir = resolve(process.cwd(), "debug")
        ae.options.noui = true
        ae.options.debug.dir = debugDir
        ae.options.debug.enabled = true
        ae.execute((params) => {

            let result  = {
                size : 0
            } 
           let project =  open(params.projectFile) 
           let comp1 : CompItem = getCompsByName("Comp 1").first()
           let layer1 = getLayersByName("Dark Gray Solid 1",comp1,/^dark/i) 
           result.size = layer1.length
            close(CloseOptions.DO_NOT_SAVE_CHANGES)
            return result


        }, {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep")
        }).then(result => {
            expect(result).not.to.be.undefined
            expect(result.size).not.to.be.null
            expect(result.size).to.be.eq(1,"layer named testlayer must exits  ")
            done()
        })
    })

    it("should import footage  ", (done) => {
        //let a = [] 
        let debugDir = resolve(process.cwd(), "debug")
        ae.options.noui = true 
        ae.options.debug.dir = debugDir
        ae.options.debug.enabled = true
        ae.execute((params) => {

            let result  = {
                size : 0,
                previousSize : 0 , 
                afterSize : 0  
            } 
           let project =  open(params.projectFile) 
           let comp1 : CompItem = getCompsByName("Comp 1").first()

           let footage  = importFootage(params.testimage)  
            result.previousSize = toArray(comp1.layers).length 

            comp1.layers.add(footage) 
           
           result.afterSize =  toArray(comp1.layers).length  


          close(CloseOptions.DO_NOT_SAVE_CHANGES)
            return result


        }, {
            projectFile: resolve(__dirname, "..", "ae-templates", "sample-project.aep"), 
            testimage  : resolve(__dirname,"..","ae-templates","test.png")

        }).then(result => {
            expect(result).not.to.be.undefined
            expect(result.previousSize).to.be.lessThan(result.afterSize)
             
            done()
        })
    })
})
