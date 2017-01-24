'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wrapStyle = {
  cursor: 'col-resize',
  height: '100%',
  width: '20px',
  marginLeft: '-10px',
  position: 'relative'
};

var spanStyle = {
  width: '1px',
  height: '20px',
  right: '5px',
  top: '50%',
  marginTop: '-10px',
  position: 'absolute',
  borderLeft: 'solid 1px rgba(0,0,0,0.1)',
  borderRight: 'solid 1px rgba(0,0,0,0.1)'
};

var VSplit = function VSplit() {
  return _react2.default.createElement(
    'div',
    { style: wrapStyle },
    _react2.default.createElement('span', { style: spanStyle })
  );
};

exports.default = VSplit;