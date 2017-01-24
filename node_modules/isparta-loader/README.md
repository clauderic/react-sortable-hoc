## isparta instrumenter loader for [webpack](https://webpack.github.io/)

[![npm](http://img.shields.io/npm/v/isparta-loader.svg?style=flat-square)](https://www.npmjs.org/package/isparta-loader)
[![deps](http://img.shields.io/david/deepsweet/isparta-loader.svg?style=flat-square)](https://david-dm.org/deepsweet/isparta-loader)

Instrument Babel code with [isparta](https://github.com/douglasduteil/isparta) for subsequent code coverage reporting.

### Install

```sh
$ npm i -D isparta-loader
```

### Setup

#### References

* [Using loaders](https://webpack.github.io/docs/using-loaders.html)
* [karma-webpack](https://github.com/webpack/karma-webpack#karma-webpack)
* [karma-coverage](https://github.com/karma-runner/karma-coverage#configuration)

#### Project structure

Let's say you have the following:

```
├── src/
│   └── components/
│       ├── bar/
│       │   └── index.js
│       └── foo/
│           └── index.js
└── test/
    └── src/
        └── components/
            └── foo/
                └── index.js
```

To create a code coverage report for all components (even for those for which you have no tests yet) you have to require all the 1) sources and 2) tests. Something like it's described in ["alternative usage" of karma-webpack](https://github.com/webpack/karma-webpack#alternative-usage):

#### test/index.js

```js
// require all `test/components/**/index.js`
const testsContext = require.context('./src/components/', true, /index\.js$/);

testsContext.keys().forEach(testsContext);

// require all `src/components/**/index.js`
const componentsContext = require.context('../src/components/', true, /index\.js$/);

componentsContext.keys().forEach(componentsContext);
```

This file will be the only entry point for Karma:

#### karma.conf.js

```js
config.set({
    …
    files: [
        'test/index.js'
    ],
    preprocessors: {
        'test/index.js': 'webpack'
    },
    webpack: {
        …
        module: {
            preLoaders: [
                // transpile all files except testing sources with babel as usual
                {
                    test: /\.js$/,
                    exclude: [
                        path.resolve('src/components/'),
                        path.resolve('node_modules/')
                    ],
                    loader: 'babel'
                },
                // transpile and instrument only testing sources with isparta
                {
                    test: /\.js$/,
                    include: path.resolve('src/components/'),
                    loader: 'isparta'
                }
            ]
        }
        …
    },
    reporters: [ 'progress', 'coverage' ],
    coverageReporter: {
        type: 'text'
    },
    …
});
```

### License
[WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-strip.jpg)
