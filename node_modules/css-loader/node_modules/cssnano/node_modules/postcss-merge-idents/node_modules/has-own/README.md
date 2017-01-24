#has-own
==========

Shorthand `Object.prototype.hasOwnProperty.call(obj, name)`.

```js
var assert = require('assert');
var hasOwn = require('has-own');

var o = Object.create(null);
o.name = 'has-own';

assert(hasOwn('name', o)); // true
```

Why another module? Because I like it's readability.

[LICENSE](https://github.com/pebble/has-own/blob/master/LICENSE)
