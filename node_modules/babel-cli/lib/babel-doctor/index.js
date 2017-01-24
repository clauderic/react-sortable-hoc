"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

//

var run = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var promises, key, fn, results, _iterator2, _isArray2, _i2, _ref2, _ref3, success, message, multiline;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            promises = [];
            _context.t0 = _regenerator2.default.keys(rules);

          case 2:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 10;
              break;
            }

            key = _context.t1.value;

            if (!(key[0] === "_")) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("continue", 2);

          case 6:
            fn = rules[key];

            promises.push(fn(packages));
            _context.next = 2;
            break;

          case 10:
            _context.next = 12;
            return _promise2.default.all(promises);

          case 12:
            results = _context.sent;
            _iterator2 = results, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);

          case 14:
            if (!_isArray2) {
              _context.next = 20;
              break;
            }

            if (!(_i2 >= _iterator2.length)) {
              _context.next = 17;
              break;
            }

            return _context.abrupt("break", 34);

          case 17:
            _ref2 = _iterator2[_i2++];
            _context.next = 24;
            break;

          case 20:
            _i2 = _iterator2.next();

            if (!_i2.done) {
              _context.next = 23;
              break;
            }

            return _context.abrupt("break", 34);

          case 23:
            _ref2 = _i2.value;

          case 24:
            _ref3 = _ref2;
            success = _ref3[0];
            message = _ref3[1];

            if (!success) didError = true;
            multiline = message.indexOf("\n") >= 0;

            if (multiline) sep();
            log((success ? _logSymbols2.default.success : _logSymbols2.default.error) + " " + message);
            if (multiline) sep();

          case 32:
            _context.next = 14;
            break;

          case 34:

            sep();

            if (didError) {
              log(_chalk2.default.red("Found potential issues on your machine :("));
            } else {
              log(_chalk2.default.green("Everything looks all right!"));
            }

            sep();

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function run() {
    return ref.apply(this, arguments);
  };
}();

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _rules = require("./rules");

var rules = _interopRequireWildcard(_rules);

var _logSymbols = require("log-symbols");

var _logSymbols2 = _interopRequireDefault(_logSymbols);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var didError = false;
var lastWasSep = false;

function sep() {
  if (lastWasSep) return;
  lastWasSep = true;

  console.log();
}

function log(msg) {
  lastWasSep = false;
  console.log(msg);
}

//

log("\n" + _chalk2.default.underline.yellow("Babel Doctor"));
log("Running sanity checks on your system. This may take a few minutes...\n");

//

var packages = [];

var nodeModulesDirectories = [_path2.default.join(process.cwd(), "node_modules")];

while (nodeModulesDirectories.length) {
  var loc = nodeModulesDirectories.shift();
  if (!_fs2.default.existsSync(loc)) continue;

  var packagesNames = _fs2.default.readdirSync(loc);

  for (var _iterator = packagesNames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var packageName = _ref;

    if (packageName[0] === ".") continue;

    var packageLoc = _path2.default.join(loc, packageName);
    var packageJsonLoc = _path2.default.join(packageLoc, "package.json");
    if (!_fs2.default.existsSync(packageJsonLoc)) continue;

    packages.push({
      name: packageName,
      loc: packageLoc,
      version: require(packageJsonLoc).version
    });

    nodeModulesDirectories.push(_path2.default.join(packageLoc, "node_modules"));
  }
}

run().then(function () {
  process.exit(0);
}, function (err) {
  console.error(err.stack);
  process.exit(1);
});