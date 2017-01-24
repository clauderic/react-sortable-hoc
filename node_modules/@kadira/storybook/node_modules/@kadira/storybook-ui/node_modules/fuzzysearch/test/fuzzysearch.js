'use strict';

var test = require('tape');
var fuzzysearch = require('..');

test('fuzzysearch should match expectations', function (t) {
  t.equal(fuzzysearch('car', 'cartwheel'), true);
  t.equal(fuzzysearch('cwhl', 'cartwheel'), true);
  t.equal(fuzzysearch('cwheel', 'cartwheel'), true);
  t.equal(fuzzysearch('cartwheel', 'cartwheel'), true);
  t.equal(fuzzysearch('cwheeel', 'cartwheel'), false);
  t.equal(fuzzysearch('lw', 'cartwheel'), false);
  t.end();
});
