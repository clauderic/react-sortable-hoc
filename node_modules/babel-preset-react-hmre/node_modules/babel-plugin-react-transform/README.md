> These docs are for the v2 release using Babel 6, if you are still on Babel 5 then you should use
> v1.1 instead.
>
> View the `v1.1` docs [here](https://github.com/gaearon/babel-plugin-react-transform/tree/v1.1.1)

# babel-plugin-react-transform

[![react-transform channel on discord](https://img.shields.io/badge/discord-react--transform%40reactiflux-61DAFB.svg?style=flat-square)](http://www.reactiflux.com)

:rocket: **Now  with [Babel 6](https://github.com/babel/babel) support** (thank you [@thejameskyle](https://github.com/thejameskyle)!)

This plugin wraps React components with arbitrary transforms. In other words, **it allows you to instrument React components** in any way—limited only by your imagination.

* [Ecosystem](#ecosystem)
* [Demo Project](#demo-project)
* [Installation](#installation)
* [Writing Transforms](#writing-transforms)

## Ecosystem

For a reference implementation, see [**react-transform-boilerplate**](https://github.com/gaearon/react-transform-boilerplate).

#### Transforms

* [**react-transform-hmr**](https://github.com/gaearon/react-transform-hmr) - enables hot reloading using HMR API
* [**react-transform-catch-errors**](https://github.com/gaearon/react-transform-catch-errors) - catches errors inside `render()`
* [**react-transform-debug-inspector**](https://github.com/alexkuz/react-transform-debug-inspector) - renders an inline prop inspector
* [**react-transform-render-visualizer**](https://github.com/spredfast/react-transform-render-visualizer) - highlight components when updated

Feeling inspired? Learn [how to write transforms](#writing-transforms) and send a PR!

## Demo Project

Check out **[react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate)** for a demo showing a combination of transforms.

![](https://cloud.githubusercontent.com/assets/1539088/11611771/ae1a6bd8-9bac-11e5-9206-42447e0fe064.gif)

## Installation

This plugin is designed to be used with the Babel 6 ecosystem. These instructions assume you have a working project set up. If you do not have Babel set up in your project, [learn how to integrate](https://babeljs.io/docs/setup/) it with your toolkit before installing this plugin.

##### Using NPM

Install plugin and save in `devDependencies`:

```bash
npm install --save-dev babel-plugin-react-transform
```

Install some transforms:

```bash
npm install --save-dev react-transform-hmr
npm install --save-dev react-transform-catch-errors
```

##### Configuration
Add react-transform to the list of plugins in your babel configuration (usually `.babelrc`):

```js


{
  "presets": ["react", "es2015"],
  "env": {
    // this plugin will be included only in development mode, e.g.
    // if NODE_ENV (or BABEL_ENV) environment variable is not set
    // or is equal to "development"
    "development": {
      "plugins": [
        // must be an array with options object as second item
        ["react-transform", {
          // must be an array of objects
          "transforms": [{
            // can be an NPM module name or a local path
            "transform": "react-transform-hmr",
            // see transform docs for "imports" and "locals" dependencies
            "imports": ["react"],
            "locals": ["module"]
          }, {
            // you can have many transforms, not just one
            "transform": "react-transform-catch-errors",
            "imports": ["react", "redbox-react"]
          }, {
            // can be an NPM module name or a local path
            "transform": "./src/my-custom-transform"
          }]
          // by default we only look for `React.createClass` (and ES6 classes)
          // but you can tell the plugin to look for different component factories:
          // factoryMethods: ["React.createClass", "createClass"]
        }]
      ]
    }
  }
}
```

As you can see, each transform, apart from the `transform` field where you write it name, also has `imports` and `locals` fields. You should consult the docs of each individual transform to learn which `imports` and `locals` it might need, and how it uses them. You probably already guessed that this is just a way to inject local variables (like `module`) or dependencies (like `react`) into the transforms that need them.

Note that when using `React.createClass()` and allowing `babel` to extract the `displayName` property you must ensure that [babel-plugin-react-display-name](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-display-name) is included before `react-transform`. See [this github issue](https://github.com/gaearon/babel-plugin-react-transform/issues/19) for more details.

You may optionally specify an array of strings called `factoryMethods` if you want the plugin to look for components created with a factory method other than `React.createClass`. Note that you don’t have to do anything special to look for ES6 components—`factoryMethods` is only relevant if you use factory methods akin to `React.createClass`.

## Writing Transforms

It’s not hard to write a custom transform! First, make sure you call your NPM package `react-transform-*` so we have uniform naming across the transforms. The only thing you should export from your transform module is a function.

```js
export default function myTransform() {
  // ¯\_(ツ)_/¯
}
```

This function should *return another function*:

```js
export default function myTransform() {
  return function wrap(ReactClass) {
    // ¯\_(ツ)_/¯
    return ReactClass;
  }
}
```

As you can see, you’ll receive `ReactClass` as a parameter. It’s up to you to do something with it: monkeypatch its methods, create another component with the same prototype and a few different methods, wrap it into a higher-order component, etc. Be creative!

```js
export default function logAllUpdates() {
  return function wrap(ReactClass) {
    const displayName = // ¯\_(ツ)_/¯
    const originalComponentDidUpdate = ReactClass.prototype.componentDidUpdate;

    ReactClass.prototype.componentDidUpdate = function componentDidUpdate() {
      console.info(`${displayName} updated:`, this.props, this.state);

      if (originalComponentDidUpdate) {
        originalComponentDidUpdate.apply(this, arguments);
      }
    }

    return ReactClass;
  }
}
```

Oh, how do I get `displayName`?
Actually, we give your transformation function a single argument called `options`. Yes, `options`:

```js
export default function logAllUpdates(options) {
```

It contains some useful data. For example, your `options` could look like this:

```js
{
  // the file being processed
  filename: '/Users/dan/p/my-projects/src/App.js',
  // remember that "imports" .babelrc option?
  imports: [React],
  // remember that "locals" .babelrc option?
  locals: [module],
  // all components declared in the current file
  components: {
    $_MyComponent: {
      // with their displayName when available
      displayName: 'MyComponent'
    },
    $_SomeOtherComponent: {
      displayName: 'SomeOtherComponent',
      // and telling whether they are defined inside a function
      isInFunction: true
    }
  }
}
```

Of course, you might not want to use *all* options, but isn’t it nice to know that you have access to them in the top scope—which means before the component definitions actually run? (Hint: a hot reloading plugin might use this to decide whether a module is worthy of reloading, even if it contains an error and no React components have yet been wrapped because of it.)

So, to retrieve the `displayName` (or `isInFunction`, when available), use the `options` parameter *and* the second `uniqueId` parameter given to the inner function after `ReactClass`:

```js
export default function logAllUpdates(options) {
  return function wrap(ReactClass, uniqueId) {
    const displayName = options.components[uniqueId].displayName || '<Unknown>';
```

This is it!

Sure, it’s a slightly contrived example, as you can grab `ReactClass.displayName` just fine, but it illustrates a point: you have information about all of the components inside a file before that file executes, which is *very* handy for some transformations.

Here is the complete code for this example transformation function:

```js
export default function logAllUpdates(options) {
  return function wrap(ReactClass, uniqueId) {
    const displayName = options.components[uniqueId].displayName || '<Unknown>';
    const originalComponentDidUpdate = ReactClass.prototype.componentDidUpdate;

    ReactClass.prototype.componentDidUpdate = function componentDidUpdate() {
      console.info(`${displayName} updated:`, this.props, this.state);

      if (originalComponentDidUpdate) {
        originalComponentDidUpdate.apply(this, arguments);
      }
    }

    return ReactClass;
  }
}
```

Now go ahead and write your own! Don’t forget to tag it with `react-transform` [keyword on npm](https://www.npmjs.com/browse/keyword/react-transform).

## Patrons

The work on React Transform, [React Hot Loader](https://github.com/gaearon/react-hot-loader), [Redux](https://github.com/rackt/redux), and related projects was [funded by the community](https://www.patreon.com/reactdx). Meet some of the outstanding companies that made it possible:

* [Webflow](https://github.com/webflow)
* [Ximedes](https://www.ximedes.com/)

[See the full list of React Transform patrons.](PATRONS.md)

## License

MIT
