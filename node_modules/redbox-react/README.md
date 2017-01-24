# redbox-react

[![Build Status](https://travis-ci.org/KeywordBrain/redbox-react.svg?branch=master)](https://travis-ci.org/KeywordBrain/redbox-react)

The red box (aka red screen of death) renders an error in this “pretty” format:

<img src="http://i.imgur.com/9Jhlibk.png" alt="red screen of death" width="700" />

## Usage
Catch an error and give it to `redbox-react`. Works with
* [react-transform-catch-errors](https://github.com/gaearon/react-transform-catch-errors) ([see example](https://github.com/KeywordBrain/redbox-react/tree/master/examples/react-transform-catch-errors) or [react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate/))
* [babel-plugin-react-hot](https://github.com/loggur/babel-plugin-react-hot) & [babel-plugin-react-error-catcher](https://github.com/loggur/babel-plugin-react-error-catcher) (see [example](https://github.com/KeywordBrain/redbox-react/tree/master/examples/babel-plugin-react-hot))
* [react-hot-loader](https://github.com/gaearon/react-hot-loader) (deprecated! see [example](https://github.com/KeywordBrain/redbox-react/tree/master/examples/react-hot-loader-example), relies on changes in unmerged [pull request](https://github.com/gaearon/react-hot-loader/pull/167) and will not be merged!)

or manually:

```javascript
const RedBox = require('redbox-react')
const e = new Error('boom')
const box = <RedBox error={e} />
```

Here is a more useful, full-fleged example:

```javascript
/* global __DEV__ */
import React from 'react'
import { render } from 'react-dom'
import App from './components/App'

const root = document.getElementById('root')

if (__DEV__) {
  const RedBox = require('redbox-react')
  try {
    render(<App />, root)
  } catch (e) {
    render(<RedBox error={e} />, root)
  }
} else {
  render(<App />, root)
}
```

## What is this good for?
An error that's only in the console is only half the fun. Now you can use all the wasted space where your app would be if it didn’t crash to display the error that made it crash. You should use this in development only.

## Will this catch errors for me?
No. As you can see above, this is only a UI component for rendering errors and their stack traces. It's works great with other solutions, that automate the error catching for you, see the [examples](https://github.com/KeywordBrain/redbox-react/tree/master/examples).

## Optional props

`editorScheme` `[?string]` If a filename in the stack trace is local, the component can create the
link to open your editor using this scheme eg: `subl` to create `subl://open?url=file:///filename`.

`useLines` `[boolean=true]` Line numbers in the stack trace may be unreliable depending on the
type of sourcemaps. You can choose to not display them with this flag.

`useColumns` `[boolean=true]` Column numbers in the stack trace may be unreliable depending on the
type of sourcemaps. You can choose to not display them with this flag.

`style` `[?object]` Allows you to override the styles used when rendering the various parts of the
component. It will be shallow-merged with the [default styles](./src/style.js).

If using [react-transform-catch-errors](https://github.com/gaearon/react-transform-catch-errors#installation) you can add these options to your `.babelrc` through the [`imports` property](https://github.com/gaearon/react-transform-catch-errors#installation).

## Sourcemaps with Webpack

If using [Webpack](https://webpack.github.io) you can get accurate filenames in the stacktrace by
setting the `output.devtoolModuleFilenameTemplate` settings to `/[absolute-resource-path]`.

It's recommended to set `devtool` setting to `'eval'`.
