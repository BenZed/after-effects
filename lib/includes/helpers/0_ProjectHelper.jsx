

app.beginSuppressDialogs();
try {

(function () {
    var ProjectHelperImpl = {
        toArray: function toArray(collection) {
            var array = [];
            
            var length = collection.hasOwnProperty("numProperties") ? collection.numProperties : collection.length;
            for (var i = 1; i != length + 1; i++) {
                var reflection = void 0;
                
                array.push(collection[i].name);
            }
            return array;
        }
    };
    $.global["ProjectHelper"] = ProjectHelperImpl;
}).apply(this);

} catch (err) {

}
app.endSuppressDialogs(false);