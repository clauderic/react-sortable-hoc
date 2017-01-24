'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Inspector = exports.DOMInspector = exports.TableInspector = exports.ObjectInspector = exports.chromeDark = exports.chromeLight = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _themes = require('./styles/themes');

Object.defineProperty(exports, 'chromeLight', {
  enumerable: true,
  get: function get() {
    return _themes.chromeLight;
  }
});
Object.defineProperty(exports, 'chromeDark', {
  enumerable: true,
  get: function get() {
    return _themes.chromeDark;
  }
});

var _ObjectInspector2 = require('./object-inspector/ObjectInspector');

var _ObjectInspector3 = _interopRequireDefault(_ObjectInspector2);

var _TableInspector2 = require('./table-inspector/TableInspector');

var _TableInspector3 = _interopRequireDefault(_TableInspector2);

var _DOMInspector2 = require('./dom-inspector/DOMInspector');

var _DOMInspector3 = _interopRequireDefault(_DOMInspector2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isDom = require('is-dom');

var _isDom2 = _interopRequireDefault(_isDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ObjectInspector = _ObjectInspector3.default;
exports.TableInspector = _TableInspector3.default;
exports.DOMInspector = _DOMInspector3.default;

// NOTE: ObjectValue and ObjectPreview can be used as building blocks, but currently their styles are not complete
// export ObjectValue from './object/ObjectValue'
// export ObjectPreview from './object/ObjectPreview'

// Wrapping the inspectors

var Inspector = function Inspector(_ref) {
  var _ref$table = _ref.table;
  var table = _ref$table === undefined ? false : _ref$table;
  var data = _ref.data;
  var rest = (0, _objectWithoutProperties3.default)(_ref, ['table', 'data']);

  if (table) {
    return _react2.default.createElement(_TableInspector3.default, (0, _extends3.default)({ data: data }, rest));
  }

  if ((0, _isDom2.default)(data)) return _react2.default.createElement(_DOMInspector3.default, (0, _extends3.default)({ data: data }, rest));

  return _react2.default.createElement(_ObjectInspector3.default, (0, _extends3.default)({ data: data }, rest));
};

Inspector.propTypes = {
  data: _react2.default.PropTypes.any,
  name: _react2.default.PropTypes.string,
  table: _react2.default.PropTypes.bool
};

exports.Inspector = Inspector;
exports.default = Inspector;