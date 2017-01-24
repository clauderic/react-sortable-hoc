'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.features = undefined;
exports.isModifierPressed = isModifierPressed;
exports.default = handle;

var _keycode = require('keycode');

var _keycode2 = _interopRequireDefault(_keycode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var features = exports.features = {
  FULLSCREEN: 1,
  DOWN_PANEL: 2,
  LEFT_PANEL: 3,
  SHORTCUTS_HELP: 4,
  ESCAPE: 5,
  NEXT_STORY: 6,
  PREV_STORY: 7,
  SEARCH: 8,
  DOWN_PANEL_IN_RIGHT: 9
};

function isModifierPressed(e) {
  return (e.ctrlKey || e.keyCode === 91 || e.metaKey) && e.shiftKey;
}

function handle(e) {
  if (e.keyCode === (0, _keycode2.default)('escape')) {
    // We don't need to preventDefault escape.
    // Just getting the event is enough for us.
    return features.ESCAPE;
  }

  if (!isModifierPressed(e)) return false;

  switch (e.keyCode) {
    case (0, _keycode2.default)('F'):
      e.preventDefault();
      return features.FULLSCREEN;
    case (0, _keycode2.default)('D'):
      e.preventDefault();
      return features.DOWN_PANEL;
    case (0, _keycode2.default)('L'):
      e.preventDefault();
      return features.LEFT_PANEL;
    case (0, _keycode2.default)('right'):
      e.preventDefault();
      return features.NEXT_STORY;
    case (0, _keycode2.default)('left'):
      e.preventDefault();
      return features.PREV_STORY;
    case (0, _keycode2.default)('P'):
      e.preventDefault();
      return features.SEARCH;
    case (0, _keycode2.default)('J'):
      e.preventDefault();
      return features.DOWN_PANEL_IN_RIGHT;
    default:
      return false;
  }
}