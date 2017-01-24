'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composer = undefined;

var _shortcuts_help = require('../components/shortcuts_help');

var _shortcuts_help2 = _interopRequireDefault(_shortcuts_help);

var _mantraCore = require('mantra-core');

var _redux_composer = require('../libs/redux_composer');

var _redux_composer2 = _interopRequireDefault(_redux_composer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composer = exports.composer = function composer(_ref, _ref2) {
  var ui = _ref.ui;
  var actions = _ref2.actions;

  var actionMap = actions();
  var data = {
    isOpen: ui.showShortcutsHelp,
    onClose: actionMap.ui.toggleShortcutsHelp
  };

  return data;
};

exports.default = (0, _mantraCore.composeAll)((0, _redux_composer2.default)(composer), (0, _mantraCore.useDeps)())(_shortcuts_help2.default);