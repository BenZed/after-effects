"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var AEApp_1 = require("./../AEApp");
var path_1 = require("path");
var ae = __importStar(require("../.."));
var File = {};
var get = AEApp_1.AEApp.get();
ae.options.includes = [];
ae.createSync(function () {
    var PropertyHelper = {
        convertValue: function (x, y, z) {
            if (typeof z != undefined && typeof y != undefined) {
                return "[" + x + " , " + y + " , " + z + "]";
            }
            if (typeof y != undefined) {
                return "[" + x + " , " + y + "}";
            }
            return "[" + x + "]";
        },
        getMetaPropValue: function (propValueType, currentValue, comp) {
            var layer;
            layer.index;
            switch (propValueType) {
                case PropertyValueType.LAYER_INDEX:
                    if (typeof currentValue == "number") {
                        return currentValue;
                    }
                    else if (typeof currentValue == "string") {
                        return get.layers(comp.layers, currentValue).selection(0);
                    }
                    else {
                        throw Error("you must define property as index or layer name ");
                    }
                case PropertyValueType.ThreeD:
                case PropertyValueType.ThreeD_SPATIAL:
                    currentValue = currentValue;
                    return PropertyHelper.convertValue(currentValue.x, currentValue.y, currentValue.z);
                case PropertyValueType.TwoD:
                case PropertyValueType.TwoD_SPATIAL:
                    currentValue = currentValue;
                    return PropertyHelper.convertValue(currentValue.x, currentValue.y);
                case PropertyValueType.OneD:
                    currentValue = currentValue;
                    return PropertyHelper.convertValue(currentValue.x);
                    break;
            }
        }
    };
}, path_1.resolve(__dirname, "..", "..", "lib", "includes", "helpers", "0_PropertyHelper.jsx"));
