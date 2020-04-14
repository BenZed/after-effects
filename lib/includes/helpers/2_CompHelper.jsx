

app.beginSuppressDialogs();
try {

(function () {
    var checkStrech = function checkStrech(strech) {
        if (strech < 0) {
            return 0;
        }
        if (strech > 1) return 1;
    };
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
        },
        insert: {
            footage: function footage(comp, options) {
                if (options === void 0) {
                    options = {
                        order: 0,
                        inPoint: 0,
                        outPoint: -1
                    };
                }
                var layer = comp.layers.add(options.importedFile);
                layer.inPoint = options.inPoint;
                if (comp.duration > options.importedFile.duration) {
                    layer.timeRemapEnabled = true;
                    var prop1 = get.props(layer, "Time Remap").selection(0);
                    prop1.expressionEnabled = true;
                    prop1.expression = "loopOut('cycle')";
                    layer.outPoint = comp.duration;
                }
                return layer;
            }
        }
    };
    $.global[scriptId] = HelperImpl;
}).apply(this);

} catch (err) {

}
app.endSuppressDialogs(false);