# keycode

  Simple map of keyboard codes.

[![Build Status](https://travis-ci.org/timoxley/keycode.png?branch=master)](https://travis-ci.org/timoxley/keycode)

## Installation

#### npm

```sh
$ npm install keycode
```

#### component
```sh
$ component install timoxley/keycode
```

## Example

```js
var keycode = require('keycode');
document.addEventListener('keydown', function(e) {
  console.log("You pressed", keycode(e))
})
```

## API

`keycode` tries to make an intelligent guess as to what
you're trying to discover based on the type of argument
you supply.

##keycode(keycode:Event)

Returns the name of the key associated with this event.

```js
document.body.addEventListener('keyup', function(e) {
  console.log(keycode(e)) // prints name of key
})
```

[Due to the keypress event being weird](https://github.com/timoxley/keycode/wiki/wtf%3F-keydown,-keyup-vs-keypress),`keycode `currently does not support the `keypress` event, but this should not be an issue as `keydown` and `keyup` work perfectly fine.

##keycode(keycode:Number)

Returns the lowercase name of a given numeric keycode.

```js
keycode(13) // => 'enter'
```

##keycode(name:String)

Returns the numeric keycode for given key name.

```js
keycode('Enter') // => 13

// keycode is not case sensitive
keycode('eNtEr') // => 13
```

### Name Aliases

Common aliases are also supplied:

```js
> for (var alias in keycode.aliases) { console.log(alias, keycode(keycode(alias))) }
ctl ctrl
pause pause/break
break pause/break
caps caps lock
escape esc
pgup page up
pgdn page up
ins insert
del delete
spc space
```

## Maps

Key code/name maps are available directly as `keycode.codes` and `keycode.names` respectively.

```js
keycode.names[13] // => 'enter'
keycode.codes['Enter'] // => 13
```

## Credit

```
 project  : keycode
 repo age : 2 years, 4 months
 active   : 19 days
 commits  : 48
 files    : 13
 authors  :
    26	Tim Oxley        54.2%
    10	Tim              20.8%
     4	jkroso           8.3%
     3	Amir Abu Shareb  6.2%
     1	TJ Holowaychuk   2.1%
     1	Nathan Zadoks    2.1%
     1	Kenan Yildirim   2.1%
     1	Yoshua Wuyts     2.1%
     1	Greg Reimer      2.1%
```

Original key mappings lifted from http://jsfiddle.net/vWx8V/ via http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

## License

[MIT](http://opensource.org/licenses/mit-license.php)
