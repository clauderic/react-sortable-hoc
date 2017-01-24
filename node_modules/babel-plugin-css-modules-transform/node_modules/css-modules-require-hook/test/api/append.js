const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;
const identity = require('lodash').lodash;
const Through = require('../sugar').Through;

suite('api/append', () => {
  suite('should add plugins to the pipeline', () => {
    const processor = spy(identity);

    test('plugin should be called', () => assert(processor.called));

    setup(() => {
      hook({append: [new Through(processor)]});
      require('./fixture/oceanic.css');
    });

    teardown(() => {
      detachHook('.css');
      dropCache('./api/fixture/oceanic.css');
    });
  });
});
