'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composer = undefined;

var _search_box = require('../components/search_box');

var _search_box2 = _interopRequireDefault(_search_box);

var _mantraCore = require('mantra-core');

var _redux_composer = require('../libs/redux_composer');

var _redux_composer2 = _interopRequireDefault(_redux_composer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composer = exports.composer = function composer(_ref, _ref2) {
  var api = _ref.api;
  var shortcuts = _ref.shortcuts;
  var actions = _ref2.actions;

  var actionMap = actions();
  return {
    showSearchBox: shortcuts.showSearchBox,
    stories: api.stories,
    onSelectStory: actionMap.api.selectStory,
    handleEvent: actionMap.shortcuts.handleEvent
  };
};

exports.default = (0, _mantraCore.composeAll)((0, _redux_composer2.default)(composer), (0, _mantraCore.useDeps)())(_search_box2.default);