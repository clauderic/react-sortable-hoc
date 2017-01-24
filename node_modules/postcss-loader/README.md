# PostCSS for Webpack [![Build Status][ci-img]][ci]

<img align="right" width="95" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo.svg">

[PostCSS] loader for [webpack] to postprocesses your CSS with [PostCSS plugins].

<a href="https://evilmartians.com/?utm_source=postcss-loader">
<img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg" alt="Sponsored by Evil Martians" width="236" height="54">
</a>

[PostCSS plugins]: https://github.com/postcss/postcss#plugins
[PostCSS]:         https://github.com/postcss/postcss
[webpack]:         http://webpack.github.io/
[ci-img]:          https://travis-ci.org/postcss/postcss-loader.svg
[ci]:              https://travis-ci.org/postcss/postcss-loader

## Usage

Install `postcss-loader`:

```console
npm install postcss-loader --save-dev
```

Set `postcss` section in webpack config:

```js
var precss       = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
    module: {
        loaders: [
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: function () {
        return [precss, autoprefixer];
    }
}
```

> This example implementation uses two plugins that may need to be installed:
>
> ```console
> npm install precss --save-dev
> npm install autoprefixer --save-dev
> ```

Now your CSS files requirements will be processed by selected PostCSS plugins:

```js
var css = require('./file.css');
// => CSS after Autoprefixer and CSSWring
```

Note that the context of this function

```js
module.exports = {
    ...
    postcss: function () {
        return [autoprefixer, precss];
    }
}
```

will be set to the [webpack loader-context].
If there is the need, this will let you access to webpack loaders API.

[webpack loader-context]: http://webpack.github.io/docs/loaders.html#loader-context

## Plugins Packs

If you want to process different styles by different PostCSS plugins you can
define plugin packs in `postcss` section and use them by `?pack=name` parameter.

```js
module.exports = {
    module: {
        loaders: [
            {
                test:   /\.docs\.css$/,
                loader: "style-loader!css-loader!postcss-loader?pack=cleaner"
            },
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: function () {
        return {
            defaults: [precss, autoprefixer],
            cleaner:  [autoprefixer({ browsers: [] })]
        };
    }
}
```

## Integration with postcss-import

When using [postcss-import] plugin, you may want to tell webpack about
dependencies coming from your `@import` directives.
For example: in watch mode, to enable recompile on change.

Here is a simple way to let know postcss-import to pass files to webpack:

```js
var postcssImport = require('postcss-import');

module.exports = {
    module: {
        loaders: [
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: function (webpack) {
        return [
            postcssImport({
                addDependencyTo: webpack
            })
        ];
    }
}
```

[webpack loader-context]: http://webpack.github.io/docs/loaders.html#loader-context
[postcss-import]:         https://github.com/postcss/postcss-import

## Integration with CSS Modules

`postcss-loader` [cannot be used] with [CSS Modules] out of the box due
to the way `css-loader` processes file imports. To make them work properly,
either add the css-loader’s [`importLoaders` option]:

```js
{
    test:   /\.css$/,
    loader: "style-loader!css-loader?modules&importLoaders=1!postcss-loader"
}
```

or use [postcss-modules] plugin instead of `css-loader`.

[`importLoaders` option]: https://github.com/webpack/css-loader#importing-and-chained-loaders
[postcss-modules]:        https://github.com/outpunk/postcss-modules
[cannot be used]:         https://github.com/webpack/css-loader/issues/137
[CSS Modules]:            https://github.com/webpack/css-loader#css-modules

## JS Styles

If you want to process styles written in JavaScript
you can use the [postcss-js] parser.

```js
{
    test:   /\.style.js$/,
    loader: "style-loader!css-loader!postcss-loader?parser=postcss-js"
}
```

Or use can use even ES6 in JS styles by Babel:

```js
{
    test:   /\.style.js$/,
    loader: "style-loader!css-loader!postcss-loader?parser=postcss-js!babel"
}
```

As result you will be able to write styles as:

```js
import colors from '../config/colors';

export default {
    '.menu': {
        color: colors.main,
        height: 25,
        '&_link': {
            color: 'white'
        }
    }
}
```

[postcss-js]: https://github.com/postcss/postcss-js

## Custom Syntaxes

PostCSS can transforms styles in any syntax, not only in CSS.
There are 3 parameters to control syntax:

* `syntax` accepts module name with `parse` and `stringify` function.
* `parser` accepts module name with input parser function.
* `stringifier` accepts module name with output stringifier function.

For example, you can use [Safe Parser] to find and fix any CSS errors:

```js
var css = require('postcss?parser=postcss-safe-parser!./broken')
```

[Safe Parser]: https://github.com/postcss/postcss-safe-parser

If you need to pass the function directly instead of a module name,
you can do so through the webpack postcss option, as such:

```js
var sugarss = require('sugarss')
module.exports = {
    module: {
        loaders: [
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: function () {
        return {
            plugins: [autoprefixer, precss],
            syntax: sugarss
        };
    }
}
```
