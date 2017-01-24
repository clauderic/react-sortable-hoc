"use strict";

exports.__esModule = true;

var _plugin = require("../plugin");

var _plugin2 = _interopRequireDefault(_plugin);

var _sortBy = require("lodash/sortBy");

var _sortBy2 = _interopRequireDefault(_sortBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _plugin2.default({
  /**
   * [Please add a description.]
   *
   * Priority:
   *
   *  - 0 We want this to be at the **very** bottom
   *  - 1 Default node position
   *  - 2 Priority over normal nodes
   *  - 3 We want this to be at the **very** top
   */

  visitor: {
    Block: {
      exit: function exit(_ref) {
        var node = _ref.node;

        var hasChange = false;
        for (var i = 0; i < node.body.length; i++) {
          var bodyNode = node.body[i];
          if (bodyNode && bodyNode._blockHoist != null) {
            hasChange = true;
            break;
          }
        }
        if (!hasChange) return;

        node.body = (0, _sortBy2.default)(node.body, function (bodyNode) {
          var priority = bodyNode && bodyNode._blockHoist;
          if (priority == null) priority = 1;
          if (priority === true) priority = 2;

          // Higher priorities should move toward the top.
          return -1 * priority;
        });
      }
    }
  }
});
module.exports = exports["default"];