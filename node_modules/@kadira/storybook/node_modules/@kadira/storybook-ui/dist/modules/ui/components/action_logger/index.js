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

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactInspector = require('react-inspector');

var _reactInspector2 = _interopRequireDefault(_reactInspector);

var _theme = require('../theme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var preStyle = {
  color: '#666',
  overflowY: 'auto',
  padding: '8px 2px',
  boxSizing: 'border-box',
  border: '1px solid #ECECEC',
  borderRadius: 4,
  backgroundColor: '#FFF',
  margin: 0,
  position: 'absolute',
  top: '30px',
  right: 0,
  bottom: 0,
  left: 0
};

var wrapStyle = {
  position: 'relative',
  height: '100%'
};

var headStyle = (0, _extends3.default)({}, _theme.baseFonts, {
  letterSpacing: '2px',
  fontSize: 12,
  margin: '10px 0 0 5px'
});

var btnStyle = {
  marginLeft: 5
};

var countStyle = {
  display: 'inline-block',
  backgroundColor: '#777777',
  color: '#ffffff',
  padding: '1px 5px',
  borderRadius: '8px'
};

var logDivStyle = {
  marginLeft: 5,
  padding: 3,
  paddingLeft: 0,
  overflow: 'auto',
  borderBottom: '1px solid #fafafa',
  backgroundColor: 'white'
};

var inspectorStyle = {
  marginLeft: 5,
  float: 'none',
  display: 'inline-block',
  width: 'calc(100% - 140px)',
  whiteSpace: 'initial'
};

var countWrapper = {
  minWidth: 20,
  display: 'inline-block',
  float: 'left',
  height: 19,
  marginRight: 5
};

var ActionLogger = function (_Component) {
  (0, _inherits3.default)(ActionLogger, _Component);

  function ActionLogger() {
    (0, _classCallCheck3.default)(this, ActionLogger);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ActionLogger).apply(this, arguments));
  }

  (0, _createClass3.default)(ActionLogger, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var _this2 = this;

      if (this.refs.latest) {
        this.refs.latest.style.backgroundColor = '#FFFCE0';
        setTimeout(function () {
          _this2.refs.latest.style.backgroundColor = logDivStyle.backgroundColor;
        }, 500);
      }
    }
  }, {
    key: 'getActionData',
    value: function getActionData() {
      return this.props.actions.map(function (action, i) {
        var ref = i ? '' : 'latest';
        return _react2.default.createElement(
          'div',
          { style: logDivStyle, key: action.id, ref: ref },
          _react2.default.createElement(
            'div',
            { style: countWrapper },
            action.count > 1 && _react2.default.createElement(
              'span',
              { style: countStyle },
              action.count
            )
          ),
          _react2.default.createElement(
            'div',
            { style: inspectorStyle },
            _react2.default.createElement(_reactInspector2.default, {
              showNonenumerable: true,
              name: action.data.name,
              data: action.data.args || action.data
            })
          )
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var onClear = this.props.onClear;

      return _react2.default.createElement(
        'div',
        { style: wrapStyle },
        _react2.default.createElement(
          'h3',
          { style: headStyle },
          'ACTION LOGGER',
          _react2.default.createElement(
            'button',
            { style: btnStyle, onClick: onClear },
            'CLEAR'
          )
        ),
        _react2.default.createElement(
          'pre',
          { style: preStyle },
          this.getActionData()
        )
      );
    }
  }]);
  return ActionLogger;
}(_react.Component);

ActionLogger.propTypes = {
  onClear: _react2.default.PropTypes.func,
  actions: _react2.default.PropTypes.array
};

exports.default = ActionLogger;