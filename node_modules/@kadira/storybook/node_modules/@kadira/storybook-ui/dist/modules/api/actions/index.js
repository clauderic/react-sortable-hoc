'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = undefined;

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// define redux actions
var types = exports.types = {
  SET_STORIES: 'API_SET_STORIES',
  SELECT_STORY: 'API_SELECT_STORY',
  JUMP_TO_STORY: 'API_JUMP_TO_STORY',
  CLEAR_ACTIONS: 'API_CLEAR_ACTIONS',
  ADD_ACTION: 'API_ADD_ACTION',
  SET_OPTIONS: 'API_SET_OPTIONS'
};

exports.default = {
  api: _api2.default
};