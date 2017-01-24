const validate = require('../../lib/validate');

suite('lib/validate', () => {
  test('should thrown an error for the option with multiple types if wrong type specified', () => {
    assert.throws(() => validate({extensions: null}, TypeError));
  });

  test('should thrown an error for the option with single type if wrong type specified', () => {
    assert.throws(() => validate({preprocessCss: ''}, TypeError));
  });

  test('should NOT throw an error for the valid type', () => {
    assert.doesNotThrow(() => validate({preprocessCss: function () {}}));
  });

  test('should throw an error if unknown options are specified', () => {
    assert.throws(() => validate({a: '', b: ''}), Error);
  });
});
