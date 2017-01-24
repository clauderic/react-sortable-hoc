'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('./');

exports.default = {
  setStoryFilter: function setStoryFilter(_ref, filter) {
    var reduxStore = _ref.reduxStore;

    reduxStore.dispatch({
      type: _.types.SET_STORY_FILTER,
      filter: filter
    });
  },
  toggleShortcutsHelp: function toggleShortcutsHelp(_ref2) {
    var reduxStore = _ref2.reduxStore;

    reduxStore.dispatch({
      type: _.types.TOGGLE_SHORTCUTS_HELP
    });
  }
};