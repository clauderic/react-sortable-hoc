'use strict';

exports.__esModule = true;

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _encode = require('./lib/encode');

var _encode2 = _interopRequireDefault(_encode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isNum(node) {
    return (0, _postcssValueParser.unit)(node.value);
}

function transformAtRule(css, atRuleRegex, propRegex, encoder) {
    var cache = {};
    var ruleCache = [];
    var declCache = [];
    // Encode at rule names and cache the result
    css.walk(function (node) {
        if (node.type === 'atrule' && atRuleRegex.test(node.name)) {
            if (!cache[node.params]) {
                cache[node.params] = {
                    ident: encoder(node.params, Object.keys(cache).length),
                    count: 0
                };
            }
            node.params = cache[node.params].ident;
            ruleCache.push(node);
        } else if (node.type === 'decl' && propRegex.test(node.prop)) {
            declCache.push(node);
        }
    });
    // Iterate each property and change their names
    declCache.forEach(function (decl) {
        decl.value = (0, _postcssValueParser2.default)(decl.value).walk(function (node) {
            if (node.type === 'word' && node.value in cache) {
                cache[node.value].count++;
                node.value = cache[node.value].ident;
            } else if (node.type === 'space') {
                node.value = ' ';
            } else if (node.type === 'div') {
                node.before = node.after = '';
            }
        }).toString();
    });
    // Ensure that at rules with no references to them are left unchanged
    ruleCache.forEach(function (rule) {
        Object.keys(cache).forEach(function (key) {
            var k = cache[key];
            if (k.ident === rule.params && !k.count) {
                rule.params = key;
            }
        });
    });
}

function transformDecl(css, propOneRegex, propTwoRegex, encoder) {
    var cache = {};
    var declOneCache = [];
    var declTwoCache = [];
    css.walkDecls(function (decl) {
        if (propOneRegex.test(decl.prop)) {
            decl.value = (0, _postcssValueParser2.default)(decl.value).walk(function (node) {
                if (node.type === 'word' && !isNum(node)) {
                    if (!cache[node.value]) {
                        cache[node.value] = {
                            ident: encoder(node.value, Object.keys(cache).length),
                            count: 0
                        };
                    }
                    node.value = cache[node.value].ident;
                } else if (node.type === 'space') {
                    node.value = ' ';
                }
            });
            declOneCache.push(decl);
        } else if (propTwoRegex.test(decl.prop)) {
            declTwoCache.push(decl);
        }
    });
    declTwoCache.forEach(function (decl) {
        decl.value = (0, _postcssValueParser2.default)(decl.value).walk(function (node) {
            if (node.type === 'function') {
                if (node.value === 'counter' || node.value === 'counters') {
                    (0, _postcssValueParser.walk)(node.nodes, function (n) {
                        if (n.type === 'word' && n.value in cache) {
                            cache[n.value].count++;
                            n.value = cache[n.value].ident;
                        } else if (n.type === 'div') {
                            n.before = n.after = '';
                        }
                    });
                }
                return false;
            }
            if (node.type === 'space') {
                node.value = ' ';
            }
        }).toString();
    });
    declOneCache.forEach(function (decl) {
        decl.value = decl.value.walk(function (node) {
            if (node.type === 'word' && !isNum(node)) {
                Object.keys(cache).forEach(function (key) {
                    var k = cache[key];
                    if (k.ident === node.value && !k.count) {
                        node.value = key;
                    }
                });
            }
        }).toString();
    });
}

exports.default = _postcss2.default.plugin('postcss-reduce-idents', function () {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var encoder = opts.encoder || _encode2.default;
    return function (css) {
        if (opts.counter !== false) {
            transformDecl(css, /counter-(reset|increment)/, /content/, encoder);
        }
        if (opts.keyframes !== false) {
            transformAtRule(css, /keyframes/, /animation/, encoder);
        }
        if (opts.counterStyle !== false) {
            transformAtRule(css, /counter-style/, /(list-style|system)/, encoder);
        }
    };
});
module.exports = exports['default'];