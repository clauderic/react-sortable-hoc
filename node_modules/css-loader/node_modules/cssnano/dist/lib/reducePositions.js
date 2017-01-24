'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var directions = ['top', 'right', 'bottom', 'left', 'center'];
var properties = ['background', 'background-position'];

var horizontal = {
    right: '100%',
    left: '0'
};

var vertical = {
    bottom: '100%',
    top: '0'
};

var hkeys = Object.keys(horizontal);
var vkeys = Object.keys(vertical);

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

function transform(decl) {
    if (! ~properties.indexOf(decl.prop)) {
        return;
    }
    var values = (0, _postcssValueParser2.default)(decl.value);
    var args = getArguments(values);
    var relevant = [];
    args.forEach(function (arg) {
        relevant.push({
            start: null,
            end: null
        });
        arg.forEach(function (part, index) {
            var isPosition = ~directions.indexOf(part.value) || (0, _postcssValueParser.unit)(part.value);
            var len = relevant.length - 1;
            if (relevant[len].start === null && isPosition) {
                relevant[len].start = index;
                relevant[len].end = index;
                return;
            }
            if (relevant[len].start !== null) {
                if (part.type === 'space') {
                    return;
                } else if (isPosition) {
                    relevant[len].end = index;
                    return;
                }
                return;
            }
        });
    });
    relevant.forEach(function (range, index) {
        if (range.start === null) {
            return;
        }
        var position = args[index].slice(range.start, range.end + 1);
        if (position.length > 3) {
            return;
        }
        if (position.length === 1 || position[2].value === 'center') {
            if (position[2]) {
                position[2].value = position[1].value = '';
            }
            if (position[0].value === 'right') {
                position[0].value = '100%';
                return;
            }
            if (position[0].value === 'left') {
                position[0].value = '0';
                return;
            }
            if (position[0].value === 'center') {
                position[0].value = '50%';
                return;
            }
            return;
        }
        if (position[0].value === 'center' && ~directions.indexOf(position[2].value)) {
            position[0].value = position[1].value = '';
            if (position[2].value === 'right') {
                position[2].value = '100%';
                return;
            }
            if (position[2].value === 'left') {
                position[2].value = '0';
                return;
            }
            return;
        }
        if (~hkeys.indexOf(position[0].value) && ~vkeys.indexOf(position[2].value)) {
            position[0].value = horizontal[position[0].value];
            position[2].value = vertical[position[2].value];
            return;
        } else if (~vkeys.indexOf(position[0].value) && ~hkeys.indexOf(position[2].value)) {
            var first = position[0].value;
            position[0].value = horizontal[position[2].value];
            position[2].value = vertical[first];
            return;
        }
    });
    decl.value = values.toString();
}

exports.default = (0, _postcss.plugin)('cssnano-reduce-positions', function () {
    return function (css) {
        return css.walkDecls(transform);
    };
});
module.exports = exports['default'];