# page-bus

share an event emitter among pages and frames on the same domain

This module works offline and does not rely on any network IO.

Behind the scenes, the localStorage API and the window `'storage'` event is used to synchronize
cross-page events.

Previously this module used a shared worker, but shared workers need to elect a
master for the `URL.createObjectURL()` api which got very complicated.

# example

Just create a bus, which returns an event emitter:

``` js
var createBus = require('page-bus');
var bus = createBus();

bus.on('hello', function (msg) {
    console.log('msg=', msg);
});

bus.emit('hello', Date.now());
```

Compile with browserify then open this page up on a few tabs.

The messages get shared hooray!

[Check out the demo on neocities.](https://substack.neocities.org/pagebus.html)

# methods

``` js
var createBus = require('page-bus')
```

## var bus = createBus(opts)

Create a new event emitter `bus`.

* `opts.key` - the string key to save data. default: `'page-bus'`. By using a
different value, you can create namespaces.

All other pages on the same domain in the same browser will be able to open the
event emitter.

# install

With [npm](https://npmjs.org) do:

```
npm install page-bus
```

# license

MIT
