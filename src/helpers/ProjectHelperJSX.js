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
var File = {};
var ProjectHelper = {};
var get = {};
ae.options.includes = [];
ae.createSync(function () {
    var AEHelperImpl = /** @class */ (function () {
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
            // @ts-ignore
            var length = collection.hasOwnProperty("numProperties") ? collection.numProperties : collection.length;
            for (var i = 1; i != length + 1; i++) {
                var reflection = void 0;
                // @ts-ignore
                array.push(collection[i].name);
            }
            return array;
        };
        return AEHelperImpl;
    }());
    var _PHelper = new AEHelperImpl();
    _PHelper.addToGlobal("ProjectHelper", _PHelper);
}, path_1.resolve(__dirname, "..", "..", "lib", "includes", "helpers", "0_ProjectHelper.jsx"));
