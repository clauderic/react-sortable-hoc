/*global describe, it*/
'use strict'
var assert = require('assert')

function getCat () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      return resolve('>_<')
    }, 300)
  })
}

async function cat () {
  var str = await getCat()
  return str
}

describe('babel fail', function() {
  it('should fail', function () {
    return cat().then(function (res) {
      assert(typeof res === 'undefined')
    })
  })
})
