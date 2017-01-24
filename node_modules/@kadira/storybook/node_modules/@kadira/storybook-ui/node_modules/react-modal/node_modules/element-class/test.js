var test = require('tape')
var elementClass = require('./')

test('adds classes', function(t) {
  var div = document.createElement('div')
  document.body.appendChild(div)

  elementClass(div).add('foo')
  t.equal(div.className, 'foo')

  elementClass(div).add('bar')
  t.equal(div.className, 'foo bar')

  t.end()
})

test('removes classes', function(t) {
  var div = document.createElement('div')
  div.className= 'foo bar'
  document.body.appendChild(div)

  elementClass(div).remove('foo')
  t.equal(div.className, 'bar')

  elementClass(div).remove('bar')
  t.equal(div.className, '')

  t.end()
})

test('checks classes', function(t) {
  var div = document.createElement('div')
  div.className= 'foo bar'
  document.body.appendChild(div)

  t.ok(elementClass(div).has('foo'))
  t.ok(elementClass(div).has('bar'))

  t.end()
})

test('does everything', function(t) {
  var div = document.createElement('div')
  document.body.appendChild(div)

  t.notOk(elementClass(div).has('foo'))
  t.notOk(elementClass(div).has('bar'))

  elementClass(div).add('foo')
  elementClass(div).add('bar')

  t.ok(elementClass(div).has('foo'))
  t.ok(elementClass(div).has('bar'))

  elementClass(div).remove('foo')
  t.notOk(elementClass(div).has('foo'))
  t.ok(elementClass(div).has('bar'))

  elementClass(div).remove('bar')
  t.notOk(elementClass(div).has('foo'))
  t.notOk(elementClass(div).has('bar'))

  t.end()
})
