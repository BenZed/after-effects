'use strict';

/*******************************************************************/
// DEPENDENCIES
/*******************************************************************/
const fs =     require('fs'),
      path = 	 require('path'),
      is = 		 require('is-explicit').default,
      uglify = require('uglify-js'),
      babel =  require('babel-core');

//don't require ae here, as the circular dependencies will result in a {}
//until initial requires are complete.
let ae = null;

/*******************************************************************/
// CONSTANTS
/*******************************************************************/

const BabelOptions = {
	presets: [
		require('babel-preset-es2015')
	],
	plugins: [
		require('babel-plugin-transform-es3-member-expression-literals'),
		require('babel-plugin-transform-es3-property-literals'),
		require('babel-plugin-transform-es5-property-mutators')
	],
	sourceRoot: __dirname
};

//These compression options are to satisfy After Effects old javascript engine.
const CompressionOptions = {
	conditionals: false
};

/*******************************************************************/
// HELPERS
/*******************************************************************/

function stringify() { /* private dangler */
	let err_open = '', err_close = '';
	if (this.options.errorHandling) {
		err_open  = '\napp.beginSuppressDialogs();\ntry {\n\n';
		err_close = '\n} catch (err) {\n' +
		(is(this.result_file,String) ? '\n\t$.result = err instanceof Error ? err : new Error(err);\n' : '') +
		'\n}\napp.endSuppressDialogs(false);';
	}

	let args = '';
	if (is(this.arguments, Array) && this.arguments.length > 0)
		args =  ',' + JSON.stringify(this.arguments);

	let res_get = '', res_write = '';
	if (is(this.result_file, String)) {
		res_get = '$.result = ';
		res_write = '\n\n'+
		'(function(result){\n'+
		'\tvar file = File(Folder.temp.absoluteURI+"/' + this.result_file + '");\n'+
		'\tfile.open("w");\n'+
		'\tvar str = "module.exports = " + {\n'+
		'\t\tlogs: typeof console === "object" && typeof console.clearCache === "function" ? console.clearCache() : null,\n'+
		'\t\treturned: result\n'+
		'\t}.toSource();\n' +
		'\tfile.write(str);\n' +
		'\tfile.close();\n' +
		'\tdelete $.result;\n'+
		'})($.result);';
	}

	const inc = this.includes.join(';');
	const main = err_open + res_get + this.code + '.apply(this' + args + ');\n' + err_close + res_write;

	return inc + main;
}

function babelify(code) {
	return babel.transform(code, BabelOptions).code;
}

function minify(code)
{
	return uglify.minify(code, {fromString: true, compress: CompressionOptions}).code;
}

function codify_includes(includes, do_minify) {
	if (!is(includes, Array)) return [];

	return includes.map(file => {
		if (!is(file, String)) return null;
		file = path.resolve(file);
		try {
			fs.accessSync(file, fs.R_OK);
		} catch (err) {
			throw new Error(`Cannot include file at path ${file}, non-existent or can't be read.`);
		}

		let code = fs.readFileSync(file, { encoding: 'utf-8' });

		if (path.extname(file) !== '.jsx') {
			code = babelify(code);
			if (do_minify)
				code = minify(code);
		}

		return code;

	}).filter(inc => is(inc,String));
}

function execute_args(command, input_args) {
	const args = [command];
	for (let i = 0; i < input_args.length; i++) args.push(input_args[i]);

	return args;
}

/*******************************************************************/
// CODIFICATION
/*******************************************************************/

module.exports = class Command {

	constructor(func, options) {

		if (ae === null)
			ae = require('../index');

		if (!is(func, Function))
			throw new Error('Commands must be constructed with a function argument.');

		if (!is(options, Object)) options = {};

		this.options = Object.assign({}, ae.options, options);

		//Babelify function as an expression otherwise it breaks when isolated
		const babelified = babelify(`(${func.toString()})`);

		//Isolate babelified code to just the function expression (remove any babelified includes and the final ;)
    const funcStart = babelified.indexOf('(function');
    this.code = babelified.substring(funcStart, babelified.length - 1);

    //Isolate babelified includes (without the 'use strict' cause AE doesn't use it)
    const babelIncludes = babelified.substring(0, funcStart).replace('"use strict";\n','');

		if (this.options.minify) {
			//minify will return no code if its just a function expression that doesn't get executed
			//so we have to trick it and then we-wrap the minified code into a function expression.
			this.code = minify('var temp = ' + this.code + '()');
			this.code = '(' + this.code.substring(9, this.code.length - 3) + ')';
		}

		this.includes = [...codify_includes(this.options.includes, this.options.minify), babelIncludes];


		Object.freeze(this.options);
		Object.freeze(this.options.includes);

	}

	toString() {
		return stringify.call(this);
	}

	execute() {
		const args = execute_args(this, arguments);
		return ae.execute.apply(null, args);
	}

	executeSync() {
		const args = execute_args(this, arguments);
		return ae.executeSync.apply(null, args);
	}
};
