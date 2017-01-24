const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;
const resolve = require('path').resolve;
const writeFileSync = require('fs').writeFileSync;

const destination = resolve(__dirname, './fixture/oceanic.css');
const source1 = `.color\n{\n  background: #1e2a35;\n}\n`;
const source2 = `.awesome-color\n{\n  background: #1e2a35;\n}\n`;

suite('env.NODE_ENV', () => {
  suite('in the development mode', () => {
    test('should get tokens from fs, not from cache', () => {
      const tokens = require('./fixture/oceanic.css');

      assert.deepEqual(tokens, {
        'awesome-color': '_test_env_fixture_oceanic__awesome-color',
      });
    });

    setup(() => {
      process.env.NODE_ENV = 'development';
      hook({});
      writeFile(source1);
      require('./fixture/oceanic.css');
      writeFile(source2);
    });

    teardown(() => {
      process.env.NODE_ENV = '';
      writeFile(source1);
      detachHook('.css');
      dropCache('./env/fixture/oceanic.css');
    });
  });

  suite('not in the development mode', () => {
    test('should get tokens from cache', () => {
      const tokens = require('./fixture/oceanic.css');

      assert.deepEqual(tokens, {
        'color': '_test_env_fixture_oceanic__color',
      });
    });

    setup(() => {
      hook({});
      require('./fixture/oceanic.css');
    });

    teardown(() => {
      detachHook('.css');
      dropCache('./env/fixture/oceanic.css');
    });
  });
});

/**
 * @param {string} data
 */
function writeFile(data) {
  writeFileSync(destination, data, 'utf8');
}
