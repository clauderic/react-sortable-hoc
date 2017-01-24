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

var listStyle = (0, _extends3.default)({}, _theme.baseFonts);

var kindStyle = {
  fontSize: 15,
  padding: '10px 0px',
  cursor: 'pointer',
  borderBottom: '1px solid #EEE'
};

var storyStyle = {
  fontSize: 13,
  padding: '8px 0px 8px 10px',
  cursor: 'pointer'
};

var Stories = function (_React$Component) {
  (0, _inherits3.default)(Stories, _React$Component);

  function Stories() {
    var _Object$getPrototypeO;

    (0, _classCallCheck3.default)(this, Stories);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Stories)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    _this.renderKind = _this.renderKind.bind(_this);
    _this.renderStory = _this.renderStory.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Stories, [{
    key: 'fireOnKind',
    value: function fireOnKind(kind) {
      var onSelectStory = this.props.onSelectStory;

      if (onSelectStory) onSelectStory(kind, null);
    }
  }, {
    key: 'fireOnStory',
    value: function fireOnStory(story) {
      var _props = this.props;
      var onSelectStory = _props.onSelectStory;
      var selectedKind = _props.selectedKind;

      if (onSelectStory) onSelectStory(selectedKind, story);
    }
  }, {
    key: 'renderStory',
    value: function renderStory(story) {
      var selectedStory = this.props.selectedStory;

      var style = (0, _extends3.default)({}, storyStyle);
      var props = {
        key: story,
        style: style,
        onClick: this.fireOnStory.bind(this, story)
      };

      if (story === selectedStory) {
        style.fontWeight = 'bold';
        props.selectedStory = true;
      }

      return _react2.default.createElement(
        'div',
        props,
        story
      );
    }
  }, {
    key: 'renderKind',
    value: function renderKind(_ref) {
      var kind = _ref.kind;
      var stories = _ref.stories;
      var selectedKind = this.props.selectedKind;

      var style = (0, _extends3.default)({}, kindStyle);

      if (kind === selectedKind) {
        style.fontWeight = 'bold';
        return _react2.default.createElement(
          'div',
          { key: kind },
          _react2.default.createElement(
            'div',
            {
              style: style,
              onClick: this.fireOnKind.bind(this, kind),
              selectedKind: true
            },
            kind
          ),
          _react2.default.createElement(
            'div',
            null,
            stories.map(this.renderStory)
          )
        );
      }

      return _react2.default.createElement(
        'div',
        {
          key: kind,
          style: style,
          onClick: this.fireOnKind.bind(this, kind, null)
        },
        kind
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var stories = this.props.stories;

      return _react2.default.createElement(
        'div',
        { style: listStyle },
        stories.map(this.renderKind)
      );
    }
  }]);
  return Stories;
}(_react2.default.Component);

Stories.propTypes = {
  stories: _react2.default.PropTypes.array.isRequired,
  selectedKind: _react2.default.PropTypes.string.isRequired,
  selectedStory: _react2.default.PropTypes.string.isRequired,
  onSelectStory: _react2.default.PropTypes.func
};

exports.default = Stories;