

app.beginSuppressDialogs();
try {

(function () {
    var ProjectHelperImpl = {
        toArray: function toArray(collection) {
            var array = [];
            
            var length = collection.hasOwnProperty("numProperties") ? collection.numProperties : collection.length;
            for (var i = 1; i != length + 1; i++) {
                var reflection = void 0;
                
                array.push(collection[i].name);
            }
            return array;
        },
        removeLayer: function removeLayer(layerType) {
            if (layerType === void 0) {
                layerType = "ADBE Text Layer";
            }
            var layers = get.layers();
            for (var i = 0; i != layers.length; i++) {
                var layer = layers.selection(i);
                if (layer.matchName == layerType) {
                    layer.remove();
                }
            }
        }
    };
    $.global["ProjectHelper"] = ProjectHelperImpl;
}).apply(this);

} catch (err) {

}
app.endSuppressDialogs(false);