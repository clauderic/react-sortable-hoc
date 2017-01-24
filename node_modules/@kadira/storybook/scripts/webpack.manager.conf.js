var path = require('path');
var webpack = require('webpack');

var plugins = [];

// When we run `npm run dev`, we don't need to include these production
// optimizations. That's why we do this.
if (!process.env.DEV_BUILD) {
  plugins = plugins.concat([
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
    }),
  ]);
}

module.exports = {
  devtool: '#cheap-module-source-map',
  entry: path.resolve(__dirname, '../src/client/manager/index.js'),
  output: { path: path.resolve(__dirname, '../dist'), filename: 'manager.js' },
  plugins: plugins,
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, '../node_modules/'),
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      }
    ]
  },
};
