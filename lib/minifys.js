const 	uglify = require("uglify-js"),
		fs = require("fs");

var paths = 
[__dirname + "/includes/es5-shim.jsx" ,
 __dirname + "/includes/get.jsx"]

paths.forEach(path => {
	var code = uglify.minify(path).code;
	var min_path = path.replace(".jsx", ".min.jsx");
	fs.writeFileSync(min_path, code, {flags: 'wx'});
});