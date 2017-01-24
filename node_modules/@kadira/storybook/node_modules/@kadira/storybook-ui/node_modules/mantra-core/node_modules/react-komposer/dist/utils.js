'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inheritStatics = inheritStatics;
exports.isReactNative = isReactNative;

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function inheritStatics(Container, ChildComponent) {
  var childDisplayName =
  // Get the display name if it's set.
  ChildComponent.displayName ||
  // Get the display name from the function name.
  ChildComponent.name ||
  // If not, just add a default one.
  'ChildComponent';

  Container.displayName = 'Container(' + childDisplayName + ')';
  return (0, _hoistNonReactStatics2.default)(Container, ChildComponent);
}

function isReactNative() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return true;
  }

  return false;
}