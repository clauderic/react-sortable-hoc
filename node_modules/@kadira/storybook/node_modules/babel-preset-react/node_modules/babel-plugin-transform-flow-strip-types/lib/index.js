/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = function ( /*istanbul ignore next*/_ref) {
  /*istanbul ignore next*/var t = _ref.types;

  var FLOW_DIRECTIVE = "@flow";

  return {
    inherits: require("babel-plugin-syntax-flow"),

    visitor: { /*istanbul ignore next*/
      Program: function Program(path, _ref2) {
        /*istanbul ignore next*/var comments = _ref2.file.ast.comments;

        for ( /*istanbul ignore next*/var _iterator = comments, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
          /*istanbul ignore next*/
          var _ref3;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref3 = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref3 = _i.value;
          }

          var comment = _ref3;

          if (comment.value.indexOf(FLOW_DIRECTIVE) >= 0) {
            // remove flow directive
            comment.value = comment.value.replace(FLOW_DIRECTIVE, "");

            // remove the comment completely if it only consists of whitespace and/or stars
            if (!comment.value.replace(/\*/g, "").trim()) comment.ignore = true;
          }
        }
      },
      /*istanbul ignore next*/Flow: function Flow(path) {
        path.remove();
      },
      /*istanbul ignore next*/ClassProperty: function ClassProperty(path) {
        path.node.typeAnnotation = null;
        if (!path.node.value) path.remove();
      },
      /*istanbul ignore next*/Class: function Class(_ref4) {
        /*istanbul ignore next*/var node = _ref4.node;

        node.implements = null;
      },
      /*istanbul ignore next*/Function: function Function(_ref5) {
        /*istanbul ignore next*/var node = _ref5.node;

        for (var i = 0; i < node.params.length; i++) {
          var param = node.params[i];
          param.optional = false;
        }
      },
      /*istanbul ignore next*/TypeCastExpression: function TypeCastExpression(path) {
        /*istanbul ignore next*/var node = path.node;

        do {
          node = node.expression;
        } while (t.isTypeCastExpression(node));
        path.replaceWith(node);
      }
    }
  };
};

/*istanbul ignore next*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];