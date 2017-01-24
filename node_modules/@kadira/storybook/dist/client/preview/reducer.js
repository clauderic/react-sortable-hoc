'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = reducer;

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.types.CLEAR_ERROR:
      {
        return (0, _extends3.default)({}, state, {
          error: null
        });
      }

    case _actions.types.SET_ERROR:
      {
        return (0, _extends3.default)({}, state, {
          error: action.error
        });
      }

    case _actions.types.SELECT_STORY:
      {
        return (0, _extends3.default)({}, state, {
          selectedKind: action.kind,
          selectedStory: action.story
        });
      }

    case _actions.types.SET_INITIAL_STORY:
      {
        var newState = (0, _extends3.default)({}, state);
        var storyKindList = action.storyKindList;

        if (!newState.selectedKind && storyKindList.length > 0) {
          newState.selectedKind = storyKindList[0].kind;
          newState.selectedStory = storyKindList[0].stories[0];
        }
        return newState;
      }

    default:
      return state;
  }
}