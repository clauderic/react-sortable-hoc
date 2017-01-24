/*global describe, it*/
require('..')()
var assert = require('assert')

describe('fail', function() {
  function throwError() {
    assert.equal(1, 2)
  }

  it('should fail', function () {
    throwError()
  })
})
