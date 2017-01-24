'use strict';

var _fs = require('fs');

var _cover = require('./commands/cover');

var _cover2 = _interopRequireDefault(_cover);

var _ArgParser = require('./ArgParser');

var _ArgParser2 = _interopRequireDefault(_ArgParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//

//

(0, _ArgParser2.default)({
  cover: runCoverCommand
}).parse();

//

//

function runCoverCommand(opts) {
  var files = opts._.slice(1).reduce(function (memo, file) {
    return memo.concat(lookupFile(file) || []);
  }, []);

  opts.include = opts.include.concat(files);
  (0, _cover2.default)(opts);
}

function lookupFile(path) {
  if ((0, _fs.existsSync)(path)) {
    var stat = (0, _fs.statSync)(path);
    if (stat.isFile()) return path;
  }
}