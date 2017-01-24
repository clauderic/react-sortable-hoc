'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _uniqs = require('uniqs');

var _uniqs2 = _interopRequireDefault(_uniqs);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _flatten = require('flatten');

var _flatten2 = _interopRequireDefault(_flatten);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var comma = _postcss.list.comma;
var space = _postcss.list.space;

function filterAtRule(css, declRegex, atruleRegex) {
    var atRules = [];
    var values = [];
    css.walk(function (node) {
        if (node.type === 'decl' && declRegex.test(node.prop)) {
            return comma(node.value).forEach(function (val) {
                return values.push(space(val));
            });
        }
        if (node.type === 'atrule' && atruleRegex.test(node.name)) {
            atRules.push(node);
        }
    });
    values = (0, _uniqs2.default)((0, _flatten2.default)(values));
    atRules.forEach(function (node) {
        var hasAtRule = values.some(function (value) {
            return value === node.params;
        });
        if (!hasAtRule) {
            node.remove();
        }
    });
}

function hasFont(fontFamily, cache) {
    return comma(fontFamily).some(function (font) {
        return cache.some(function (c) {
            return ~c.indexOf(font);
        });
    });
}

function filterNamespace(css) {
    var atRules = [];
    var rules = [];
    css.walk(function (node) {
        var type = node.type;
        var selector = node.selector;
        var name = node.name;

        if (type === 'rule' && /\|/.test(selector)) {
            return rules.push(selector.split('|')[0]);
        }
        if (type === 'atrule' && name === 'namespace') {
            atRules.push(node);
        }
    });
    rules = (0, _uniqs2.default)((0, _flatten2.default)(rules));
    atRules.forEach(function (atRule) {
        var _atRule$params$split$ = atRule.params.split(' ').filter(Boolean);

        var param = _atRule$params$split$[0];
        var len = _atRule$params$split$.length;

        if (len === 1) {
            return;
        }
        var hasRule = rules.some(function (rule) {
            return rule === param || rule === '*';
        });
        if (!hasRule) {
            atRule.remove();
        }
    });
}

// fonts have slightly different logic
function filterFont(css) {
    var atRules = [];
    var values = [];
    css.walk(function (node) {
        if (node.type === 'decl' && node.parent.type === 'rule' && /font(|-family)/.test(node.prop)) {
            return values.push(comma(node.value));
        }
        if (node.type === 'atrule' && node.name === 'font-face' && node.nodes) {
            atRules.push(node);
        }
    });
    values = (0, _uniqs2.default)((0, _flatten2.default)(values));
    atRules.forEach(function (rule) {
        var families = rule.nodes.filter(function (node) {
            return node.prop === 'font-family';
        });
        // Discard the @font-face if it has no font-family
        if (!families.length) {
            return rule.remove();
        }
        families.forEach(function (family) {
            if (!hasFont(family.value, values)) {
                rule.remove();
            }
        });
    });
}

module.exports = _postcss2.default.plugin('postcss-discard-unused', function (opts) {
    var _fontFace$counterStyl = _extends({
        fontFace: true,
        counterStyle: true,
        keyframes: true,
        namespace: true
    }, opts);

    var fontFace = _fontFace$counterStyl.fontFace;
    var counterStyle = _fontFace$counterStyl.counterStyle;
    var keyframes = _fontFace$counterStyl.keyframes;
    var namespace = _fontFace$counterStyl.namespace;

    return function (css) {
        if (fontFace) {
            filterFont(css);
        }
        if (counterStyle) {
            filterAtRule(css, /list-style|system/, /counter-style/);
        }
        if (keyframes) {
            filterAtRule(css, /animation/, /keyframes/);
        }
        if (namespace) {
            filterNamespace(css);
        }
    };
});