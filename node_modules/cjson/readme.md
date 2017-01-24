[![build status](https://secure.travis-ci.org/kof/node-cjson.png)](http://travis-ci.org/kof/node-cjson)
## CJSON (Commented JavaScript Object Notation) is a comments enabled json config loader.

JSON has a good spec, is implemented in every language, has easy to read syntax and is much more powerful than ini files.

JSON is perfect for writing config files, except of one problem - there is no comments, but sometimes config files get large and need to be commented.

Well, you could just evaluate json file as a JavaScript using one-liner, right?

The purpose of this module is to avoid dirty JavaScript configs and to enable clean, consistent, secure, portable and JSON valid notation.

CJSON supports JavaScript style comments: singleline "//" and  multiline "/**/". It takes care about comments inside of strings.

Example of such shiny config file:

```javascript
/*
 * This is my app configuration file.
 *
 */
{
	"host": "localhost",
	// app is listening on this port
	"port": 8888
}
```

## API

### load the module
	var cjson = require('cjson');

### cjson.load(path, [options]);

Load config file from given path, array of paths or directory. Second parameter is optional and can be a boolean or object.

- `path` {String|Array} absolute path to the file, array of paths or directory
- `options` {Boolean|Object} optional options. If you pass `true` as second param, its the same like `    {merge: true}` and will merge all configs together.


`options` defaults:
```javascript
{
	// merge all passed/found config files, see `cjson.extend`
    merge: false,
    // allows you to do some string replacements, see `cjson.replace`.
    replace: null,
    // freeze config recursively, see `cjson.freeze`
    freeze: false,
    // you can use any other extension for your config files, f.e. .cjson
    ext: '.json',
    // you can use any parser you want. the default uses JSON.parse for maximum
    // speed, if it throws it uses uses an alternative parser to give more
    // helpful errors
    parse: jph.parse
}
```

Examples:

```javascript
// just one config
var conf = cjson.load('/path/to/your/config.json');

// array of configs
var conf = cjson.load(['/path/to/your/config1.json', '/path/to/your/config2.json']);

//output
{
	config1: {key1: 'value1'}
	config2: {key2: 'value2'}
}


// use optional merge parameter
// array of configs
var conf = cjson.load(['/path/to/your/config1.json', '/path/to/your/config2.json'], true);

// output
{
	key1: 'value1',
	key2: 'value2'
}


// load all config files from a directory
var conf = cjson.load('/path/to/your/configs');

// overwriting dev config with production
var paths = ['/path/to/conf.json'];
if (process.env.NODE_ENV ==='production') {
	paths.push('/path/to/conf-prod.json');
}
var conf = cjson.load(paths, true);
```

### cjson.extend([deep], target, object1, [objectN])

Merge the contents of two or more objects together into the first object.

- `deep` If true, the merge becomes recursive.
- `target` The object to extend. It will receive the new properties.
- `object1` An object containing additional properties to merge in.
- `objectN` Additional objects containing properties to merge in.

Example:

```javascript
var object = cjson.extend({}, object1, object2);
```

### cjson.decomment(str)

Remove JavaScript style comments, singleline - '//' and multiline - '/**/'. It takes care
about comments inside of strings and escaping.

### cjson.parse(str, [reviver])

Like `JSON.parse`, but it takes care about comments. Optional `reviver` argument
is for `JSON.parse` method and will be called for every key and value at every level
of the final result

### cjson.replace(str, obj)

Replace all strings `{{key}}` contained in `{key: 'value'}`, where `key` can be any
property of passed `obj`.

Example:
```javascript
var str = '{"path": "{{root}}/src"}'; // json file contents
cjson.replace(str, {root: '/usr'}); // '{"path": "/usr/src"}'
```
### cjson.freeze(obj)

Recursively freeze an object.


## Installation

	npm install cjson
