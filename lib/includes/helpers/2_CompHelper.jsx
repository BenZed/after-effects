

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
                        strecth: 1,
                        isStill: false,
                        order: 0,
                        startTime: 0,
                        endTime: -1
                    };
                }
                var strech = checkStrech(options.strecth);
                var footage = options.importedFile;
                var footageToComp = footage.duration / comp.duration;
                if (footageToComp < 1) {
                    // footage shorter than the comp 
                    //     let remaining = Math 1 - footageToComp 
                }
                return null;
            }
        }
    };
    $.global[scriptId] = HelperImpl;
}).apply(this);

} catch (err) {

}
app.endSuppressDialogs(false);