'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeWithMobx = exports.composeWithObservable = exports.composeWithPromise = exports.composeWithTracker = exports.composeAll = exports.compose = undefined;
exports.disable = disable;
exports.getDisableMode = getDisableMode;
exports.setStubbingMode = setStubbingMode;
exports.getStubbingMode = getStubbingMode;
exports.setComposerStub = setComposerStub;
exports.setDefaultLoadingComponent = setDefaultLoadingComponent;
exports.setDefaultErrorComponent = setDefaultErrorComponent;
exports._getDefaultLoadingComponent = _getDefaultLoadingComponent;
exports._getDefaultErrorComponent = _getDefaultErrorComponent;

var _compose2 = require('./compose');

var _compose3 = _interopRequireDefault(_compose2);

var _compose_all = require('./compose_all');

var _compose_all2 = _interopRequireDefault(_compose_all);

var _with_tracker = require('./composers/with_tracker');

var _with_tracker2 = _interopRequireDefault(_with_tracker);

var _with_promise = require('./composers/with_promise');

var _with_promise2 = _interopRequireDefault(_with_promise);

var _with_observable = require('./composers/with_observable');

var _with_observable2 = _interopRequireDefault(_with_observable);

var _with_mobx = require('./composers/with_mobx');

var _with_mobx2 = _interopRequireDefault(_with_mobx);

var _common_components = require('./common_components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compose = exports.compose = _compose3.default;
var composeAll = exports.composeAll = _compose_all2.default;
var composeWithTracker = exports.composeWithTracker = _with_tracker2.default;
var composeWithPromise = exports.composeWithPromise = _with_promise2.default;
var composeWithObservable = exports.composeWithObservable = _with_observable2.default;
var composeWithMobx = exports.composeWithMobx = _with_mobx2.default;

var disableMode = false;
var stubbingMode = false;
var defaultErrorComponent = null;
var defaultLoadingComponent = null;

// A way to disable the functionality of react-komposer and always show the
// loading component.
// This is very useful in testing where we can ignore React kompser's behaviour.
function disable() {
  var value = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

  disableMode = value;
}

function getDisableMode() {
  return disableMode;
}

// stubbing

function setStubbingMode() {
  var value = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

  stubbingMode = value;
}

function getStubbingMode() {
  return stubbingMode;
}

function setComposerStub(Container, composerStub) {
  Container.__composerStub = composerStub;
}

// default components
function setDefaultLoadingComponent(comp) {
  defaultLoadingComponent = comp;
}

function setDefaultErrorComponent(comp) {
  defaultErrorComponent = comp;
}

function _getDefaultLoadingComponent() {
  return defaultLoadingComponent || _common_components.DefaultLoadingComponent;
}

function _getDefaultErrorComponent() {
  return defaultErrorComponent || _common_components.DefaultErrorComponent;
}