(function (global) {




    global.Observable = function (initialFn) {

        var _this = this
        var _operators = []
        
        var _doOnFinal = null
        var _initialFn = initialFn
        this.getState = function (){
            return _state
        }
        var doPipe = function (state) {

            if (_operators.length < 1)
                return Array.prototype.concat.apply([], state)
            if (_operators.length == 1)
                return Array.prototype.concat.apply([] ,_operators[0].call(_this, state))

            return _operators.reduce(function (prev, fn) {
               return   Array.prototype.concat.apply([],fn.call(_this, prev))
                 
            }, state)

        }
        this.doOnFinal = function (fn) {
            this._doOnFinal = fn
            return this
        }
        this.pipe = function (operators) {
            for (var i = 0; i < arguments.length; i++) {
                var fn = arguments[i] 
                if(typeof  fn == "function") 
                    _operators.push(arguments[i])
            }
            return this


        }

        this.subscribe = function (on_next, on_error, on_complete) {
            _state = _initialFn.call(this)
            if (typeof on_next != "function") {
                throw new Error("1st argument must be function ")
            }

            try {
                state = doPipe(_state)
                
                state.forEach(function (value) {

                    on_next.call(_this,state)
                })
            } catch (e) {
                if (typeof on_error == "function")
                    on_error.call(_this, e)
            }
            if (typeof on_complete == "function")
                on_complete.call(_this)
            if (typeof this._doOnFinal == "function") {
                _doOnFinal.call(_this)
            }

        }

    }
    global.create$ =  function (fn) {
        return new Observable(fn)
    }
    global.Operators = {
        
        map: function (callback) {

            var fn = function (items) {

                items = Array.isArray(items) ? items : [items]
                return items.map(callback)
            }
            return fn

        },
        sink : function (callback) {


            var fn = function (items) {

                items = Array.isArray(items) ? items : [items]
                return items.sink(callback)
            }

            return fn 
        }, 
        filter: function (callback) {

            var fn = function (items) {

                items = Array.isArray(items) ? items : [items]
                return items.filter(callback)
            }
            return fn

        }


    }
    global.ops = Operators

    global.fromProject = function (path, autoClose) {

        var fn = function (){

            if (autoClose === true) this.doOnFinal(app.close(CloseOptions.DO_NOT_SAVE_CHANGES))
            var file = convertPath(path)
            return app.open(file) 
            
            
        }
        return create$(fn) 
        
    }
    global.fromLayers = function (layers) {
        var fn = function (){
            return layers 
        }
        return create$(fn) 
    }
}) ($.global)