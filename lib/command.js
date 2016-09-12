'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _babelCore = require('babel-core');

var _babelCore2 = _interopRequireDefault(_babelCore);

var _isExplicit = require('is-explicit');

var _isExplicit2 = _interopRequireDefault(_isExplicit);

var _isValidPath = require('is-valid-path');

var _isValidPath2 = _interopRequireDefault(_isValidPath);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/******************************************************************************/
// Command Specific Configs
/******************************************************************************/

var BabelOptions = {
  presets: [require('babel-preset-es2015')],
  plugins: [require('babel-plugin-transform-es3-member-expression-literals'), require('babel-plugin-transform-es3-property-literals'), require('babel-plugin-transform-es5-property-mutators')],
  sourceRoot: __dirname
};

/******************************************************************************/
// Helper
/******************************************************************************/

function parseSource(input) {

  if ((0, _isExplicit2.default)(input, Function)) return input.toString();

  //Dunno why the fuck someone would want to create a command
  //from an existing command, but whatever
  else if ((0, _isExplicit2.default)(input, Command)) return input.source;

  if ((0, _isValidPath2.default)(input)) return readFile(input, /\.json$/.test(input));else if ((0, _isExplicit2.default)(input, String))
    //whatever other string it is better be valid code
    return input;else throw new Error('Commands must be created with functions, urls to json, urls to code files or blobs of code as a string');
}

function readFile(url, toJson) {

  var data = tryReadFile(url);
  return toJson ? tryParseJson(data) : data;
}

function tryReadFile(url) {

  try {
    return _fs2.default.readFileSync(url, 'utf-8');
  } catch (err) {
    //Prettier error than ENONENT or whatever
    throw new Error('Could not read ' + url + '. Ensure it that it is a valid file url and that you have permissions.');
  }
}

function tryParseJson(data) {
  var json = void 0;
  try {
    json = JSON.parse(data);
  } catch (err) {
    throw new Error('Could not parse supplied JSON file.');
  }

  if (!json || !(0, _isExplicit2.default)(json.code, String) || !(0, _isExplicit2.default)(json.source, String) || !(0, _isExplicit2.default)(json.options, Object)) throw new Error('Supplied JSON file is not a serialized Command object.');

  return json;
}

/******************************************************************************/
// Command Class
/******************************************************************************/

//Symbols for "private" keys
var compile = Symbol('compile'),
    code = Symbol('code'),
    source = Symbol('source'),
    options = Symbol('options');

var Command = function () {
  function Command(source, options) {
    _classCallCheck(this, Command);

    this[source] = parseSource(source);
    this[compile](options);
  }

  /**** "PRIVATE" API ****/

  _createClass(Command, [{
    key: compile,
    value: function value(options) {
      //if this[source] is an object, it means that parse input returned the results
      //of a json file that represents a serialized command Object so we'll create
      //the command internals from that instead
      if ((0, _isExplicit2.default)(this[source], Object)) {
        var json = this[source];
        this[code] = json.code;
        this[source] = json.source;
        this[options] = json.options;

        return;
      }

      if (!(0, _isExplicit2.default)(options, Object)) options = {};

      if (!options.includes) options.includes = [].concat(_toConsumableArray(_settings2.default.includes));

      this[options] = options;
    }

    /**** MAIN API ****/

  }, {
    key: 'setOptions',
    value: function setOptions(value) {

      if (!(0, _isExplicit2.default)(value, Object)) value = {};

      var needs_recompile = false;

      var new_includes = value.includes ? value.includes.sort() : [];
      var curr_includes = (this[options].includes || _settings2.default.includes).sort();

      if (new_includes.length !== curr_includes.length) needs_recompile = true;else for (var i = 0; i < new_includes.length; i++) {
        if (new_includes[i] !== curr_includes[i]) {
          needs_recompile = true;
          break;
        }
      }

      if (needs_recompile) this[compile](value);else this[options] = Object.freeze(value);
    }
  }, {
    key: 'execute',
    value: function execute() {}
  }, {
    key: 'executeSync',
    value: function executeSync() {}
  }, {
    key: 'toString',
    value: function toString() {
      return '';
    }
  }, {
    key: 'serialize',
    value: function serialize(url) {}
  }, {
    key: 'source',
    get: function get() {
      return this[source];
    }
  }, {
    key: 'options',
    get: function get() {
      var options = Object.assign({}, this[options]);
      return Object.freeze(options);
    }
  }]);

  return Command;
}();

exports.default = Command;