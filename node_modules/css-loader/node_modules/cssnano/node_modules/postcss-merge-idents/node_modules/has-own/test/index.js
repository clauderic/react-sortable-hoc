
var assert = require('assert');
var hasOwn = require('../');

describe('hasOwn', function() {
  it('works', function(done) {
    assert(hasOwn('name', { name: 'hasOwn' }));
    done();
  });

  it('handles overridden hasOwnProperty fns', function(done) {
    var o = { name: 'hasOwn' };
    o.hasOwnProperty = function() {}

    assert(hasOwn('name', o));
    done();
  });

  it('handles object created with Object.create(null)', function(done) {
    var o = Object.create(null);
    o.name = 'hasOwn';
    assert(hasOwn('name', o));
    done();
  });

  it('returns false when appropriate', function(done) {
    var o = { name: 'has-own' };
    assert(!hasOwn('age', o));
    done();
  });

  it('exposes its version', function(done) {
    assert('string' == typeof hasOwn.version);
    done();
  });
});
