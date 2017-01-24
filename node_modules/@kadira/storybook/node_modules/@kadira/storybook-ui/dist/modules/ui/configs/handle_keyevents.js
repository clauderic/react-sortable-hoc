'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (actions) {
  window.onkeydown = function (e) {
    var parsedEvent = (0, _key_events2.default)(e);
    if (parsedEvent) {
      actions.shortcuts.handleEvent(parsedEvent);
    }
  };
};

var _key_events = require('../../../libs/key_events');

var _key_events2 = _interopRequireDefault(_key_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }