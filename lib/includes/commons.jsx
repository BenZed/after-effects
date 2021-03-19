
(function (global) {

    global.convertPath = function (path) {
        var regexStart = new RegExp(/^([C-Z]):/m);
        var newPath = path.replace(regexStart, function (match, _1) {
            return "/" + _1;
        });
        return new File(path)
    }

    global.importFootage = function (path, importAs) {


        var file = convertPath(path)

        var importOptions = new ImportOptions(file)

        if (typeof importAs != undefined) {
            importAs = ImportAsType.FOOTAGE;
        }
        importOptions.importAs = importAs
        var importedFootage = app.project.importFile(importOptions)
        return importedFootage


    }
    global.toArray = function (items) {
        var size = 0
        var itemMethod = null
        var objRef = getReflection(items)
        var props = objRef.properties
        var methods = objRef.methods

        if (props.has("length")) {
            size = items.length
        }
        else if (props.has("numProperties")) {
            size = items.numProperties
            itemMethod = "property"
        } else if (methods.has("count")) {
            size = items.count()
        } else if (props.has("numOutputModules")) {
            size = items.numOutputModules
            itemMethod = "outputModule"
        }
        if (size == 0) {
            return [items]
        }
        var array = [];
        // indexes start from 1 
        for (var i = 1; i != size + 1; i++) {
            var item = null
            switch (itemMethod) {
                case "outputModule":
                    array = items.outputModule(1).templates
                    break;
                case "property":
                    array.push(items.property(i))
                    break;
                default:
                    array.push(items[i])
                    break;
            }
        }
        return array
    }
    global.has = function (obj, key, type) {
        var objRef = getReflection(obj)
        var context = objRef.properties
        switch (type) {
            case "both":
            case "method":
            case "methods":
                context = context.concat(objRef.methods)
                break;
            default:
                break;
        }
        return context.has(key)
    }
    global.getReflection = function (obj) {
        return obj.reflect
    }
    global.getValue = function (obj, key) {
        if (!has(obj, key))
            throw new Error(key + "not exists in " + obj)
        return obj[key]
    }
    global.open = function (path) {
        var file = convertPath(path)
        return app.open(file)
    }
    global.openProject = function (path) {
        var file = convertPath(path)
        return app.open(file)
    }
    global.saveWithSuffix = function (suffix) {

        var file = app.project.file
        var newName = file.name + suffix
        var newFile = new File(newFile)
        app.project.save(newFile)
        return newFile
    }
    global.close = function (closeOptions) {
        if (typeof closeOptions == "undefined") {
            closeOptions = CloseOptions.DO_NOT_SAVE_CHANGES
        }
        return app.project.close(closeOptions)
    }
    global.render = function (comp, file, outputModule, outFile, outTemplate) {
        var item = project.renderQueue.items.add(comp)
        var module = item.outputModule()
        toArray(module)

    }

    global.getCompsByName = function (name, regex) {

        return get.comps(regex).toArray().filter(function (comp) {

            return comp.name.toLowerCase().trim() == name.toLowerCase().trim()
        })

    }
    global.getLayersByName = function (name, comp, regex) {

        var layers = {}
        if (typeof comp != "undefined") {
            layers = get.layers(comp.layers, regex)
        } else {
            layers = get.layers(regex)
        }
        return layers.toArray().filter(function (layer) {
            return layer.name.toLowerCase().trim() == name.toLowerCase().trim()
        })
    }


    global.getEffectProperty = function (layer, effectNs) {

        var ns = "Echo|Echo Time (seconds)"
        var a = effectNS.split("|")
        var e = layer.effect
        for (var i = 0; i != a.length; i++) {

            e = e(a[i])
        }
    }
    global.effectWrapper = function (layer, effectName) {
        var effect = layer.effect(effectName)
        var fn = function (propName) {

            return effect(propName)
        }
    }

    global.ae_helpers = {

        getComp: function (name) {
            return get.comps(name).first
        },
        importFootage: global.importFootage,
        render: global.render,
        getProperty: function (ref, path) {
            var _ref = ref
            var props = path.split(".")
            while (props.length > 0) {
                var strPath = props.shift()
                _ref = _ref.property(strPath)
             
            }
            return _ref
        },
        addEffect: function (ref, name) {
            var effects = ref.property("ADBE Effect Parade")
            var context = effects.property(name)
            if (context == undefined) {
                return 
            } else {
                if (force) {
                    return ref.property("ADBE Effect Parade").addProperty(name)
                }
                return context
            }

        },
        extendProperty: function (ref,name) {

            var baseRef = ae_helpers.getProperty(ref,name)
                return  { 

                    
                    getProperty : function (_name){
                            ae.helpers.getProperty(baseRef,_name)
                    }
                }   
            
        },
        // if name used new effect will be add - if match name first effect retieved on exist 
        extendEffect: function (ref, name) {
            var effect  = null
            
            try{
                 effect = ae_helpers.getEffectByName(ref, name)
            }catch(err){
                // possibly name used to retieve 
                var effects = ref.property("ADBE Effect Parade")
                if(effects == null){
                    throw new Error("cannot get effect from " + ref.name)
                }
                effect = effects.addProperty(name)
               
            }
           
            return ae_helpers.extendProperty(effect)
        } ,
        getPropertyByName : function (ref,name){
            var properties = getPropertiesByName(ref,name)
            if(properties.length < 1){
                throw new Error("Property name " + name + "not exists in " + ref.name) 
            }
            return properties[0]
            
        },
        // 
        getEffectByName : function (ref,name){
            var effects = getEffectsByName(ref,name)
            if(effects.length < 1){
                throw new Error("Effects  name " + name + "not exists in " + ref.name) 
            }
            return effects[0]
            
        },
        getEffectsByMatchName : function (ref,matchName){

            return ae_helpers.getPropertiesByName(ref,matchName)
        },
        getPropertiesByName: function (propertyGroup, term) {

            var props = [] 
            for (var i = 1; i != propertyGroup.numProperties + 1; i++) {
                var prop = propertyGroup.property(i)
                term = term.toUpperCase()
                var name = context.name.toUpperCase()
                var matchName = context.matchName.toUpperCase()
                if (name  == term || matchName == term) {
                    props.push(prop)
                }
                
            }
            return props 
        },
        getEffectsByName: function (ref, name) {
            return ae_helpers.getPropertyByName(ref.property("ADBE Effect Parade"), name)
        },
        isPropertyExists: function (ref, name) {
            return ae_helpers.getPropertyByName(ref, name).length > 0 
        },
        isEffectExists: function (ref, name) {
            return ae_helpers.getPropertyByName(ref.property("ADBE Effect Parade"), name).length >  0 
        }

    }
})($.global)
