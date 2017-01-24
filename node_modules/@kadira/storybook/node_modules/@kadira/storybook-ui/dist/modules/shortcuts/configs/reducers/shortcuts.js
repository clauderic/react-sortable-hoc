'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.keyEventToState = keyEventToState;

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.types.HANDLE_EVENT:
      {
        return (0, _extends3.default)({}, state, keyEventToState(state, action.event));
      }

    case _actions.types.SET_LAYOUT:
      {
        return (0, _extends3.default)({}, state, action.layout);
      }

    default:
      return state;
  }
};

var _actions = require('../../actions');

var _key_events = require('../../../../libs/key_events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultState = {
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: false
};

function keyEventToState(state, event) {
  switch (event) {
    case _key_events.features.FULLSCREEN:
      return { goFullScreen: !state.goFullScreen };
    case _key_events.features.DOWN_PANEL:
      return { showDownPanel: !state.showDownPanel };
    case _key_events.features.LEFT_PANEL:
      return { showLeftPanel: !state.showLeftPanel };
    case _key_events.features.SEARCH:
      return { showSearchBox: !state.showSearchBox };
    case _key_events.features.DOWN_PANEL_IN_RIGHT:
      return { downPanelInRight: !state.downPanelInRight };
    default:
      return {};
  }
}