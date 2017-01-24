/*eslint no-console: 0*/
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')

var port = 8080
var config = {
  entry: [
    './register.js',
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:' + port,
    'webpack/hot/dev-server',
    'mocha!./test/test.babel.js'
  ],
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['transform-async-to-generator']
        }
      }
    ]
  },
  plugins: []
}

// webpack need this to send request to webpack-dev-server
config.plugins.push(new webpack.HotModuleReplacementPlugin())
// Get line of error in mocha
config.devtool = 'eval-source-map'
// must have
config.output.path = __dirname
var compiler = webpack(config)
var server = new WebpackDevServer(compiler, {
  publicPath: '/',
  inline: true,
  historyApiFallback: false,
  stats: { colors: true }
})
server.listen(8080, 'localhost', function () {
  console.log('server started at http://localhost:8080')
})
