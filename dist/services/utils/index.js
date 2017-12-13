'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRealString = exports.generateMessageTo = exports.generateMessage = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateMessage = exports.generateMessage = function generateMessage(from, message) {
  return {
    from: from,
    message: message,
    createdAt: (0, _moment2.default)().format('LT')
  };
};
var generateMessageTo = exports.generateMessageTo = function generateMessageTo(from, to, message) {
  return {
    from: from,
    to: to,
    message: message,
    createdAt: (0, _moment2.default)().format('LT')
  };
};

var isRealString = exports.isRealString = function isRealString(str) {
  return typeof str === 'string' && str.trim().length > 0;
};