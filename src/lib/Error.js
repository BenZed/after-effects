"use strict";
exports.__esModule = true;
var path_1 = require("path");
var ae = require("../..");
var File = {};
var packageName = "error.jsx";
var ErrorEnumDecleration;
(function (ErrorEnumDecleration) {
    ErrorEnumDecleration["IS_NOT_COLLECTION"] = "IS NOT COLLECTION";
})(ErrorEnumDecleration || (ErrorEnumDecleration = {}));
exports["default"] = ErrorEnumDecleration;
ae.options.includes = [];
var AEHelper = {};
ae.createSync(function () {
    var ErrorEnum;
    (function (ErrorEnum) {
        ErrorEnum["IS_NOT_COLLECTION"] = "IS NOT COLLECTION";
    })(ErrorEnum || (ErrorEnum = {}));
    $.global["ErrorEnum"] = ErrorEnum;
}, path_1.resolve(__dirname, "..", "..", "lib", "includes", packageName));
