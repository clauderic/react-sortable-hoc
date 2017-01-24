'use strict';

var getDescriptors = require('../');
var test = require('tape');

test('as a function', function (t) {
	t.test('bad object/this value', function (st) {
		st.throws(function () { return getDescriptors(undefined); }, TypeError, 'undefined is not an object');
		st.throws(function () { return getDescriptors(null); }, TypeError, 'null is not an object');
		st.end();
	});

	require('./tests')(getDescriptors, t);

	t.end();
});
