

app.beginSuppressDialogs();
try {

(function () {
    var scriptId = "CompHelper";
    var HelperImpl = {
        get: {
            layers: function layers(layerTypes) {
                var comps = get.layers();
                if (layerTypes == null) {
                    layerTypes = [];
                }
                var selected = [];
                var _loop_1 = function _loop_1(i) {
                    var layer = comps.selection(i);
                    if (layerTypes.length < 1) {
                        selected.push(layer);
                    } else {
                        layerTypes.filter(function (t) {
                            return t == layer.matchName;
                        }).length > 0 ? selected.push(layer) : null;
                    }
                };
                for (var i = 0; i != comps.count(); i++) {
                    _loop_1(i);
                }
                return selected;
            }
        }
    };
    $.global[scriptId] = HelperImpl;
}).apply(this);

} catch (err) {

}
app.endSuppressDialogs(false);