"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var path_1 = require("path");
var ae = __importStar(require("../.."));
var get = {};
var File = {};
var ProjectHelper = {};
ae.options.includes = [];
ae.createSync(function () {
    var checkStrech = function (strech) {
        if (strech < 0) {
            return 0;
        }
        if (strech > 1)
            return 1;
    };
    var scriptId = "CompHelper";
    var HelperImpl = {
        get: {
            layers: function (layerTypes) {
                var comps = get.layers();
                if (layerTypes == null) {
                    layerTypes = [];
                }
                var selected = [];
                var _loop_1 = function (i) {
                    var layer = comps.selection(i);
                    if (layerTypes.length < 1) {
                        selected.push(layer);
                    }
                    else {
                        layerTypes.filter(function (t) { return t == layer.matchName; }).length > 0 ? selected.push(layer) : null;
                    }
                };
                for (var i = 0; i != comps.count(); i++) {
                    _loop_1(i);
                }
                return selected;
            }
        },
        insert: {
            footage: function (comp, options) {
                if (options === void 0) { options = {
                    order: 0,
                    inPoint: 0,
                    outPoint: -1
                }; }
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
}, path_1.resolve(__dirname, "..", "..", "lib", "includes", "helpers", "2_CompHelper.jsx"));
