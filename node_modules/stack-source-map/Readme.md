# Stack-source-map

Attamp to make error stack works with source-map in browser, only Chrome supportted yet.
<img width="529" alt="screen shot 2015-11-24 at 00 23 59" src="https://cloud.githubusercontent.com/assets/251450/11343360/afb271bc-9246-11e5-9c60-6a501a2f2b5f.png">

The code mostly from [evanw/node-source-map-support](https://github.com/evanw/node-source-map-support), but simplified to works with browser only and fixed to support all source map mode of [webpack](https://webpack.github.io/docs/configuration.html#devtool)

Basically, it's some kind hack of v8 [message.js](https://code.google.com/p/v8/source/browse/trunk/src/messages.js)

Works with babel and webpack :smiley:


## Install

    npm install stack-source-map

## Usage

``` js
require('stack-source-map')()
```

## entry for webpack

``` js
var entry = [
  'stack-source-map/register'
  // other entries
  ...
]
```

## API

### stackSourceMap([option])

* `option.empty` empty cache between operations if true, default false

## Test babel with webpack

    npm install
    node server
    open http://localhost:8080/bundle

## License

MIT
