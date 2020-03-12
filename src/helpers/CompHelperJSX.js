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
                    strecth: 1,
                    isStill: false,
                    order: 0,
                    startTime: 0,
                    endTime: -1
                }; }
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
}, path_1.resolve(__dirname, "..", "..", "lib", "includes", "helpers", "2_CompHelper.jsx"));
