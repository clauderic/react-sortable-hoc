/*istanbul ignore next*/"use strict";

exports.__esModule = true;

exports.default = function () {
  return { /*istanbul ignore next*/
    manipulateOptions: function manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("exportExtensions");
    }
  };
};

/*istanbul ignore next*/module.exports = exports["default"];