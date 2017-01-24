const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;
const resolve = require('path').resolve;
const writeFileSync = require('fs').writeFileSync;

const destination = resolve(__dirname, './fixture/oceanic.css');
const source1 = `.color\n{\n  background: #1e2a35;\n}\n`;
const source2 = `.awesome-color\n{\n  background: #1e2a35;\n}\n`;

suite('api/devMode', () => {
  suite('shouldn`t calls cache in development mode', () => {
    suite('devMode:false options should override NODE_ENV="development"', () => {
      test('should retrive data from cache', () => {
        const tokens = require('./fixture/oceanic.css');

        assert.deepEqual(tokens, {
          color: '_test_api_fixture_oceanic__color',
        });
      });

      setup(() => {
        process.env.NODE_ENV = 'development';
        hook({devMode: false});
        writeFile(source1);
        require('./fixture/oceanic.css');
        writeFile(source2);
      });

      teardown(() => {
        process.env.NODE_ENV = '';
      });
    });

    suite('should cache calls without any options', () => {
      test('should retrive data from cache', () => {
        const tokens = require('./fixture/oceanic.css');

        assert.deepEqual(tokens, {
          color: '_test_api_fixture_oceanic__color',
        });
      });

      setup(() => {
        hook({});
        writeFile(source1);
        require('./fixture/oceanic.css');
        writeFile(source2);
      });
    });
  });

  suite('should clear cache in development mode', () => {
    suite('devMode:true option should works without NODE_ENV="development"', () => {
      test('should retrive data from fs', () => {
        const tokens = require('./fixture/oceanic.css');

        assert.deepEqual(tokens, {
          'awesome-color': '_test_api_fixture_oceanic__awesome-color',
        });
      });

      setup(() => {
        hook({devMode: true});
        writeFile(source1);
        require('./fixture/oceanic.css');
        writeFile(source2);
      });
    });

    suite('NODE_ENV="development" should works without debug:true option', () => {
      test('should retrive data from fs', () => {
        const tokens = require('./fixture/oceanic.css');

        assert.deepEqual(tokens, {
          'awesome-color': '_test_api_fixture_oceanic__awesome-color',
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
      });
    });
  });

  teardown(() => {
    writeFile(source1);
    detachHook('.css');
    dropCache('./api/fixture/oceanic.css');
  });
});

/**
 * @param {string} data
 */
function writeFile(data) {
  writeFileSync(destination, data, 'utf8');
}
