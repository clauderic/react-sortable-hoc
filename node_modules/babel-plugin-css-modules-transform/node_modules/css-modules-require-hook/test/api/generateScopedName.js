const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;
const identity = require('lodash').lodash;
const resolve = require('path').resolve;

suite('api/generateScopedName', () => {
  suite('using function', () => {
    let args;
    let tokens;

    const processor = spy(function (selector, filepath, source) {
      args = [selector, filepath, source];
      return selector;
    });

    test('processor should be called', () => {
      assert(processor.called);
    });

    test('should provide selector, filepath and source to the function', () => {
      assert.deepEqual(args, [
        'color',
        resolve('test/api/fixture/oceanic.css'),
        '.color\n{\n  background: #1e2a35;\n}\n',
      ]);
    });

    test('should return tokens with same keys', () => {
      assert.deepEqual(tokens, {
        color: 'color',
      });
    });

    setup(() => {
      hook({generateScopedName: processor});
      tokens = require('./fixture/oceanic.css');
    });
  });

  suite('using string pattern', () => {
    let tokens;

    test('should return tokens with id', () => assert.deepEqual(tokens, {
      color: 'oceanic__color___1GAeQ',
    }));

    setup(() => {
      hook({generateScopedName: '[name]__[local]___[hash:base64:5]'});
      tokens = require('./fixture/oceanic.css');
    });
  });

  teardown(() => {
    detachHook('.css');
    dropCache('./api/fixture/oceanic.css');
  });
});
