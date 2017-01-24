/*istanbul ignore next*/"use strict";

exports.__esModule = true;

exports.default = function () {
  return {
    inherits: require("babel-plugin-syntax-async-functions"),

    visitor: { /*istanbul ignore next*/
      Function: function Function(path, state) {
        if (!path.node.async || path.node.generator) return;

        /*istanbul ignore next*/(0, _babelHelperRemapAsyncToGenerator2.default)(path, state.addHelper("asyncToGenerator"));
      }
    }
  };
};

var /*istanbul ignore next*/_babelHelperRemapAsyncToGenerator = require("babel-helper-remap-async-to-generator");

/*istanbul ignore next*/
var _babelHelperRemapAsyncToGenerator2 = _interopRequireDefault(_babelHelperRemapAsyncToGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];