const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;

suite('css-modules-require-hook/preset', () => {
  suite('using cmrh.conf.js file', () => {
    test('should return tokens', () => {
      const tokens = require('./fixture/oceanic.css');

      assert.deepEqual(tokens, {
        color: 'oceanic__color___1sqWL',
      });
    });

    setup(() => require('./js/preset'));
  });

  suite('using defaults', () => {
    test('should return tokens', () => {
      const tokens = require('./fixture/oceanic.css');

      assert.deepEqual(tokens, {
        color: '_test_preset_fixture_oceanic__color',
      });
    });

    setup(() => require('../../preset'));
  });

  teardown(() => {
    detachHook('.css');
    dropCache('../preset');
    dropCache('./preset/fixture/oceanic.css');
  });
});
