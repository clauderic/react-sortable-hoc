'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composer = undefined;

var _left_panel = require('../components/left_panel');

var _left_panel2 = _interopRequireDefault(_left_panel);

var _mantraCore = require('mantra-core');

var _filters = require('../libs/filters');

var filters = _interopRequireWildcard(_filters);

var _redux_composer = require('../libs/redux_composer');

var _redux_composer2 = _interopRequireDefault(_redux_composer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composer = exports.composer = function composer(_ref, _ref2) {
  var api = _ref.api;
  var ui = _ref.ui;
  var actions = _ref2.actions;

  var actionMap = actions();
  var stories = api.stories;
  var selectedKind = api.selectedKind;
  var selectedStory = api.selectedStory;
  var options = api.options;
  var storyFilter = ui.storyFilter;


  var data = {
    stories: filters.storyFilter(stories, storyFilter, selectedKind, selectedStory),
    selectedKind: selectedKind,
    selectedStory: selectedStory,
    onSelectStory: actionMap.api.selectStory,

    storyFilter: storyFilter,
    onStoryFilter: actionMap.ui.setStoryFilter,

    openShortcutsHelp: actionMap.ui.toggleShortcutsHelp,
    name: options.name,
    url: options.url
  };

  return data;
};

exports.default = (0, _mantraCore.composeAll)((0, _redux_composer2.default)(composer), (0, _mantraCore.useDeps)())(_left_panel2.default);