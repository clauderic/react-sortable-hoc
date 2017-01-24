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

var _theme = require('../theme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mainStyle = (0, _extends3.default)({}, _theme.baseFonts, {
  border: '1px solid #ECECEC',
  borderRadius: 2,
  position: 'relative'
});

var TextFilter = function (_React$Component) {
  (0, _inherits3.default)(TextFilter, _React$Component);

  function TextFilter(props) {
    (0, _classCallCheck3.default)(this, TextFilter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TextFilter).call(this, props));

    _this.state = {
      query: ''
    };

    _this.onChange = _this.onChange.bind(_this);
    _this.fireOnClear = _this.fireOnClear.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(TextFilter, [{
    key: 'onChange',
    value: function onChange(event) {
      var text = event.target.value;
      this.setState({ query: text });
      var onChange = this.props.onChange;

      if (onChange) onChange(text);
    }
  }, {
    key: 'fireOnClear',
    value: function fireOnClear() {
      this.setState({ query: '' });

      var onClear = this.props.onClear;

      if (onClear) onClear();
    }
  }, {
    key: 'render',
    value: function render() {
      var textWrapStyle = {
        background: '#F7F7F7'
      };

      var textStyle = {
        fontSize: 12,
        color: '#828282',
        padding: 5,
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        outline: 'none',
        border: 0,
        height: 26
      };

      var clearButtonStyle = {
        position: 'absolute',
        color: '#868686',
        border: 'none',
        width: 25,
        height: 26,
        right: 1,
        top: 0,
        textAlign: 'center',
        cursor: 'pointer',
        lineHeight: '23px',
        fontSize: 20
      };

      return _react2.default.createElement(
        'div',
        { style: mainStyle },
        _react2.default.createElement(
          'div',
          { style: textWrapStyle },
          _react2.default.createElement('input', {
            style: textStyle,
            type: 'text',
            placeholder: 'Filter',
            name: 'filter-text',
            value: this.props.text || '',
            onChange: this.onChange
          })
        ),
        this.state.query && this.state.query.length && _react2.default.createElement(
          'div',
          {
            style: clearButtonStyle,
            onClick: this.fireOnClear,
            className: 'clear'
          },
          '×'
        )
      );
    }
  }]);
  return TextFilter;
}(_react2.default.Component);

exports.default = TextFilter;


TextFilter.propTypes = {
  text: _react2.default.PropTypes.string,
  onChange: _react2.default.PropTypes.func,
  onClear: _react2.default.PropTypes.func
};