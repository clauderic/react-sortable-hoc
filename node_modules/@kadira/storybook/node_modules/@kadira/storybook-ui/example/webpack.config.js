var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:9999',
    'webpack/hot/only-dev-server',
    './client/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: { presets: ['react', 'es2015', 'stage-0'] },
      include: [
        path.join(__dirname, 'client'),
        path.resolve(__dirname, '../src')
      ]
    }]
  }
};
