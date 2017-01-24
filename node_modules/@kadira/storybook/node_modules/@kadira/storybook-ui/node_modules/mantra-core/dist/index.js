'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disable = exports.composeAll = exports.composeWithObservable = exports.composeWithPromise = exports.composeWithTracker = exports.compose = exports.useDeps = exports.createApp = undefined;

var _reactSimpleDi = require('react-simple-di');

var _reactKomposer = require('react-komposer');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export this module's functions
var createApp = exports.createApp = function createApp() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(_app2.default, [null].concat(args)))();
};

// export react-simple-di functions
var useDeps = exports.useDeps = _reactSimpleDi.useDeps;

// export react-komposer functions
var compose = exports.compose = _reactKomposer.compose;
var composeWithTracker = exports.composeWithTracker = _reactKomposer.composeWithTracker;
var composeWithPromise = exports.composeWithPromise = _reactKomposer.composeWithPromise;
var composeWithObservable = exports.composeWithObservable = _reactKomposer.composeWithObservable;
var composeAll = exports.composeAll = _reactKomposer.composeAll;
var disable = exports.disable = _reactKomposer.disable;