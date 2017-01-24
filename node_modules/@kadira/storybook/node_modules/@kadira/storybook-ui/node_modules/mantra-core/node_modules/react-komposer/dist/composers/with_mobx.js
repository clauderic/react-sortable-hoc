'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = composeWithMobx;

var _compose = require('../compose');

var _compose2 = _interopRequireDefault(_compose);

var _mobx = require('mobx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function composeWithMobx(fn, L, E, options) {
  var onPropsChange = function onPropsChange(props, onData) {
    var reactiveFn = function reactiveFn() {
      return fn(props, onData);
    };

    (0, _mobx.autorun)(reactiveFn);

    return reactiveFn();
  };

  return (0, _compose2.default)(onPropsChange, L, E, options);
}