# element-class

like .addClass, .removeClass .toggleClass and .hasClass from jquery but without dependencies

[![testling badge](https://ci.testling.com/maxogden/element-class.png)](https://ci.testling.com/maxogden/element-class)

```
npm install element-class
```

```javascript
var elementClass = require('element-class')

// get an element
var foo = document.querySelector('.foo')

// remove a class
elementClass(foo).remove('foo')

// add a class
elementClass(foo).add('foo')

// toggle a class
elementClass(foo).toggle('foo')

// check if element has a class
elementClass(foo).has('foo')
```

## license

BSD
