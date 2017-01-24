'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

var angles = {
    top: '0deg',
    right: '90deg',
    bottom: '180deg',
    left: '270deg'
};

function getArguments(node) {
    return node.nodes.reduce(function (list, child) {
        if (child.type !== 'div') {
            list[list.length - 1].push(child);
        } else {
            list.push([]);
        }
        return list;
    }, [[]]);
}

function isLessThan(a, b) {
    return a.unit === b.unit && parseInt(a.number, 10) >= parseInt(b.number, 10);
}

function optimise(decl) {
    if (! ~decl.value.indexOf('gradient')) {
        return;
    }
    decl.value = (0, _postcssValueParser2['default'])(decl.value).walk(function (node) {
        if (node.type !== 'function') {
            return false;
        }
        if (node.value === 'linear-gradient' || node.value === 'repeating-linear-gradient' || node.value === '-webkit-linear-gradient' || node.value === '-webkit-repeating-linear-gradient') {
            var _ret = (function () {
                var args = getArguments(node);
                if (node.nodes[0].value === 'to' && args[0].length === 3) {
                    node.nodes = node.nodes.slice(2);
                    node.nodes[0].value = angles[node.nodes[0].value];
                }
                var lastStop = undefined;
                args.forEach(function (arg, index) {
                    if (!arg[2]) {
                        return;
                    }
                    var thisStop = (0, _postcssValueParser.unit)(arg[2].value);
                    if (!lastStop) {
                        lastStop = thisStop;
                        if (lastStop && lastStop.number === '0' && lastStop.unit !== 'deg') {
                            arg[1].value = arg[2].value = '';
                        }
                        return;
                    }
                    if (isLessThan(lastStop, thisStop)) {
                        arg[2].value = 0;
                    }
                    lastStop = thisStop;
                    if (index === args.length - 1 && arg[2].value === '100%') {
                        arg[1].value = arg[2].value = '';
                    }
                });
                return {
                    v: false
                };
            })();

            if (typeof _ret === 'object') return _ret.v;
        }
        if (node.value === 'radial-gradient' || node.value === 'repeating-radial-gradient' || node.value === '-webkit-radial-gradient' || node.value === '-webkit-repeating-radial-gradient') {
            var _ret2 = (function () {
                var args = getArguments(node);
                var lastStop = undefined;
                args.forEach(function (arg) {
                    if (!arg[2]) {
                        return;
                    }
                    var thisStop = (0, _postcssValueParser.unit)(arg[2].value);
                    if (!lastStop) {
                        lastStop = thisStop;
                        return;
                    }
                    if (isLessThan(lastStop, thisStop)) {
                        arg[2].value = 0;
                    }
                    lastStop = thisStop;
                });
                return {
                    v: false
                };
            })();

            if (typeof _ret2 === 'object') return _ret2.v;
        }
    }).toString();
}

exports['default'] = _postcss2['default'].plugin('postcss-minify-gradients', function () {
    return function (css) {
        return css.walkDecls(optimise);
    };
});
module.exports = exports['default'];