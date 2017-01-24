'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = undefined;

var _shortcuts = require('./shortcuts');

var _shortcuts2 = _interopRequireDefault(_shortcuts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var types = exports.types = {
  HANDLE_EVENT: 'SHORTCUTS_HANDLE_EVENT',
  SET_LAYOUT: 'SHORTCUTS_SET_LAYOUT'
};

exports.default = {
  shortcuts: _shortcuts2.default
};