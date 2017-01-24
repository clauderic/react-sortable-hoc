const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;
const identity = require('lodash').identity;

suite('api/processCss()', () => {
  const processCss = spy(identity);

  test('should be called', () => assert(processCss.called));

  setup(() => {
    hook({processCss});
    require('./fixture/oceanic.css');
  });

  teardown(() => {
    detachHook('.css');
    dropCache('./api/fixture/oceanic.css');
  });
});
