var webpack = require('webpack');
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

module.exports = {
  context: __dirname,
  // Include the hot middleware with each entry point
  entry: {
    // Add the client which connects to our middleware
    client: ['./client.js', hotMiddlewareScript],
    extra: ['./extra.js', hotMiddlewareScript]
  },
  output: {
    path: __dirname,
    publicPath: '/',
    filename: '[name].js'
  },
  devtool: '#source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
};
