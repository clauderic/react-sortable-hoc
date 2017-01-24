'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _vsplit = require('./vsplit');

var _vsplit2 = _interopRequireDefault(_vsplit);

var _hsplit = require('./hsplit');

var _hsplit2 = _interopRequireDefault(_hsplit);

var _reactSplitPane = require('@kadira/react-split-pane');

var _reactSplitPane2 = _interopRequireDefault(_reactSplitPane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootStyle = {
  height: '100vh',
  backgroundColor: '#F7F7F7'
};

var fullScreenStyle = {
  height: '100vh',
  border: 0,
  margin: 0,
  padding: 0,
  overflow: 'hidden'
};

var leftPanelStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%'
};

var downPanelStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: '5px 10px 10px 0',
  boxSizing: 'border-box'
};

var contentPanelStyle = {
  position: 'absolute',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  padding: '10px 10px 10px 0'
};

var previewStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFF',
  border: '1px solid #ECECEC',
  borderRadius: 4
};

var vsplit = _react2.default.createElement(_vsplit2.default, null);
var hsplit = _react2.default.createElement(_hsplit2.default, null);

var onDragStart = function onDragStart() {
  document.body.classList.add('dragging');
};

var onDragEnd = function onDragEnd() {
  document.body.classList.remove('dragging');
};

var Layout = function (_React$Component) {
  (0, _inherits3.default)(Layout, _React$Component);

  function Layout() {
    (0, _classCallCheck3.default)(this, Layout);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Layout).apply(this, arguments));
  }

  (0, _createClass3.default)(Layout, [{
    key: 'renderWithFullscreen',
    value: function renderWithFullscreen() {
      return _react2.default.createElement(
        'div',
        { style: fullScreenStyle },
        this.props.preview()
      );
    }
  }, {
    key: 'renderNormally',
    value: function renderNormally() {
      var props = this.props;
      var leftPanelDefaultSize = props.showLeftPanel ? 250 : 1;
      var downPanelDefaultSize = 1;
      if (props.showDownPanel) {
        downPanelDefaultSize = props.downPanelInRight ? 400 : 200;
      }
      return _react2.default.createElement(
        'div',
        { style: rootStyle },
        _react2.default.createElement(
          _reactSplitPane2.default,
          {
            split: 'vertical',
            minSize: leftPanelDefaultSize,
            defaultSize: leftPanelDefaultSize,
            resizerChildren: vsplit,
            onDragStarted: onDragStart,
            onDragFinished: onDragEnd
          },
          _react2.default.createElement(
            'div',
            { style: leftPanelStyle },
            props.showLeftPanel ? props.leftPanel() : null
          ),
          _react2.default.createElement(
            _reactSplitPane2.default,
            {
              split: props.downPanelInRight ? 'vertical' : 'horizontal',
              primary: 'second',
              minSize: props.downPanelInRight ? 200 : 100,
              defaultSize: downPanelDefaultSize,
              resizerChildren: props.downPanelInRight ? vsplit : hsplit,
              onDragStarted: onDragStart,
              onDragFinished: onDragEnd
            },
            _react2.default.createElement(
              'div',
              { style: contentPanelStyle },
              _react2.default.createElement(
                'div',
                { style: previewStyle },
                props.preview()
              )
            ),
            _react2.default.createElement(
              'div',
              { style: downPanelStyle },
              props.showDownPanel ? props.downPanel() : null
            )
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var goFullScreen = this.props.goFullScreen;

      if (goFullScreen) {
        return this.renderWithFullscreen();
      }

      return this.renderNormally();
    }
  }]);
  return Layout;
}(_react2.default.Component);

Layout.propTypes = {
  showLeftPanel: _react2.default.PropTypes.bool.isRequired,
  showDownPanel: _react2.default.PropTypes.bool.isRequired,
  goFullScreen: _react2.default.PropTypes.bool.isRequired,
  leftPanel: _react2.default.PropTypes.func.isRequired,
  preview: _react2.default.PropTypes.func.isRequired,
  downPanel: _react2.default.PropTypes.func.isRequired,
  downPanelInRight: _react2.default.PropTypes.bool.isRequired
};

exports.default = Layout;