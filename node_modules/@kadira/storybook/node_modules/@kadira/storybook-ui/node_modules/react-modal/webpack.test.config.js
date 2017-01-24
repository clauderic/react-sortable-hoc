var path = require('path');
var webpack = require('webpack');

module.exports = {

  entry: path.resolve(__dirname, 'specs/main.js'),
  cache: false,

  output: {
    filename: 'compiledSpecs.js',
    path: path.resolve(__dirname, 'specs'),
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel' }
    ]
  }
};
