'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getForceUpdate = exports.createProxy = undefined;

var _supportsProtoAssignment = require('./supportsProtoAssignment');

var _supportsProtoAssignment2 = _interopRequireDefault(_supportsProtoAssignment);

var _createClassProxy = require('./createClassProxy');

var _createClassProxy2 = _interopRequireDefault(_createClassProxy);

var _reactDeepForceUpdate = require('react-deep-force-update');

var _reactDeepForceUpdate2 = _interopRequireDefault(_reactDeepForceUpdate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!(0, _supportsProtoAssignment2.default)()) {
  console.warn('This JavaScript environment does not support __proto__. ' + 'This means that react-proxy is unable to proxy React components. ' + 'Features that rely on react-proxy, such as react-transform-hmr, ' + 'will not function as expected.');
}

exports.createProxy = _createClassProxy2.default;
exports.getForceUpdate = _reactDeepForceUpdate2.default;