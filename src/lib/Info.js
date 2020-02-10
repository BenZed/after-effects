"use strict";
exports.__esModule = true;
var error_1 = require("./error");
var ae = require("../..");
var File = {};
var get = {};
ae.options.includes = [];
var ErrorEnum = error_1["default"];
ae.execute(function () {
    var InfoImplementation = /** @class */ (function () {
        function InfoImplementation() {
        }
        InfoImplementation.prototype.isFile = function (item) {
            //item.isCollection 
            return item.properties.filter(function (key) { return key.name == "encoding"; }).length > 0;
        };
        InfoImplementation.prototype.isCollection = function (item) {
            if (item.hasOwnProperty("lenght") && !item.hasOwnProperty("join")) {
                return true;
            }
        };
        InfoImplementation.prototype.toArray = function (item) {
            var itemReflection = item.reflection;
            if (!itemReflection.isCollection) {
                throw new Error(ErrorEnum.IS_NOT_COLLECTION);
            }
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
        return InfoImplementation;
    }());
});
