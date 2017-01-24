/*istanbul ignore next*/"use strict";

exports.__esModule = true;

exports.default = function ( /*istanbul ignore next*/_ref) {
  /*istanbul ignore next*/var t = _ref.types;

  return { /*istanbul ignore next*/
    pre: function pre(file) {
      file.set("helpersNamespace", t.identifier("babelHelpers"));
    }
  };
};

/*istanbul ignore next*/module.exports = exports["default"];