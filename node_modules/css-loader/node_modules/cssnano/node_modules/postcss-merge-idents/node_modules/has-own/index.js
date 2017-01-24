
var hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = exports = function hasOwn(prop, obj) {
  return hasOwnProperty.call(obj, prop);
}

exports.version = require('./package').version;
