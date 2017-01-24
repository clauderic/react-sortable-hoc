"use strict";

exports.__esModule = true;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
  var cwd, parts, loc, babelrc, packagejson, pkg;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cwd = process.cwd();
          parts = cwd.split(_path2.default.sep);

        case 2:
          loc = parts.join(_path2.default.sep);

          if (loc) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("break", 15);

        case 5:
          babelrc = _path2.default.join(loc, ".babelrc");

          if (!_fs2.default.existsSync(babelrc)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", [true, "Found config at " + babelrc]);

        case 8:
          packagejson = _path2.default.join(loc, "package.json");

          if (!_fs2.default.existsSync(packagejson)) {
            _context.next = 13;
            break;
          }

          pkg = require(packagejson);

          if (!pkg.babel) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", [true, "Found config at " + packagejson]);

        case 13:

          parts.pop();

        case 14:
          if (parts.length) {
            _context.next = 2;
            break;
          }

        case 15:
          return _context.abrupt("return", [false, "Found no .babelrc config"]);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));
module.exports = exports["default"];