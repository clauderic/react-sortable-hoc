'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wrapStyle = {
  cursor: 'row-resize',
  width: '100%',
  height: '10px',
  marginTop: '-8px',
  marginBottom: '-10px',
  position: 'relative'
};

var spanStyle = {
  height: '1px',
  width: '20px',
  top: '5px',
  left: '50%',
  marginLeft: '-10px',
  position: 'absolute',
  borderTop: 'solid 1px rgba(0,0,0,0.1)',
  borderBottom: 'solid 1px rgba(0,0,0,0.1)'
};

var HSplit = function HSplit() {
  return _react2.default.createElement(
    'div',
    { style: wrapStyle },
    _react2.default.createElement('span', { style: spanStyle })
  );
};

exports.default = HSplit;