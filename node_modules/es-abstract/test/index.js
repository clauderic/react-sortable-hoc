'use strict';

var ES = require('../');
var test = require('tape');

var ESkeys = Object.keys(ES).sort();
var ES6keys = Object.keys(ES.ES6).sort();

test('exposed properties', function (t) {
	t.deepEqual(ESkeys, ES6keys.concat(['ES7', 'ES6', 'ES5']).sort(), 'main ES object keys match ES6 keys');
	t.end();
});

test('methods match', function (t) {
	ES6keys.forEach(function (key) {
		t.equal(ES.ES6[key], ES[key], 'method ' + key + ' on main ES object is ES6 method');
	});
	t.end();
});

require('./es5');
require('./es6');
require('./es7');
