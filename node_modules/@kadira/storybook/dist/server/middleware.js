'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (configDir) {
  // Build the webpack configuration using the `baseConfig`
  // custom `.babelrc` file and `webpack.config.js` files
  var config = (0, _config2.default)('DEVELOPMENT', _webpack4.default, configDir);

  // remove the leading '/'
  var publicPath = config.output.publicPath;
  if (publicPath[0] === '/') {
    publicPath = publicPath.slice(1);
  }

  var compiler = (0, _webpack2.default)(config);
  var devMiddlewareOptions = {
    noInfo: true,
    publicPath: config.output.publicPath,
    watchOptions: config.watchOptions || {}
  };

  var router = new _express.Router();
  router.use((0, _webpackDevMiddleware2.default)(compiler, devMiddlewareOptions));
  router.use((0, _webpackHotMiddleware2.default)(compiler));

  router.get('/', function (req, res) {
    res.send((0, _index2.default)(publicPath));
  });

  var headHtml = (0, _utils.getHeadHtml)(configDir);
  router.get('/iframe.html', function (req, res) {
    res.send((0, _iframe2.default)(headHtml, publicPath));
  });

  return router;
};

var _express = require('express');

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _webpack3 = require('./webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _index = require('./index.html');

var _index2 = _interopRequireDefault(_index);

var _iframe = require('./iframe.html');

var _iframe2 = _interopRequireDefault(_iframe);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }