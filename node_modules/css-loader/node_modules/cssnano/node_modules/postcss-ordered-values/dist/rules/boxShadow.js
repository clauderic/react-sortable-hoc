'use strict';

exports.__esModule = true;
exports.default = normalizeBoxShadow;

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getArguments(node) {
    return node.nodes.reduce(function (list, child) {
        if (child.type !== 'div' || child.value !== ',') {
            list[list.length - 1].push(child);
        } else {
            list.push([]);
        }
        return list;
    }, [[]]);
}

// box-shadow: inset? && <length>{2,4} && <color>?

function normalizeBoxShadow(decl) {
    if (decl.prop !== 'box-shadow') {
        return;
    }
    var parsed = (0, _postcssValueParser2.default)(decl.value);
    if (parsed.nodes.length < 2) {
        return;
    }

    var args = getArguments(parsed);
    var values = [];

    args.forEach(function (arg) {
        values.push([]);
        var value = values[values.length - 1];
        var state = {
            inset: [],
            color: []
        };
        arg.forEach(function (node) {
            if (node.type === 'space') {
                return;
            }
            if ((0, _postcssValueParser.unit)(node.value)) {
                value.push(node);
                value.push({ type: 'space', value: ' ' });
            } else if (node.value === 'inset') {
                state.inset.push(node);
                state.inset.push({ type: 'space', value: ' ' });
            } else {
                state.color.push(node);
                state.color.push({ type: 'space', value: ' ' });
            }
        });
        values[values.length - 1] = state.inset.concat(value).concat(state.color);
    });

    decl.value = (0, _postcssValueParser.stringify)({
        nodes: values.reduce(function (nodes, arg, index) {
            arg.forEach(function (val, idx) {
                if (idx === arg.length - 1 && index === values.length - 1 && val.type === 'space') {
                    return;
                }
                nodes.push(val);
            });
            if (index !== values.length - 1) {
                if (nodes[nodes.length - 1] && nodes[nodes.length - 1].type === 'space') {
                    nodes[nodes.length - 1].type = 'div';
                    nodes[nodes.length - 1].value = ',';
                    return nodes;
                }
                nodes.push({ type: 'div', value: ',' });
            }
            return nodes;
        }, [])
    });
}
module.exports = exports['default'];