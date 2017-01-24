'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('./');

var _key_events = require('../../../libs/key_events');

var _actions = require('../../api/actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  handleEvent: function handleEvent(context, event) {
    var reduxStore = context.reduxStore;

    switch (event) {
      case _key_events.features.NEXT_STORY:
        _actions2.default.api.jumpToStory(context, 1);
        break;
      case _key_events.features.PREV_STORY:
        _actions2.default.api.jumpToStory(context, -1);
        break;
      default:
        reduxStore.dispatch({
          type: _.types.HANDLE_EVENT,
          event: event
        });
    }
  },
  setLayout: function setLayout(context, layout) {
    var reduxStore = context.reduxStore;

    reduxStore.dispatch({
      type: _.types.SET_LAYOUT,
      layout: layout
    });
  }
};