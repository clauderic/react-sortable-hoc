'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShortcutsHelp = exports.Content = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commandStyle = {
  backgroundColor: '#eee',
  padding: '2px 6px',
  borderRadius: 2,
  lineHeight: '36px',
  marginRight: '5px'
};

var h4Style = {
  marginTop: 0,
  textAlign: 'center'
};

var modalStyles = {
  content: {
    left: '50%',
    bottom: 'initial',
    right: 'initial',
    width: 350,
    marginLeft: -175,
    border: 'none',
    overflow: 'visible',
    fontFamily: 'sans-serif',
    fontSize: 14
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.74902)'
  }
};

var Content = exports.Content = function Content() {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'h4',
      { style: h4Style },
      'Keyboard Shortcuts'
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌘ ⇧ P'
      ),
      ' /  ',
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌃ ⇧ P'
      ),
      'Toggle SearchBox'
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌘ ⇧ J'
      ),
      ' /  ',
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌃ ⇧ J'
      ),
      'Toggle Action Logger position'
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌘ ⇧ F'
      ),
      ' /  ',
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌃ ⇧ F'
      ),
      'Toggle Fullscreen Mode'
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌘ ⇧ L'
      ),
      ' /  ',
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌃ ⇧ L'
      ),
      'Toggle Left Panel'
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌘ ⇧ D'
      ),
      ' /  ',
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌃ ⇧ D'
      ),
      'Toggle Down Panel'
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌘ ⇧ → '
      ),
      ' /  ',
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌃ ⇧ → '
      ),
      'Next Story'
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌘ ⇧ ← '
      ),
      ' /  ',
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌃ ⇧ ← '
      ),
      'Previous Story'
    )
  );
};

var ShortcutsHelp = exports.ShortcutsHelp = function ShortcutsHelp(_ref) {
  var isOpen = _ref.isOpen;
  var onClose = _ref.onClose;
  return _react2.default.createElement(
    _reactModal2.default,
    {
      isOpen: isOpen,
      onRequestClose: onClose,
      style: modalStyles
    },
    _react2.default.createElement(Content, null)
  );
};

ShortcutsHelp.propTypes = {
  isOpen: _react2.default.PropTypes.bool,
  onClose: _react2.default.PropTypes.func
};

exports.default = ShortcutsHelp;