# [postcss][postcss]-minify-gradients [![Build Status](https://travis-ci.org/ben-eb/postcss-minify-gradients.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/postcss-minify-gradients.svg)][npm] [![Dependency Status](https://gemnasium.com/ben-eb/postcss-minify-gradients.svg)][deps]

> Minify gradient parameters with PostCSS.

## Install

With [npm](https://npmjs.org/package/postcss-minify-gradients) do:

```
npm install postcss-minify-gradients
```


## Example

Where possible, this module will minify gradient parameters. It can convert
linear gradient directional syntax to angles, remove the unnecessary `0%` and
`100%` start and end values, and minimise color stops that use the same length
values (the browser will adjust the value automatically).

### Input

```css
h1 {
    background: linear-gradient(to bottom, #ffe500 0%, #ffe500 50%, #121 50%, #121 100%)
}
```

### Output

```css
h1 {
    background: linear-gradient(180deg, #ffe500, #ffe500 50%, #121 0, #121)
}
```


## Usage

See the [PostCSS documentation](https://github.com/postcss/postcss#usage) for
examples for your environment.


## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.


## License

MIT © [Ben Briggs](http://beneb.info)


[ci]:      https://travis-ci.org/ben-eb/postcss-minify-gradients
[deps]:    https://gemnasium.com/ben-eb/postcss-minify-gradients
[npm]:     http://badge.fury.io/js/postcss-minify-gradients
[postcss]: https://github.com/postcss/postcss
