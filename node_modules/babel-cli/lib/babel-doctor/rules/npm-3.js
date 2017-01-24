"use strict";

exports.__esModule = true;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.default = function () {
  return new _promise2.default(function (resolve) {
    (0, _binVersionCheck2.default)("npm", ">=3.3.0", function (err) {
      if (err) {
        var message = "Your npm version is outdated. Upgrade to the latest version by running:\n$ " + _chalk2.default.magenta("npm install -g npm") + ".";
        if (process.platform === "win32") {
          message += " See this guide if you are having trouble upgrading: " + _chalk2.default.underline.blue("https://github.com/npm/npm/wiki/Troubleshooting#upgrading-on-windows");
        }
        resolve([false, message]);
      } else {
        resolve([true, "You're on npm >=3.3.0"]);
      }
    });
  });
};

var _binVersionCheck = require("bin-version-check");

var _binVersionCheck2 = _interopRequireDefault(_binVersionCheck);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"]; /* eslint max-len: 0 */