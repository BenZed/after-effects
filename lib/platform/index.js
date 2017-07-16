'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _mac = require('./mac');

var mac = _interopRequireWildcard(_mac);

var _win = require('./win');

var win = _interopRequireWildcard(_win);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const platformName = _os2.default.platform();
const platform = platformName === 'darwin' ? mac : platformName.includes('win') ? win : null;

if (platform === null) throw new Error('Cannot run After Effects commands in an environment it can\'t be installed in.');

exports.default = platform;