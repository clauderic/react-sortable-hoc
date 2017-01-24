'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('./');

exports.default = {
  setStories: function setStories(_ref, stories) {
    var reduxStore = _ref.reduxStore;

    reduxStore.dispatch({
      type: _.types.SET_STORIES,
      stories: stories
    });
  },
  selectStory: function selectStory(_ref2, kind, story) {
    var reduxStore = _ref2.reduxStore;

    reduxStore.dispatch({
      type: _.types.SELECT_STORY,
      kind: kind,
      story: story
    });
  },
  jumpToStory: function jumpToStory(_ref3, direction) {
    var reduxStore = _ref3.reduxStore;

    reduxStore.dispatch({
      type: _.types.JUMP_TO_STORY,
      direction: direction
    });
  },
  clearActions: function clearActions(_ref4) {
    var reduxStore = _ref4.reduxStore;

    reduxStore.dispatch({
      type: _.types.CLEAR_ACTIONS
    });
  },
  addAction: function addAction(_ref5, action) {
    var reduxStore = _ref5.reduxStore;

    reduxStore.dispatch({
      type: _.types.ADD_ACTION,
      action: action
    });
  },
  setOptions: function setOptions(_ref6, options) {
    var reduxStore = _ref6.reduxStore;

    reduxStore.dispatch({
      type: _.types.SET_OPTIONS,
      options: options
    });
  }
};