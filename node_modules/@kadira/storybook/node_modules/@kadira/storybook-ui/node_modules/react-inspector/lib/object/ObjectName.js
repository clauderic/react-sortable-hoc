'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createStyles = require('../styles/createStyles');

var _createStyles2 = _interopRequireDefault(_createStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A view for object property names.
 *
 * If the property name is enumerable (in Object.keys(object)),
 * the property name will be rendered normally.
 *
 * If the property name is not enumerable (`Object.prototype.propertyIsEnumerable()`),
 * the property name will be dimmed to show the difference.
 */
var ObjectName = function ObjectName(_ref, _ref2) {
  var name = _ref.name;
  var dimmed = _ref.dimmed;
  var theme = _ref2.theme;

  var styles = (0, _createStyles2.default)('ObjectName', theme);
  return _react2.default.createElement(
    'span',
    { style: (0, _extends3.default)({}, styles.base, dimmed && styles.dimmed) },
    name
  );
};

ObjectName.propTypes = {
  /** Property name */
  name: _react.PropTypes.string,
  /** Should property name be dimmed */
  dimmed: _react.PropTypes.bool
};

ObjectName.defaultProps = {
  dimmed: false
};

ObjectName.contextTypes = {
  theme: _react2.default.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object])
};

exports.default = ObjectName;