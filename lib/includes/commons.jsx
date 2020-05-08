(function (global) {

    function in_array(arr, value) {

        return arr.some(function (_key) {
            if (_key == value) return true
            return false
        })
    }





    global.convertPath = function (path) {
        var regexStart = new RegExp(/^([C-Z]):/m);
        var newPath = path.replace(regexStart, function (match, _1) {
            return "/" + _1;
        });
        return new File(path)
    }
    global.toArray = function (items) {
        var size = 0
        var itemMethod = null
        var objRef = getReflection(items)
        var props = objRef.properties
        var methods = objRef.methods

        if (methods.has("count")) {
            size = items.count()
        } else if (props.has("length")) {
            size = items.length
        } else if (props.has("numProperties")) {

            size = items.numProperties
            itemMethod = "property"
        }

        if (size == 0) {
            return [items]
        }

        var array = [];
        // indexes start from 1 
        for (var i = 1; i != size + 1; i++) {
            var item = null
            switch (itemMethod) {
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
    global.close = function (closeOptions) {
        if (typeof closeOptions == "undefined") {
            closeOptions = CloseOptions.DO_NOT_SAVE_CHANGES
        }
        return app.project.close(closeOptions)
    }

    var Observable = function (items) {

        var Observer = function (items) {

            var iterable = [].concat(items)
            var funcs = [] //.concat(funcs)
            this.pipe = function (mapFn) {
                funcs.push(mapFn)
                return this
            }


            var execute = function (item) {


                for (var i = 0; i != funcs.length; i++) {

                    item = funcs[i].call(this, item)
                }
                return item
            }



            this.subscribe = function (subsFn, errorFn, compvareFn) {

                if (typeof subsFn != "function") {

                    throw new Error("subscription function must set ")
                }
                try {
                    var execValue = null

                    for (var i = 0; i != iterable.length; i++) {
                        var item = iterable[i]
                        execValue = execute(item)

                    }

                    subsFn.call(this, execValue)
                } catch (error) {
                    if (typeof errorFn == "function") {

                        errorFn.call(this, error)
                    }

                } finally {
                    if (typeof compvareFn == "function") {
                        compvareFn.call(this)
                    }

                }

            } // Subscribe 
        } // Observer 

        return new Observer(items)

    } // Observable 
    global.create = function (items) {

        return Observable(items)

    }

})($.global)

