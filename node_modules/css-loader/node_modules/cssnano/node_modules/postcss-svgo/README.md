# [postcss][postcss]-svgo [![Build Status](https://travis-ci.org/ben-eb/postcss-svgo.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/postcss-svgo.svg)][npm] [![Dependency Status](https://gemnasium.com/ben-eb/postcss-svgo.svg)][deps]

> Optimise inline SVG with PostCSS.

## Install

With [npm](https://npmjs.org/package/postcss-svgo) do:

```
npm install postcss-svgo --save
```

## Example

### Input

```css
h1 {
    background: url('data:image/svg+xml;charset=utf-8,<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"><circle cx="50" cy="50" r="40" fill="yellow" /></svg>');
}
```

### Output

```css
h1 {
    background: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#ff0"/></svg>');
}
```

## API

### `svgo([options])`

Note that postcss-svgo is an *asynchronous* processor. It cannot be used
like this:

```js
var result = postcss([ svgo() ]).process(css).css;
console.log(result);
```

Instead make sure your PostCSS runner uses the asynchronous API:

```js
postcss([ svgo() ]).process(css).then(function (result) {
    console.log(result.css);
});
```

#### options

##### encode

Type: `boolean`
Default: `undefined`

If `true`, it will encode URL-unsafe characters such as `<`, `>` and `#`;
`false` will decode these characters, and `undefined` will neither encode nor
decode the original input.

##### plugins

Optionally, you can customise the output by specifying the `plugins` option. You
will need to provide the config in comma separated objects, like the example
below. Note that you can either disable the plugin by setting it to `false`,
or pass different options to change the default behaviour.

```js
var postcss = require('postcss');
var svgo = require('postcss-svgo');

var opts = {
    plugins: [{
        removeDoctype: false
    }, {
        removeComments: false
    }, {
        cleanupNumericValues: {
            floatPrecision: 2
        }
    }, {
        convertColors: {
            names2hex: false,
            rgb2hex: false
        }
    }]
};

postcss([ svgo(opts) ]).process(css).then(function (result) {
    console.log(result.css)
});
```

You can view the [full list of plugins here][plugins].

## Usage

See the [PostCSS documentation](https://github.com/postcss/postcss#usage) for
examples for your environment.

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.

## License

MIT © [Ben Briggs](http://beneb.info)

[ci]:      https://travis-ci.org/ben-eb/postcss-svgo
[deps]:    https://gemnasium.com/ben-eb/postcss-svgo
[npm]:     http://badge.fury.io/js/postcss-svgo
[postcss]: https://github.com/postcss/postcss
[plugins]: https://github.com/svg/svgo/tree/master/plugins
