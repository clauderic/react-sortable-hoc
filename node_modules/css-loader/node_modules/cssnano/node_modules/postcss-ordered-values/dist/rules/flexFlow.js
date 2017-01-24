'use strict';

exports.__esModule = true;
exports.default = normalizeFlexFlow;

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// flex-flow: <flex-direction> || <flex-wrap>
var flexFlowProps = ['flex-flow'];

var flexDirection = ['row', 'row-reverse', 'column', 'column-reverse'];

var flexWrap = ['nowrap ', 'wrap', 'wrap-reverse'];

function normalizeFlexFlow(decl) {
    if (! ~flexFlowProps.indexOf(decl.prop)) {
        return;
    }
    var order = { direction: '', wrap: '' };
    var flexFlow = (0, _postcssValueParser2.default)(decl.value);
    if (flexFlow.nodes.length > 2) {
        flexFlow.walk(function (node) {
            if (~flexDirection.indexOf(node.value)) {
                order.direction = node.value;
                return;
            }
            if (~flexWrap.indexOf(node.value)) {
                order.wrap = node.value;
                return;
            }
        });
        decl.value = (order.direction + ' ' + order.wrap).trim();
    }
};
module.exports = exports['default'];