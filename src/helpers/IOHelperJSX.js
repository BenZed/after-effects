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
var IOHelper = {};
/// IOHelper 
ae.createSync(function () {
    var scriptId = "IOHelper";
    var IOHelperImpl = {
        getFile: function (path) {
            var cPath = IOHelper.convertPath(path);
            return new File(path);
        },
        convertPath: function (path) {
            var regexStart = new RegExp(/^([C-Z]):/m);
            return path.replace(regexStart, function (match, _1) {
                return "/" + _1;
            });
        },
        importFiles: function (files) {
            var footageItems = [];
            files.forEach(function (file) {
                var converted = IOHelper.convertPath(file);
                var importOptions = new ImportOptions(new File(converted));
                var importedFile = app.project.importFile(importOptions);
                footageItems.push(importedFile);
            });
            return footageItems;
        },
        importFile: function (file) { return IOHelper.importFiles([file])[0]; },
        joinPath: function () {
            var paths = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                paths[_i] = arguments[_i];
            }
            paths.map(function (path) { return IOHelper.convertPath(path); });
            return IOHelper.getFile(paths.join("/"));
        }
    };
    $.global[scriptId] = IOHelperImpl;
}, path_1.resolve(__dirname, "..", "..", "lib", "includes", "helpers", "1_IOHelper.jsx"));
