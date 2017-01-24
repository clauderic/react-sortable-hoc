"use strict";

exports.__esModule = true;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = {};

function getInfo(packageName) {
  if (cache[packageName]) {
    return cache[packageName];
  } else {
    return cache[packageName] = new _promise2.default(function (resolve, reject) {
      _request2.default.get({
        url: "https://registry.npmjs.org/" + packageName + "/latest",
        json: true
      }, function (err, res, body) {
        if (err) {
          reject(err);
        } else {
          resolve(cache[packageName] = body);
        }
      });
    });
  }
}

exports.default = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(packages) {
    var filteredPackages, promises, _iterator, _isArray, _i, _ref, _pkg, infos, messages, i, info, pkg;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filteredPackages = [];
            promises = [];
            _iterator = packages, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);

          case 3:
            if (!_isArray) {
              _context.next = 9;
              break;
            }

            if (!(_i >= _iterator.length)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("break", 20);

          case 6:
            _ref = _iterator[_i++];
            _context.next = 13;
            break;

          case 9:
            _i = _iterator.next();

            if (!_i.done) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("break", 20);

          case 12:
            _ref = _i.value;

          case 13:
            _pkg = _ref;

            if (!(_pkg.name.indexOf("babel-") !== 0)) {
              _context.next = 16;
              break;
            }

            return _context.abrupt("continue", 18);

          case 16:

            promises.push(getInfo(_pkg.name));
            filteredPackages.push(_pkg);

          case 18:
            _context.next = 3;
            break;

          case 20:
            _context.next = 22;
            return _promise2.default.all(promises);

          case 22:
            infos = _context.sent;
            messages = [];
            i = 0;

          case 25:
            if (!(i < infos.length)) {
              _context.next = 34;
              break;
            }

            info = infos[i];
            pkg = filteredPackages[i];

            // https://github.com/babel/babel/issues/2915

            if (!(pkg.name === "babel-runtime")) {
              _context.next = 30;
              break;
            }

            return _context.abrupt("continue", 31);

          case 30:

            if (info.version !== pkg.version) {
              messages.push(pkg.name + " - Latest is " + info.version + ". Local version is " + pkg.version);
            }

          case 31:
            i++;
            _context.next = 25;
            break;

          case 34:
            if (!messages.length) {
              _context.next = 38;
              break;
            }

            return _context.abrupt("return", [false, "We found some outdated packages:\n\n- " + messages.join("\n- ")]);

          case 38:
            return _context.abrupt("return", [true, "All babel packages appear to be up to date"]);

          case 39:
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