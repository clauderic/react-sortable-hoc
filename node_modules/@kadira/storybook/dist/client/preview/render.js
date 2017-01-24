'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderError = renderError;
exports.renderMain = renderMain;
exports.default = renderPreview;

require('airbnb-js-shims');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _error_display = require('./error_display');

var _error_display2 = _interopRequireDefault(_error_display);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// check whether we're running on node/browser
var isBrowser = typeof window !== 'undefined';

var rootEl = null;
var previousKind = '';
var previousStory = '';

if (isBrowser) {
  rootEl = document.getElementById('root');
}

function renderError(error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  var realError = new Error(error.message);
  realError.stack = error.stack;
  var redBox = _react2.default.createElement(_error_display2.default, { error: realError });
  _reactDom2.default.render(redBox, rootEl);
}

function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return null;

  var NoPreview = function NoPreview() {
    return _react2.default.createElement(
      'p',
      null,
      'No Preview Available!'
    );
  };
  var noPreview = _react2.default.createElement(NoPreview, null);
  var selectedKind = data.selectedKind;
  var selectedStory = data.selectedStory;


  var story = storyStore.getStory(selectedKind, selectedStory);
  if (!story) {
    return _reactDom2.default.render(noPreview, rootEl);
  }

  // Unmount the previous story only if selectedKind or selectedStory has changed.
  // renderMain() gets executed after each action. Actions will cause the whole
  // story to re-render without this check.
  //    https://github.com/kadirahq/react-storybook/issues/116
  if (selectedKind !== previousKind || previousStory !== selectedStory) {
    // We need to unmount the existing set of components in the DOM node.
    // Otherwise, React may not recrease instances for every story run.
    // This could leads to issues like below:
    //    https://github.com/kadirahq/react-storybook/issues/81
    previousKind = selectedKind;
    previousStory = selectedStory;
    _reactDom2.default.unmountComponentAtNode(rootEl);
  }

  var context = {
    kind: selectedKind,
    story: selectedStory
  };

  try {
    return _reactDom2.default.render(story(context), rootEl);
  } catch (ex) {
    return renderError(ex);
  }
}

function renderPreview(_ref) {
  var reduxStore = _ref.reduxStore;
  var storyStore = _ref.storyStore;

  var state = reduxStore.getState();
  if (state.error) {
    return renderError(state.error);
  }

  return renderMain(state, storyStore);
}