'use strict';

exports.__esModule = true;
exports.default = normalizeBorder;

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// border: <line-width> || <line-style> || <color>
// outline: <outline-color> || <outline-style> || <outline-width>
var borderProps = ['border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'outline'];

var borderWidths = ['thin', 'medium', 'thick'];

var borderStyles = ['none', 'auto', // only in outline-style
'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];

function normalizeBorder(decl) {
    if (! ~borderProps.indexOf(decl.prop)) {
        return;
    }
    var order = { width: '', style: '', color: '' };
    var border = (0, _postcssValueParser2.default)(decl.value);
    if (border.nodes.length > 2) {
        border.walk(function (node) {
            if (node.type === 'word') {
                if (~borderStyles.indexOf(node.value)) {
                    order.style = node.value;
                    return false;
                }
                if (~borderWidths.indexOf(node.value) || (0, _postcssValueParser.unit)(node.value)) {
                    order.width = node.value;
                    return false;
                }
                order.color = node.value;
                return false;
            }
            if (node.type === 'function') {
                if (node.value === 'calc') {
                    order.width = (0, _postcssValueParser.stringify)(node);
                } else {
                    order.color = (0, _postcssValueParser.stringify)(node);
                }
                return false;
            }
        });
        decl.value = (order.width + ' ' + order.style + ' ' + order.color).trim();
    }
};
module.exports = exports['default'];