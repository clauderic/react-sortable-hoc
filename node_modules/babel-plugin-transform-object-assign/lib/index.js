/*istanbul ignore next*/"use strict";

exports.__esModule = true;

exports.default = function () {
  return {
    visitor: {
      CallExpression: function /*istanbul ignore next*/CallExpression(path, file) {
        if (path.get("callee").matchesPattern("Object.assign")) {
          path.node.callee = file.addHelper("extends");
        }
      }
    }
  };
};

/*istanbul ignore next*/module.exports = exports["default"];