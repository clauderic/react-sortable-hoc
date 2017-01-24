'use strict';

var getPolyfill = require('./polyfill');
var define = require('define-properties');

module.exports = function shimEntries() {
	var polyfill = getPolyfill();
	define(Object, { entries: polyfill }, { entries: function () { return Object.entries !== polyfill; } });
	return polyfill;
};
