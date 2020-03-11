

app.beginSuppressDialogs();
try {

(function () {
    var scriptId = "IOHelper";
    var IOHelperImpl = {
        getFile: function getFile(path) {
            var cPath = IOHelper.convertPath(path);
            return new File(path);
        },
        convertPath: function convertPath(path) {
            var regexStart = new RegExp(/^([C-Z]):/m);
            return path.replace(regexStart, function (match, _1) {
                return "/" + _1;
            });
        },
        importFiles: function importFiles(files) {
            var footageItems = [];
            files.forEach(function (file) {
                var converted = IOHelper.convertPath(file);
                var importOptions = new ImportOptions(new File(converted));
                var importedFile = app.project.importFile(importOptions);
                footageItems.push(importedFile);
            });
            return footageItems;
        },
        importFile: function importFile(file) {
            return IOHelper.importFiles([file])[0];
        },
        joinPath: function joinPath() {
            var paths = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                paths[_i] = arguments[_i];
            }
            paths.map(function (path) {
                return IOHelper.convertPath(path);
            });
            return IOHelper.getFile(paths.join("/"));
        }
    };
    $.global[scriptId] = IOHelperImpl;
}).apply(this);

} catch (err) {

}
app.endSuppressDialogs(false);