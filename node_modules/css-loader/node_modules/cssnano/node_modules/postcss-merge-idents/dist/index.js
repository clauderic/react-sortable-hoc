'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.__esModule = true;

var _hasOwn = require('has-own');

var _hasOwn2 = _interopRequireDefault(_hasOwn);

var _postcss = require('postcss');

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function canonical(obj) {
    return function recurse(key) {
        if ((0, _hasOwn2.default)(key, obj) && obj[key] !== key) {
            return recurse(obj[key]);
        }
        return key;
    };
}

function mergeAtRules(css, pairs) {
    pairs.forEach(function (pair) {
        pair.cache = [];
        pair.replacements = [];
        pair.decls = [];
    });

    var relevant = undefined;

    css.walk(function (node) {
        if (node.type === 'atrule') {
            relevant = pairs.filter(function (pair) {
                return pair.atrule.test(node.name);
            })[0];
            if (!relevant) {
                return;
            }
            if (relevant.cache.length < 1) {
                relevant.cache.push(node);
                return;
            } else {
                var _ret = function () {
                    var toString = node.nodes.toString();
                    relevant.cache.forEach(function (cached) {
                        if (cached.name === node.name && cached.nodes.toString() === toString) {
                            cached.remove();
                            relevant.replacements[cached.params] = node.params;
                        }
                    });
                    relevant.cache.push(node);
                    return {
                        v: undefined
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
        }
        if (node.type === 'decl') {
            relevant = pairs.filter(function (pair) {
                return pair.decl.test(node.prop);
            })[0];
            if (!relevant) {
                return;
            }
            relevant.decls.push(node);
        }
    });

    pairs.forEach(function (pair) {
        var canon = canonical(pair.replacements);
        pair.decls.forEach(function (decl) {
            decl.value = (0, _postcssValueParser2.default)(decl.value).walk(function (node) {
                if (node.type === 'word') {
                    node.value = canon(node.value);
                }
                if (node.type === 'space') {
                    node.value = ' ';
                }
                if (node.type === 'div') {
                    node.before = node.after = '';
                }
            }).toString();
        });
    });
}

exports.default = (0, _postcss.plugin)('postcss-merge-idents', function () {
    return function (css) {
        mergeAtRules(css, [{
            atrule: /keyframes/,
            decl: /animation/
        }, {
            atrule: /counter-style/,
            decl: /(list-style|system)/
        }]);
    };
});
module.exports = exports['default'];