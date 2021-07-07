

app.beginSuppressDialogs();
try {

(function () {
    var ErrorEnum;
    (function (ErrorEnum) {
        ErrorEnum["IS_NOT_COLLECTION"] = "IS NOT COLLECTION";
    })(ErrorEnum || (ErrorEnum = {}));
    $.global["ErrorEnum"] = ErrorEnum;
}).apply(this);

} catch (err) {

}
app.endSuppressDialogs(false);