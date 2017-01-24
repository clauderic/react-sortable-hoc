'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.default = function (domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  var reducer = (0, _redux.combineReducers)((0, _extends3.default)({}, _shortcuts2.default.reducers, _api2.default.reducers, _ui2.default.reducers));

  var devTools = window.devToolsExtension && window.devToolsExtension();
  var reduxStore = (0, _redux.createStore)(reducer, devTools);

  var context = (0, _context2.default)(reduxStore, domNode, provider);
  var app = (0, _mantraCore.createApp)(context);

  app.loadModule(_shortcuts2.default);
  app.loadModule(_api2.default);
  app.loadModule(_ui2.default);

  app.init();
};

var _redux = require('redux');

var _mantraCore = require('mantra-core');

var _context = require('./context.js');

var _context2 = _interopRequireDefault(_context);

var _shortcuts = require('./modules/shortcuts');

var _shortcuts2 = _interopRequireDefault(_shortcuts);

var _api = require('./modules/api');

var _api2 = _interopRequireDefault(_api);

var _ui = require('./modules/ui');

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Provider = exports.Provider = function () {
  function Provider() {
    (0, _classCallCheck3.default)(this, Provider);
  }

  (0, _createClass3.default)(Provider, [{
    key: 'renderPreview',
    value: function renderPreview(selectedKind, selectedStory) {
      // eslint-disable-line no-unused-vars
      throw new Error('Provider.renderPreview() is not implemented!');
    }
  }, {
    key: 'handleAPI',
    value: function handleAPI(api) {
      // eslint-disable-line no-unused-vars
      throw new Error('Provider.handleAPI() is not implemented!');
    }
  }]);
  return Provider;
}();