'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _createStyles = require('../styles/createStyles');

var _createStyles2 = _interopRequireDefault(_createStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SortIconContainer = function SortIconContainer(props) {
  return _react2.default.createElement(
    'div',
    { style: {
        position: 'absolute',
        top: 1,
        right: 0,
        bottom: 1,
        display: 'flex',
        alignItems: 'center'
      } },
    props.children
  );
};

var SortIcon = function SortIcon(_ref, _ref2) {
  var sortAscending = _ref.sortAscending;
  var theme = _ref2.theme;

  var glyph = sortAscending ? '▲' : '▼';
  var styles = (0, _createStyles2.default)('TableInspectorSortIcon', theme);
  return _react2.default.createElement(
    'div',
    { style: styles },
    glyph
  );
};

SortIcon.contextTypes = {
  theme: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]).isRequired
};

var TH = function (_Component) {
  (0, _inherits3.default)(TH, _Component);

  function TH() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TH);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = Object.getPrototypeOf(TH)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = { hovered: false }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(TH, [{
    key: 'toggleHovered',
    value: function toggleHovered(hovered) {
      this.setState({ hovered: hovered });
    }
  }, {
    key: 'render',
    value: function render() {
      // either not sorted, sort ascending or sort descending
      var _props = this.props;
      var sorted = _props.sorted;
      var sortAscending = _props.sortAscending;
      var theme = this.context.theme;

      var styles = (0, _createStyles2.default)('TableInspectorTH', theme);

      return _react2.default.createElement(
        'th',
        (0, _extends3.default)({}, this.props, {
          style: (0, _extends3.default)({}, styles.base, this.props.borderStyle, this.state.hovered ? styles.base[':hover'] : {}),
          onMouseEnter: this.toggleHovered.bind(this, true),
          onMouseLeave: this.toggleHovered.bind(this, false),
          onClick: this.props.onClick }),
        _react2.default.createElement(
          'div',
          { style: styles.div },
          this.props.children
        ),
        function () {
          if (sorted) {
            return _react2.default.createElement(
              SortIconContainer,
              null,
              _react2.default.createElement(SortIcon, { sortAscending: sortAscending })
            );
          }
        }()
      );
    }
  }]);
  return TH;
}(_react.Component);

TH.contextTypes = {
  theme: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]).isRequired
};

TH.defaultProps = {
  sortAscending: false,
  sorted: false,
  onClick: undefined
};

exports.default = TH;