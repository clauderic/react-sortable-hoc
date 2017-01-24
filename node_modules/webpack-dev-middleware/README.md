# webpack-dev-middleware

**THIS MIDDLEWARE SHOULD ONLY USED FOR DEVELOPMENT!**

**DO NOT USE IT IN PRODUCTION!**

## What is it?

It's a simple wrapper middleware for webpack. It serves the files emitted from webpack over a connect server.

It has a few advantages over bundling it as files:

* No files are written to disk, it handle the files in memory
* If files changed in watch mode, the middleware no longer serves the old bundle, but delays requests until the compiling has finished. You don't have to wait before refreshing the page after a file modification.
* I may add some specific optimization in future releases.

## Usage

``` javascript
var webpackMiddleware = require("webpack-dev-middleware");
app.use(webpackMiddleware(...));
```

Example usage:

``` javascript
app.use(webpackMiddleware(webpack({
	// webpack options
	// webpackMiddleware takes a Compiler object as first parameter
	// which is returned by webpack(...) without callback.
	entry: "...",
	output: {
		path: "/"
		// no real path is required, just pass "/"
		// but it will work with other paths too.
	}
}), {
	// all options optional

	noInfo: false,
	// display no info to console (only warnings and errors)

	quiet: false,
	// display nothing to the console

	lazy: true,
	// switch into lazy mode
	// that means no watching, but recompilation on every request

	watchOptions: {
		aggregateTimeout: 300,
		poll: true
	},
	// watch options (only lazy: false)

	publicPath: "/assets/",
	// public path to bind the middleware to
	// use the same as in webpack

	headers: { "X-Custom-Header": "yes" },
	// custom headers

	stats: {
		colors: true
	}
	// options for formating the statistics
}));
```

## Advanced API

This part shows how you might interact with the middleware during runtime:

* `close(callback)` - stop watching for file changes
	```js
	var webpackDevMiddlewareInstance = webpackMiddleware(/* see example usage */);
	app.use(webpackDevMiddlewareInstance);
	// After 10 seconds stop watching for file changes:
	setTimeout(function(){
	  webpackDevMiddlewareInstance.close();
	}, 10000);
	```

* `invalidate()` - recompile the bundle - e.g. after you changed the configuration
	```js
	var compiler = webpack(/* see example usage */);
	var webpackDevMiddlewareInstance = webpackMiddleware(compiler);
	app.use(webpackDevMiddlewareInstance);
	setTimeout(function(){
	  // After a short delay the configuration is changed
	  // in this example we will just add a banner plugin:
	  compiler.apply(new webpack.BannerPlugin('A new banner'));
	  // Recompile the bundle with the banner plugin:
	  webpackDevMiddlewareInstance.invalidate();
	}, 1000);
	```

* `waitUntilValid(callback)` - executes the `callback` if the bundle is valid or after it is valid again:
	```js
	var webpackDevMiddlewareInstance = webpackMiddleware(/* see example usage */);
	app.use(webpackDevMiddlewareInstance);
	webpackDevMiddleware.waitUntilValid(function(){
	  console.log('Package is in a valid state');
	});
	```
