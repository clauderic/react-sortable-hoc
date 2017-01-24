const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;
const identity = require('lodash').lodash;

suite('api/mode', () => {
  test('compile in global mode', () => {
    const tokens = require('./fixture/oceanic.css');
    assert.deepEqual(tokens, {});
  });

  setup(() => hook({mode: 'global'}));

  teardown(() => {
    detachHook('.css');
    dropCache('./api/fixture/oceanic.css');
  });
});
