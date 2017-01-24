'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

function minimiseWhitespace(node) {
    if (node.type === 'decl') {
        // Ensure that !important values do not have any excess whitespace
        if (node.important) {
            node.raws.important = '!important';
        }
        // Remove whitespaces around ie 9 hack
        node.value = node.value.replace(/\s*(\\9)\s*/, '$1');
        // Remove extra semicolons and whitespace before the declaration
        if (node.raws.before) {
            node.raws.before = node.raws.before.replace(/[;\s]/g, '');
        }
        node.raws.between = ':';
        node.raws.semicolon = false;
    } else if (node.type === 'rule' || node.type === 'atrule') {
        node.raws.before = node.raws.between = node.raws.after = '';
        node.raws.semicolon = false;
    }
}

exports.default = (0, _postcss.plugin)('cssnano-core', function () {
    return function (css) {
        css.walk(minimiseWhitespace);
        // Remove final newline
        css.raws.after = '';
    };
});
module.exports = exports['default'];