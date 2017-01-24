'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composer = composer;

var _action_logger = require('../components/action_logger');

var _action_logger2 = _interopRequireDefault(_action_logger);

var _mantraCore = require('mantra-core');

var _redux_composer = require('../libs/redux_composer');

var _redux_composer2 = _interopRequireDefault(_redux_composer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function composer(_ref, _ref2) {
  var api = _ref.api;
  var actions = _ref2.actions;

  var actionMap = actions();
  var data = {
    onClear: actionMap.api.clearActions,
    actions: api.actions
  };

  return data;
}

exports.default = (0, _mantraCore.composeAll)((0, _redux_composer2.default)(composer), (0, _mantraCore.useDeps)())(_action_logger2.default);