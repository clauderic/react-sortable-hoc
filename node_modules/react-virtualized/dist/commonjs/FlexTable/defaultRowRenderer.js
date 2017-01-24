'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = defaultRowRenderer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Default row renderer for FlexTable.
 */
function defaultRowRenderer(_ref) {
  var className = _ref.className;
  var columns = _ref.columns;
  var index = _ref.index;
  var isScrolling = _ref.isScrolling;
  var onRowClick = _ref.onRowClick;
  var onRowDoubleClick = _ref.onRowDoubleClick;
  var onRowMouseOver = _ref.onRowMouseOver;
  var onRowMouseOut = _ref.onRowMouseOut;
  var rowData = _ref.rowData;
  var style = _ref.style;

  var a11yProps = {};

  if (onRowClick || onRowDoubleClick || onRowMouseOver || onRowMouseOut) {
    a11yProps['aria-label'] = 'row';
    a11yProps.role = 'row';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = function () {
        return onRowClick({ index: index });
      };
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = function () {
        return onRowDoubleClick({ index: index });
      };
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = function () {
        return onRowMouseOut({ index: index });
      };
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = function () {
        return onRowMouseOver({ index: index });
      };
    }
  }

  return _react2.default.createElement(
    'div',
    _extends({}, a11yProps, {
      className: className,
      style: style
    }),
    columns
  );
}