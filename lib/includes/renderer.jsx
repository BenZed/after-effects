(function (global) {
    var Renderer = function (compItem) {

        
        var rqItem = app.project.renderQueue.items.add(compItem)
        var outputModule = rqItem.outputModule(1)
        this.getRenderTemplates = function (outputModuleIndex) {
  
            return rqItem.templates
        }
        this.getOutputTemplates = function () {

            return outputModule.templates
        }
        this.setOutputFile = function (file) {
            var file = convertPath(file)
            outputModule.file = file
        }

        this.applyTemplate = function (templateName) {

            var templates = this.getOutputTemplates()
            if (templates.in_array(templateName)) {
                outputModule.applyTemplate(templateName)
            } else {
                throw new Error("outputTemplate " + templateName + " not exists")
            }
        }

        this.getRQItem = function () {
            return rqItem
        } 
         



    }
    global.Renderer = Renderer
    global.render = function (){
        app.project.renderQueue.render()
    }
})($.global)