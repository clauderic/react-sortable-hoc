'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

function reduce(node) {
    if (!node.type === 'function') {
        return false;
    }
    // matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1) => matrix(a, b, c, d, tx, ty)
    if (node.value === 'matrix3d') {
        if (node.nodes[30] && parseFloat(node.nodes[4].value) === 0 && parseFloat(node.nodes[6].value) === 0 && parseFloat(node.nodes[12].value) === 0 && parseFloat(node.nodes[14].value) === 0 && parseFloat(node.nodes[16].value) === 0 && parseFloat(node.nodes[18].value) === 0 && parseFloat(node.nodes[20].value) === 1 && parseFloat(node.nodes[22].value) === 0 && parseFloat(node.nodes[28].value) === 0 && parseFloat(node.nodes[30].value) === 1) {
            node.value = 'matrix';
            node.nodes = [node.nodes[0], node.nodes[1], node.nodes[2], node.nodes[3], node.nodes[8], node.nodes[9], node.nodes[10], node.nodes[11], node.nodes[24], node.nodes[25], node.nodes[26]];
        }
        return false;
    }
    if (node.value === 'rotate3d') {
        if (node.nodes[6]) {
            var first = parseFloat(node.nodes[0].value);
            var second = parseFloat(node.nodes[2].value);
            var third = parseFloat(node.nodes[4].value);
            // rotate3d(0, 1, 0, a) => rotateY(a)
            if (first === 1 && second === 0 && third === 0) {
                node.value = 'rotateX';
                node.nodes = [node.nodes[6]];
                return false;
            }
            // rotate3d(0, 1, 0, a) => rotateY(a)
            if (first === 0 && second === 1 && third === 0) {
                node.value = 'rotateY';
                node.nodes = [node.nodes[6]];
                return false;
            }
            // rotate3d(0, 0, 1, a) => rotate(a) (or rotateZ(a))
            if (first === 0 && second === 0 && third === 1) {
                node.value = 'rotate';
                node.nodes = [node.nodes[6]];
                return false;
            }
        }
        return false;
    }
    // rotateZ(rz) => rotate(rz)
    if (node.value === 'rotateZ') {
        node.value = 'rotate';
        return false;
    }
    if (node.value === 'scale' || node.value === 'translate') {
        if (node.value === 'scale' && node.nodes[2]) {
            // scale(sx, sy) => scale(sx)
            if (node.nodes[0].value === node.nodes[2].value) {
                node.nodes = [node.nodes[0]];
                return false;
            }
            // scale(sx, 1) => scaleX(sx)
            if (parseFloat(node.nodes[2].value) === 1) {
                node.value = 'scaleX';
                node.nodes = [node.nodes[0]];
                return false;
            }
            // scale(1, sy) => scaleY(sy)
            if (parseFloat(node.nodes[0].value) === 1) {
                node.value = 'scaleY';
                node.nodes = [node.nodes[2]];
                return false;
            }
            return false;
        }
        if (node.value === 'translate' && node.nodes[2]) {
            // translate(tx, 0) => translate(tx)
            if (parseFloat(node.nodes[2].value) === 0) {
                node.value = 'translate', node.nodes = [node.nodes[0]];
                return false;
            }
            // translate(0, ty) => translateY(ty)
            if (parseFloat(node.nodes[0].value) === 0) {
                node.value = 'translateY', node.nodes = [node.nodes[2]];
                return false;
            }
            return false;
        }
        return false;
    }
    if (node.value === 'scale3d') {
        if (node.nodes[4]) {
            var first = parseFloat(node.nodes[0].value);
            var second = parseFloat(node.nodes[2].value);
            var third = parseFloat(node.nodes[4].value);
            // scale3d(sx, 1, 1) => scaleX(sx)
            if (second === 1 && third === 1) {
                node.value = 'scaleX', node.nodes = [node.nodes[0]];
                return false;
            }
            // scale3d(1, sy, 1) => scaleY(sy)
            if (first === 1 && third === 1) {
                node.value = 'scaleY', node.nodes = [node.nodes[2]];
                return false;
            }
            // scale3d(1, 1, sz) => scaleZ(sz)
            if (first === 1 && second === 1) {
                node.value = 'scaleZ', node.nodes = [node.nodes[4]];
                return false;
            }
        }
        return false;
    }
    // translate3d(0, 0, tz) => translateZ(tz)
    if (node.value === 'translate3d') {
        if (node.nodes[4] && parseFloat(node.nodes[0].value) === 0 && parseFloat(node.nodes[2].value) === 0) {
            node.value = 'translateZ', node.nodes = [node.nodes[4]];
        }
        return false;
    }
}

exports['default'] = _postcss2['default'].plugin('postcss-reduce-transforms', function () {
    return function (css) {
        css.walkDecls(/transform$/, function (decl) {
            decl.value = (0, _postcssValueParser2['default'])(decl.value).walk(reduce).toString();
        });
    };
});
module.exports = exports['default'];