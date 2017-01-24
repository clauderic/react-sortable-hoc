'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createStyles = require('../styles/createStyles');

var _createStyles2 = _interopRequireDefault(_createStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A short description of the object values.
 * Can be used to render tree node in ObjectInspector
 * or render objects in TableInspector.
 */
var ObjectValue = function ObjectValue(_ref, _ref2) {
  var object = _ref.object;
  var theme = _ref2.theme;

  var styles = (0, _createStyles2.default)('ObjectValue', theme);

  switch (typeof object === 'undefined' ? 'undefined' : (0, _typeof3.default)(object)) {
    case 'number':
      return _react2.default.createElement(
        'span',
        { style: styles.objectValueNumber },
        object
      );
    case 'string':
      return _react2.default.createElement(
        'span',
        { style: styles.objectValueString },
        '"',
        object,
        '"'
      );
    case 'boolean':
      return _react2.default.createElement(
        'span',
        { style: styles.objectValueBoolean },
        String(object)
      );
    case 'undefined':
      return _react2.default.createElement(
        'span',
        { style: styles.objectValueUndefined },
        'undefined'
      );
    case 'object':
      if (object === null) {
        return _react2.default.createElement(
          'span',
          { style: styles.objectValueNull },
          'null'
        );
      }
      if (object instanceof Date) {
        return _react2.default.createElement(
          'span',
          null,
          object.toString()
        );
      }
      if (object instanceof RegExp) {
        return _react2.default.createElement(
          'span',
          { style: styles.objectValueRegExp },
          object.toString()
        );
      }
      if (Array.isArray(object)) {
        return _react2.default.createElement(
          'span',
          null,
          'Array[' + object.length + ']'
        );
      }
      return _react2.default.createElement(
        'span',
        null,
        object.constructor.name
      );
    case 'function':
      return _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          'span',
          { style: styles.objectValueFunctionKeyword },
          'function'
        ),
        _react2.default.createElement(
          'span',
          { style: styles.objectValueFunctionName },
          ' ',
          object.name,
          '()'
        )
      );
    case 'symbol':
      return _react2.default.createElement(
        'span',
        { style: styles.objectValueSymbol },
        object.toString()
      );
    default:
      return _react2.default.createElement('span', null);
  }
};

ObjectValue.propTypes = {
  /** the object to describe */
  object: _react.PropTypes.any
};

ObjectValue.contextTypes = {
  theme: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object])
};

exports.default = ObjectValue;