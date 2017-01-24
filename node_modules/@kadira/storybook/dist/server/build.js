#!/usr/bin/env node
'use strict';

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _webpackConfig = require('./webpack.config.prod');

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _index = require('./index.html');

var _index2 = _interopRequireDefault(_index);

var _iframe = require('./iframe.html');

var _iframe2 = _interopRequireDefault(_iframe);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// avoid ESLint errors
var logger = console;

_commander2.default.version(_package2.default.version).option('-s, --static-dir <dir-names>', 'Directory where to load static files from', _utils.parseList).option('-o, --output-dir [dir-name]', 'Directory where to store built files').option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from').parse(process.argv);

// Build the webpack configuration using the `baseConfig`
// custom `.babelrc` file and `webpack.config.js` files
var configDir = _commander2.default.configDir || './.storybook';
var config = (0, _config2.default)('PRODUCTION', _webpackConfig2.default, configDir);

// remove the leading '/'
var publicPath = config.output.publicPath;
if (publicPath[0] === '/') {
  publicPath = publicPath.slice(1);
}

// create output directory (and the static dir) if not exists
var outputDir = _commander2.default.outputDir || './storybook-static';
_shelljs2.default.mkdir('-p', _path2.default.resolve(outputDir, publicPath));

// copy all static files
if (_commander2.default.staticDir) {
  _commander2.default.staticDir.forEach(function (dir) {
    if (!_fs2.default.existsSync(dir)) {
      logger.error('Error: no such directory to load static files: ' + dir);
      process.exit(-1);
    }
    logger.log('=> Copying static files from: ' + dir);
    _shelljs2.default.cp('-r', dir + '/', outputDir);
  });
}

// Write both the storybook UI and IFRAME HTML files to destination path.
var headHtml = (0, _utils.getHeadHtml)(configDir);
_fs2.default.writeFileSync(_path2.default.resolve(outputDir, 'index.html'), (0, _index2.default)(publicPath));
_fs2.default.writeFileSync(_path2.default.resolve(outputDir, 'iframe.html'), (0, _iframe2.default)(headHtml, publicPath));

// compile all resources with webpack and write them to the disk.
logger.log('Building storybook ...');
(0, _webpack2.default)(config).compile(function (err, stats) {
  for (var filename in stats.assets) {
    if (!stats.assets.hasOwnProperty(filename)) {
      continue;
    }

    var asset = stats.assets[filename];
    if (asset.children && asset.children.length) {
      var _source = asset.children[0]._value;
      var _dstPath = _path2.default.resolve(outputDir, publicPath, filename);
      _fs2.default.writeFileSync(_dstPath, _source);
      continue;
    }

    var source = asset._value;
    var dstPath = _path2.default.resolve(outputDir, publicPath, filename);

    // Ensure the asset directory exists
    _shelljs2.default.mkdir('-p', _path2.default.parse(dstPath).dir);
    _fs2.default.writeFileSync(dstPath, source);
  }

  // We need to copy the manager bundle distributed via the React Storybook
  // directly into the production build overring webpack.
  _shelljs2.default.cp(_path2.default.resolve(__dirname, '../manager.js'), _path2.default.resolve(outputDir, publicPath, 'manager.bundle.js'));
  _shelljs2.default.cp(_path2.default.resolve(__dirname, '../manager.js.map'), _path2.default.resolve(outputDir, publicPath, 'manager.js.map'));
});