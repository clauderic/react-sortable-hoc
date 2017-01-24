'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composer = undefined;

var _layout = require('../components/layout');

var _layout2 = _interopRequireDefault(_layout);

var _mantraCore = require('mantra-core');

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

var _redux_composer = require('../libs/redux_composer');

var _redux_composer2 = _interopRequireDefault(_redux_composer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composer = exports.composer = function composer(_ref) {
  var shortcuts = _ref.shortcuts;

  return (0, _lodash2.default)(shortcuts, 'showLeftPanel', 'showDownPanel', 'goFullScreen', 'downPanelInRight');
};

exports.default = (0, _mantraCore.composeAll)((0, _redux_composer2.default)(composer), (0, _mantraCore.useDeps)())(_layout2.default);