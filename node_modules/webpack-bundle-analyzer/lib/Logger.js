'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LEVELS = ['info', 'warn', 'error', 'silent'];

var LEVEL_TO_CONSOLE_METHOD = new Map([['info', 'log'], ['warn', 'log']]);

var Logger = function () {
  function Logger() {
    var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'info';

    _classCallCheck(this, Logger);

    this.activeLevels = new Set();
    this.setLogLevel(level);
  }

  Logger.prototype.setLogLevel = function setLogLevel(level) {
    var levelIndex = LEVELS.indexOf(level);

    if (levelIndex === -1) throw new Error('Invalid log level "' + level + '". Use one of these: ' + LEVELS.join(', '));

    this.activeLevels.clear();

    for (var _iterator = LEVELS.entries(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _ref2 = _ref,
          i = _ref2[0],
          _level = _ref2[1];

      if (i >= levelIndex) this.activeLevels.add(_level);
    }
  };

  Logger.prototype._log = function _log(level) {
    var _console;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_console = console)[LEVEL_TO_CONSOLE_METHOD.get(level) || level].apply(_console, args);
  };

  return Logger;
}();

Logger.levels = LEVELS;
;

LEVELS.forEach(function (level) {
  if (level === 'silent') return;

  Logger.prototype[level] = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (this.activeLevels.has(level)) this._log.apply(this, [level].concat(args));
  };
});

module.exports = Logger;