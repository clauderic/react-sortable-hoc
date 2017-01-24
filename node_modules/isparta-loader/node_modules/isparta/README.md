# isparta [![Build Status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url]

> Isparta is a code coverage tool for ES6 using [babel](https://github.com/babel/babel).

Its intention is to be used with [karma](http://karma-runner.github.io/) and [karma-coverage](https://github.com/karma-runner/karma-coverage), which provides code coverage reports using [istanbul](https://github.com/gotwarlost/istanbul).

[CHANGELOG](https://github.com/douglasduteil/isparta/releases)

## Installation

Isparta can be installed using

```sh
$ npm install --save-dev isparta
```

## Usage

**Not all the istanbul command/options are available with isparta**  
**Consult `isparta -h` for more information**

Here is an example to run a coverage over mocha tests  

```bash
babel-node node_modules/isparta/bin/isparta cover --report text --report html node_modules/mocha/bin/_mocha -- --reporter dot   
```

[douglasduteil/study-node-path-es6](https://github.com/douglasduteil/study-node-path-es6) demo the working cli

### With Karma

To use isparta, set the [instrumenter](https://github.com/karma-runner/karma-coverage/blob/master/README.md#instrumenter) for the JavaScript file type to `isparta`.

```js
coverageReporter: {
  // configure the reporter to use isparta for JavaScript coverage
  // Only on { "karma-coverage": "douglasduteil/karma-coverage#next" }
  instrumenters: { isparta : require('isparta') },
  instrumenter: {
    '**/*.js': 'isparta'
  }
}
```

But can customize the babel options thanks to my [fork](https://github.com/douglasduteil/karma-coverage/tree/next)

```js

// Note that you ".babelrc" will be the default options for babel.
var babelMoreOptions = { presets: 'es2015' };

// [...]

coverageReporter: {
  // configure the reporter to use isparta for JavaScript coverage
  // Only on { "karma-coverage": "douglasduteil/karma-coverage#next" }
  instrumenters: { isparta : require('isparta') },
  instrumenter: {
    '**/*.js': 'isparta'
  },
  instrumenterOptions: {
    isparta: { babel : babelMoreOptions }
  }
}
```

![](screenshot.png)

## License

    Copyright © 2014 Douglas Duteil <douglasduteil@gmail.com>
    This work is free. You can redistribute it and/or modify it under the
    terms of the Do What The Fuck You Want To Public License, Version 2,
    as published by Sam Hocevar. See the LICENCE file for more details.

[npm-url]: https://npmjs.org/package/isparta
[npm-image]: http://img.shields.io/npm/v/isparta.svg
[travis-url]: http://travis-ci.org/douglasduteil/isparta
[travis-image]: http://travis-ci.org/douglasduteil/isparta.svg?branch=master
