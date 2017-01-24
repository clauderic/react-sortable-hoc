const basename = require('path').basename;
const detachHook = require('../sugar').detachHook;
const readdirSync = require('fs').readdirSync;
const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;

/**
 * @param {string} testCase
 */
function describeTest(testCase) {
  const source = readfile(testCase, 'source.css');
  if (source === null) {
    return;
  }

  // @todo add a small shortcut to choose certain tests
  test(basename(testCase), () => {
    const expected = JSON.parse(readfile(testCase, 'expected.json'));
    assert.deepEqual(require(resolve(testCase, 'source.css')), expected);
  });
}

/**
 * @param  {string} dir
 * @return {string[]}
 */
function readdir(dir) {
  return readdirSync(resolve(__dirname, dir))
    .map(nesteddir => resolve(__dirname, dir, nesteddir));
}

/**
 * @param  {...string} file
 * @return {string|null}
 */
function readfile(file) {
  try {
    return readFileSync(resolve.apply(null, arguments), 'utf8');
  } catch(e) {
    return null;
  }
}

suite('tokens', () => {
  setup(() => hook({}));
  teardown(() => detachHook('.css'));
  readdir('./cases').forEach(describeTest);
});
