

app.beginSuppressDialogs();
try {

(function () {
    var AEHelperImpl = /** @class */function () {
        function AEHelperImpl() {
            this.globalRegistry = [];
        }
        AEHelperImpl.prototype.getFromEffects = function (remainChar, context) {
            if (!(context instanceof AVLayer)) {
                throw new Error("context is not a layer " + context);
            }
            return context.effect(remainChar);
        };
        AEHelperImpl.prototype.toArray = function (collection) {
            var array = [];
            
            var length = collection.hasOwnProperty("numProperties") ? collection.numProperties : collection.length;
            for (var i = 1; i != length + 1; i++) {
                var reflection = void 0;
                
                array.push(collection[i].name);
            }
            return array;
        };
        return AEHelperImpl;
    }();
    var _PHelper = new AEHelperImpl();
    _PHelper.addToGlobal("ProjectHelper", _PHelper);
}).apply(this);

} catch (err) {

}
app.endSuppressDialogs(false);