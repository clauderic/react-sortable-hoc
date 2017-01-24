'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _libConvert = require('./lib/convert');

var _libConvert2 = _interopRequireDefault(_libConvert);

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

function parseWord(node, opts, stripZeroUnit) {
    var pair = (0, _postcssValueParser.unit)(node.value);
    if (pair) {
        var num = Number(pair.number);
        var u = pair.unit.toLowerCase();
        if (num === 0) {
            node.value = stripZeroUnit || u === 'ms' || u === 's' || u === 'deg' || u === 'rad' || u === 'grad' || u === 'turn' ? 0 + u : 0;
        } else {
            node.value = (0, _libConvert2['default'])(num, u, opts);
        }
    }
}

function transform(opts) {
    return function (decl) {
        if (~decl.prop.indexOf('flex')) {
            return;
        }

        decl.value = (0, _postcssValueParser2['default'])(decl.value).walk(function (node) {
            if (node.type === 'word') {
                if ((decl.prop === 'max-height' || decl.prop === 'height') && ~decl.value.indexOf('%')) {
                    parseWord(node, opts, true);
                } else {
                    parseWord(node, opts);
                }
            } else if (node.type === 'function') {
                if (node.value === 'calc' || node.value === 'hsl' || node.value === 'hsla') {
                    (0, _postcssValueParser.walk)(node.nodes, function (node) {
                        if (node.type === 'word') {
                            parseWord(node, opts, true);
                        }
                    });
                    return false;
                }
                if (node.value === 'url') {
                    return false;
                }
            }
        }).toString();
    };
}

exports['default'] = _postcss2['default'].plugin('postcss-convert-values', function (opts) {
    opts = opts || {};
    if (opts.length === undefined && opts.convertLength !== undefined) {
        console.warn('postcss-convert-values: `convertLength` option is deprecated. Use `length`');
        opts.length = opts.convertLength;
    }
    if (opts.length === undefined && opts.convertTime !== undefined) {
        console.warn('postcss-convert-values: `convertTime` option is deprecated. Use `time`');
        opts.time = opts.convertTime;
    }
    return function (css) {
        css.walkDecls(transform(opts));
    };
});
module.exports = exports['default'];