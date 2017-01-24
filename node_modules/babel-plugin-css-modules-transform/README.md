# babel-plugin-css-modules-transform [Babel 6 only]

[![Circle CI](https://circleci.com/gh/michalkvasnicak/babel-plugin-css-modules-transform.svg?style=svg)](https://circleci.com/gh/michalkvasnicak/babel-plugin-css-modules-transform)

This Babel plugin finds all `require`s for css module files and replace them with a hash where keys are class names and values are generated css class names.

This plugin is based on the fantastic [css-modules-require-hook](https://github.com/css-modules/css-modules-require-hook).

## Warning

This plugin is experimental, pull requests are welcome.

**Do not run this plugin as part of webpack frontend configuration. This plugin is intended only for backend compilation.**

## Example

```css
/* test.css */

.someClass {
    color: red;
}
```

```js
// component.js
const styles = require('./test.css');

console.log(styles.someClass);

// transformed file
const styles = {
    'someClass': 'Test__someClass___2Frqu'
}

console.log(styles.someClass); // prints Test__someClass___2Frqu
```

## Installation

```
npm install --save-dev babel-plugin-css-modules-transform
```

**Include plugin in `.babelrc`**

```json
{
    "plugins": ["css-modules-transform"]
}
```

**With custom options [css-modules-require-hook options](https://github.com/css-modules/css-modules-require-hook#tuning-options)**


```json
{
    "plugins": [
        [
            "css-modules-transform", {
                "generateScopedName": "[name]__[local]___[hash:base64:5]", // in case you don't want to use a function
                "generateScopedName": "./path/to/module-exporting-a-function.js", // in case you want to use a function
                "generateScopedName": "npm-module-name",
                "preprocessCss": "./path/to/module-exporting-a-function.js",
                "preprocessCss": "npm-module-name",
                "processCss": "./path/to/module-exporting-a-function.js",
                "processCss": "npm-module-name",
                "extensions": [".css", ".scss", ".less"], // list extensions to process; defaults to .css
                "append": [
                    "npm-module-name",
                    "./path/to/module-exporting-a-function.js"
                ],
                "prepend": [
                    "npm-module-name",
                    "./path/to/module-exporting-a-function.js"
                ],
            }
        ]
    ]
}
```

## Using a preprocessor

When using this plugin with a preprocessor, you'll need to configure it as such:


```
// ./path/to/module-exporting-a-function.js
var sass = require('node-sass');
var path = require('path');

module.exports = function processSass(data, filename) {
    var result;
    result = sass.renderSync({
        data: data,
        file: filename
    }).css;
    return result.toString('utf8');
};
```

and then add any relevant extensions to your plugin config:

```
{
    "plugins": [
        [
            "css-modules-transform", {
                "preprocessCss": "./path/to/module-exporting-a-function.js",
                "extensions": [".css", ".scss"]
            }
        ]
    ]
}

```

## License

MIT
