'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.getStorybook = exports.clearDecorators = exports.addDecorator = exports.setAddon = exports.linkTo = exports.action = exports.storiesOf = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

require('es6-shim');

var _story_store = require('./story_store');

var _story_store2 = _interopRequireDefault(_story_store);

var _page_bus = require('./page_bus');

var _page_bus2 = _interopRequireDefault(_page_bus);

var _client_api = require('./client_api');

var _client_api2 = _interopRequireDefault(_client_api);

var _config_api = require('./config_api');

var _config_api2 = _interopRequireDefault(_config_api);

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _redux = require('redux');

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// check whether we're running on node/browser
var isBrowser = typeof window !== 'undefined';

var storyStore = new _story_store2.default();
var reduxStore = (0, _redux.createStore)(_reducer2.default);
var context = { storyStore: storyStore, reduxStore: reduxStore };

if (isBrowser) {
  var queryParams = _qs2.default.parse(window.location.search.substring(1));
  var pageBus = new _page_bus2.default(queryParams.dataId, reduxStore);
  (0, _assign2.default)(context, { pageBus: pageBus, window: window, queryParams: queryParams });
  pageBus.init();
  (0, _init2.default)(context);
}

var clientApi = new _client_api2.default(context);
var configApi = new _config_api2.default(context);

// do exports
var storiesOf = exports.storiesOf = clientApi.storiesOf.bind(clientApi);
var action = exports.action = clientApi.action.bind(clientApi);
var linkTo = exports.linkTo = clientApi.linkTo.bind(clientApi);
var setAddon = exports.setAddon = clientApi.setAddon.bind(clientApi);
var addDecorator = exports.addDecorator = clientApi.addDecorator.bind(clientApi);
var clearDecorators = exports.clearDecorators = clientApi.clearDecorators.bind(clientApi);
var getStorybook = exports.getStorybook = clientApi.getStorybook.bind(clientApi);
var configure = exports.configure = configApi.configure.bind(configApi);

// initialize the UI
var renderUI = function renderUI() {
  if (isBrowser) {
    (0, _render2.default)(context);
  }
};

reduxStore.subscribe(renderUI);