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

var _reactFuzzy = require('react-fuzzy');

var _reactFuzzy2 = _interopRequireDefault(_reactFuzzy);

var _key_events = require('../../../libs/key_events');

var _theme = require('./theme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchBoxStyle = (0, _extends3.default)({
  position: 'absolute',
  backgroundColor: '#FFF',
  top: '100px',
  left: '50%',
  marginLeft: '-215px'
}, _theme.baseFonts);

var formatStories = function formatStories(stories) {
  var formattedStories = [];
  var i = 0;
  stories.forEach(function (val) {
    formattedStories.push({
      type: 'kind',
      value: val.kind,
      id: i++
    });

    val.stories.forEach(function (story) {
      formattedStories.push({
        type: 'story',
        value: story,
        id: i++,
        kind: val.kind
      });
    });
  });

  return formattedStories;
};

var suggestionTemplate = function suggestionTemplate(props, state, styles) {
  return state.results.map(function (val, i) {
    var style = state.selectedIndex === i ? styles.selectedResultStyle : styles.resultsStyle;
    return _react2.default.createElement(
      'div',
      { key: i, style: style },
      val.value,
      _react2.default.createElement(
        'span',
        { style: { float: 'right', opacity: 0.5 } },
        val.type === 'story' ? 'in ' + val.kind : 'Kind'
      )
    );
  });
};

var SearchBox = function (_React$Component) {
  (0, _inherits3.default)(SearchBox, _React$Component);

  function SearchBox(props) {
    (0, _classCallCheck3.default)(this, SearchBox);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SearchBox).call(this, props));

    _this.onSelect = _this.onSelect.bind(_this);
    _this.fireOnStory = _this.fireOnStory.bind(_this);
    _this.fireOnKind = _this.fireOnKind.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(SearchBox, [{
    key: 'onSelect',
    value: function onSelect(selected) {
      var handleEvent = this.props.handleEvent;

      if (selected.type === 'story') this.fireOnStory(selected.value, selected.kind);else this.fireOnKind(selected.value);
      handleEvent(_key_events.features.SEARCH);
    }
  }, {
    key: 'fireOnKind',
    value: function fireOnKind(kind) {
      var onSelectStory = this.props.onSelectStory;

      if (onSelectStory) onSelectStory(kind, null);
    }
  }, {
    key: 'fireOnStory',
    value: function fireOnStory(story, kind) {
      var onSelectStory = this.props.onSelectStory;

      if (onSelectStory) onSelectStory(kind, story);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { style: searchBoxStyle },
        this.props.showSearchBox && _react2.default.createElement(_reactFuzzy2.default, {
          list: formatStories(this.props.stories),
          onSelect: this.onSelect,
          keys: ['value', 'type'],
          resultsTemplate: suggestionTemplate,
          autoFocus: true
        })
      );
    }
  }]);
  return SearchBox;
}(_react2.default.Component);

exports.default = SearchBox;


SearchBox.propTypes = {
  showSearchBox: _react2.default.PropTypes.bool.isRequired,
  stories: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object).isRequired,
  onSelectStory: _react2.default.PropTypes.func.isRequired,
  handleEvent: _react2.default.PropTypes.func.isRequired
};