#!/usr/bin/env node
'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = console;

_commander2.default.version(_package2.default.version).option('-p, --port [number]', 'Port to run Storybook (Required)', parseInt).option('-h, --host [string]', 'Host to run Storybook').option('-s, --static-dir <dir-names>', 'Directory where to load static files from', _utils.parseList).option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from').parse(process.argv);

if (!_commander2.default.port) {
  logger.error('Error: port to run Storybook is required!\n');
  _commander2.default.help();
  process.exit(-1);
}

// Used with `app.listen` below
var listenAddr = [_commander2.default.port];

if (_commander2.default.host) {
  listenAddr.push(_commander2.default.host);
}

var app = (0, _express2.default)();

if (_commander2.default.staticDir) {
  _commander2.default.staticDir.forEach(function (dir) {
    var staticPath = _path2.default.resolve(dir);
    if (!_fs2.default.existsSync(staticPath)) {
      logger.error('Error: no such directory to load static files: ' + staticPath);
      process.exit(-1);
    }
    logger.log('=> Loading static files from: ' + staticPath + ' .');
    app.use(_express2.default.static(staticPath, { index: false }));
  });
}

// Build the webpack configuration using the `baseConfig`
// custom `.babelrc` file and `webpack.config.js` files
var configDir = _commander2.default.configDir || './.storybook';
app.use((0, _middleware2.default)(configDir));

app.listen.apply(app, listenAddr.concat([function (error) {
  if (error) {
    throw error;
  } else {
    var address = 'http://' + (_commander2.default.host || 'localhost') + ':' + _commander2.default.port + '/';
    logger.info('\nReact Storybook started on => ' + address + '\n');
  }
}]));