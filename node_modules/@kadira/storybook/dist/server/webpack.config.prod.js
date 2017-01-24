'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entries = {
  preview: []
};

// We will copy the manager bundle distributed via the React Storybook
// directly into the production build overring webpack.
// But, in the DEV_BUILD we need to play with that. That's why we copy that.
if (process.env.DEV_BUILD) {
  entries.manager = [__dirname, '../../src/client/manager'];
}

var config = {
  devtool: '#cheap-module-source-map',
  entry: entries,
  output: {
    filename: '[name].bundle.js',
    publicPath: '/static/'
  },
  plugins: [new _webpack2.default.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }), new _webpack2.default.optimize.UglifyJsPlugin({
    compress: { warnings: false }
  }), new _webpack2.default.optimize.OccurenceOrderPlugin()],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      query: { presets: ['react', 'es2015', 'stage-0'] },
      exclude: [_path2.default.resolve('./node_modules'), _path2.default.resolve(__dirname, 'node_modules')],
      include: [_path2.default.resolve('./'), __dirname, _path2.default.resolve(__dirname, '../../src')]
    }]
  }
};

exports.default = config;