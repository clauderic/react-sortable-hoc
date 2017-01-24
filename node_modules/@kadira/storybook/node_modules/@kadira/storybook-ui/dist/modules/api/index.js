'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actions2 = require('./actions');

var _actions3 = _interopRequireDefault(_actions2);

var _reducers = require('./configs/reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _init_api = require('./configs/init_api');

var _init_api2 = _interopRequireDefault(_init_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  reducers: _reducers2.default,
  actions: _actions3.default,
  load: function load(_ref, _actions) {
    var reduxStore = _ref.reduxStore;
    var provider = _ref.provider;

    (0, _init_api2.default)(provider, reduxStore, _actions);
  }
};