'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (context) {
  var queryParams = context.queryParams;
  var reduxStore = context.reduxStore;
  var window = context.window;
  var pageBus = context.pageBus;
  // set the story if correct params are loaded via the URL.

  if (queryParams.selectedKind) {
    reduxStore.dispatch((0, _actions.selectStory)(queryParams.selectedKind, queryParams.selectedStory));
  }

  // Handle keyEvents and pass them to the parent.
  window.onkeydown = function (e) {
    var parsedEvent = (0, _key_events2.default)(e);
    if (parsedEvent) {
      pageBus.emit('applyShortcut', { event: parsedEvent });
    }
  };
};

var _actions = require('./actions');

var _key_events = require('@kadira/storybook-ui/dist/libs/key_events');

var _key_events2 = _interopRequireDefault(_key_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }