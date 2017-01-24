"use strict";

exports.__esModule = true;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(packages) {
    var foundDeps, foundDuplicated, duplicatedPackages, checkDep, _iterator, _isArray, _i, _ref, pkg, msg, name;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            checkDep = function checkDep(name) {
              if (name.indexOf("babel-") === 0 && foundDeps[name]) {
                foundDuplicated = true;
                duplicatedPackages[name] = (duplicatedPackages[name] || 0) + 1;
              }

              foundDeps[name] = true;
            };

            foundDeps = {};
            foundDuplicated = false;
            duplicatedPackages = {};
            _iterator = packages, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);

          case 5:
            if (!_isArray) {
              _context.next = 11;
              break;
            }

            if (!(_i >= _iterator.length)) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("break", 19);

          case 8:
            _ref = _iterator[_i++];
            _context.next = 15;
            break;

          case 11:
            _i = _iterator.next();

            if (!_i.done) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("break", 19);

          case 14:
            _ref = _i.value;

          case 15:
            pkg = _ref;

            checkDep(pkg.name);

          case 17:
            _context.next = 5;
            break;

          case 19:
            if (!foundDuplicated) {
              _context.next = 26;
              break;
            }

            msg = "Found these duplicate packages:\n\n";


            for (name in duplicatedPackages) {
              msg += "- " + name + " x " + duplicatedPackages[name] + "\n";
            }

            msg += "\nRecommend running `npm dedupe`";
            return _context.abrupt("return", [false, msg]);

          case 26:
            return _context.abrupt("return", [true, "No duplicate babel packages found"]);

          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function (_x) {
    return ref.apply(this, arguments);
  };
}();

module.exports = exports["default"];