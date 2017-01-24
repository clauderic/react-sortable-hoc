# Webpack Hot Middleware

Webpack hot reloading using only [webpack-dev-middleware](http://webpack.github.io/docs/webpack-dev-middleware.html). This allows you to add hot reloading into an existing server without [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html).

This module is **only** concerned with the mechanisms to connect a browser client to a webpack server & receive updates. It will subscribe to changes from the server and execute those changes using [webpack's HMR api](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html). Actually making your application capable of using hot reloading to make seamless changes is out of scope, and usually handled by another library.

[![npm version](https://img.shields.io/npm/v/webpack-hot-middleware.svg)](https://www.npmjs.com/package/webpack-hot-middleware) [![Build Status](https://img.shields.io/travis/glenjamin/webpack-hot-middleware/master.svg)](https://travis-ci.org/glenjamin/webpack-hot-middleware) [![Coverage Status](https://coveralls.io/repos/glenjamin/webpack-hot-middleware/badge.svg?branch=master)](https://coveralls.io/r/glenjamin/webpack-hot-middleware?branch=master) ![MIT Licensed](https://img.shields.io/npm/l/webpack-hot-middleware.svg)

## Installation & Usage

See [example/](./example/) for an example of usage.

First, install the npm module.

```sh
npm install --save-dev webpack-hot-middleware
```

Next, enable hot reloading in your webpack config:

 1. Add the following three plugins to the `plugins` array:
    ```js
    plugins: [
        // Webpack 1.0
        new webpack.optimize.OccurenceOrderPlugin(),
        // Webpack 2.0 fixed this mispelling
        // new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
    ```

    Occurence ensures consistent build hashes, hot module replacement is
    somewhat self-explanatory, no errors is used to handle errors more cleanly.

 3. Add `'webpack-hot-middleware/client'` into the `entry` array.
    This connects to the server to receive notifications when the bundle
    rebuilds and then updates your client bundle accordingly.

Now add the middleware into your server:

 1. Add `webpack-dev-middleware` the usual way
    ```js
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config');
    var compiler = webpack(webpackConfig);

    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath
    }));
    ```

 2. Add `webpack-hot-middleware` attached to the same compiler instance
    ```js
    app.use(require("webpack-hot-middleware")(compiler));
    ```

And you're all set!

## Changelog

### 2.0.0

**Breaking Change**

As of version 2.0.0, all client functionality has been rolled into this module. This means that you should remove any reference to `webpack/hot/dev-server` or `webpack/hot/only-dev-server` from your webpack config. Instead, use the `reload` config option to control this behaviour.

This was done to allow full control over the client receiving updates, which is now able to output full module names in the console when applying changes.

## Documentation

More to come soon, you'll have to mostly rely on the example for now.

### Config

Configuration options can be passed to the client by adding querystring parameters to the path in the webpack config.

```js
'webpack-hot-middleware/client?path=/__what&timeout=2000&overlay=false'
```

* **path** - The path which the middleware is serving the event stream on
* **timeout** - The time to wait after a disconnection before attempting to reconnect
* **overlay** - Set to `false` to disable the DOM-based client-side overlay.
* **reload** - Set to `true` to auto-reload the page when webpack gets stuck.
* **noInfo** - Set to `true` to disable informational console logging.
* **quiet** - Set to `true` to disable all console logging.
* **dynamicPublicPath** - Set to `true` to use webpack `publicPath` as prefix of `path`. (We can set `__webpack_public_path__` dynamically at runtime in the entry point, see note of [output.publicPath](https://webpack.github.io/docs/configuration.html#output-publicpath))

## How it Works

The middleware installs itself as a webpack plugin, and listens for compiler events.

Each connected client gets a [Server Sent Events](http://www.html5rocks.com/en/tutorials/eventsource/basics/) connection, the server will publish notifications to connected clients on compiler events.

When the client receives a message, it will check to see if the local code is up to date. If it isn't up to date, it will trigger webpack hot module reloading.

## Other Frameworks

### Hapi

Use the [hapi-webpack-plugin](https://www.npmjs.com/package/hapi-webpack-plugin).

### Koa

Use [koa-webpack-middleware](https://www.npmjs.com/package/koa-webpack-middleware), which wraps this module and makes it work with koa.

## Troubleshooting

### Use on browsers without EventSource

If you want to use this module with browsers that don't support eventsource, you'll need to use a [polyfill](https://libraries.io/search?platforms=NPM&q=eventsource+polyfill). See [issue #11](https://github.com/glenjamin/webpack-hot-middleware/issues/11)

### Not receiving updates in client when using Gzip

This is because gzip generally buffers the response, but the Server Sent Events event-stream expects to be able to send data to the client immediately. You should make sure gzipping isn't being applied to the event-stream. See [issue #10](https://github.com/glenjamin/webpack-hot-middleware/issues/10).

### Use with auto-restarting servers

This module expects to remain running while you make changes to your webpack bundle, if you use a process manager like nodemon then you will likely see very slow changes on the client side. If you want to reload the server component, either use a separate process, or find a way to reload your server routes without restarting the whole process. See https://github.com/glenjamin/ultimate-hot-reloading-example for an example of one way to do this.

### Use with multiple entry points in webpack

If you want to use [multiple entry points in your webpack config](https://webpack.github.io/docs/multiple-entry-points.html) you need to include the hot middleware client in each entry point. This ensures that each entry point file knows how to handle hot updates. See the [examples folder README](example/README.md) for an example.

```js
entry: {
    vendor: ['jquery', 'webpack-hot-middleware/client'],
    index: ['./src/index', 'webpack-hot-middleware/client']
}
```

## License

Copyright 2015 Glen Mailer.

MIT Licened.
