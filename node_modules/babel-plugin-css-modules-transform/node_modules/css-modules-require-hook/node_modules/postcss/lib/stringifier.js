'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable valid-jsdoc */

var defaultRaw = {
    colon: ': ',
    indent: '    ',
    beforeDecl: '\n',
    beforeRule: '\n',
    beforeOpen: ' ',
    beforeClose: '\n',
    beforeComment: '\n',
    after: '\n',
    emptyBody: '',
    commentLeft: ' ',
    commentRight: ' '
};

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

var Stringifier = function () {
    function Stringifier(builder) {
        _classCallCheck(this, Stringifier);

        this.builder = builder;
    }

    Stringifier.prototype.stringify = function stringify(node, semicolon) {
        this[node.type](node, semicolon);
    };

    Stringifier.prototype.root = function root(node) {
        this.body(node);
        if (node.raws.after) this.builder(node.raws.after);
    };

    Stringifier.prototype.comment = function comment(node) {
        var left = this.raw(node, 'left', 'commentLeft');
        var right = this.raw(node, 'right', 'commentRight');
        this.builder('/*' + left + node.text + right + '*/', node);
    };

    Stringifier.prototype.decl = function decl(node, semicolon) {
        var between = this.raw(node, 'between', 'colon');
        var string = node.prop + between + this.rawValue(node, 'value');

        if (node.important) {
            string += node.raws.important || ' !important';
        }

        if (semicolon) string += ';';
        this.builder(string, node);
    };

    Stringifier.prototype.rule = function rule(node) {
        this.block(node, this.rawValue(node, 'selector'));
    };

    Stringifier.prototype.atrule = function atrule(node, semicolon) {
        var name = '@' + node.name;
        var params = node.params ? this.rawValue(node, 'params') : '';

        if (typeof node.raws.afterName !== 'undefined') {
            name += node.raws.afterName;
        } else if (params) {
            name += ' ';
        }

        if (node.nodes) {
            this.block(node, name + params);
        } else {
            var end = (node.raws.between || '') + (semicolon ? ';' : '');
            this.builder(name + params + end, node);
        }
    };

    Stringifier.prototype.body = function body(node) {
        var last = node.nodes.length - 1;
        while (last > 0) {
            if (node.nodes[last].type !== 'comment') break;
            last -= 1;
        }

        var semicolon = this.raw(node, 'semicolon');
        for (var i = 0; i < node.nodes.length; i++) {
            var child = node.nodes[i];
            var before = this.raw(child, 'before');
            if (before) this.builder(before);
            this.stringify(child, last !== i || semicolon);
        }
    };

    Stringifier.prototype.block = function block(node, start) {
        var between = this.raw(node, 'between', 'beforeOpen');
        this.builder(start + between + '{', node, 'start');

        var after = void 0;
        if (node.nodes && node.nodes.length) {
            this.body(node);
            after = this.raw(node, 'after');
        } else {
            after = this.raw(node, 'after', 'emptyBody');
        }

        if (after) this.builder(after);
        this.builder('}', node, 'end');
    };

    Stringifier.prototype.raw = function raw(node, own, detect) {
        var value = void 0;
        if (!detect) detect = own;

        // Already had
        if (own) {
            value = node.raws[own];
            if (typeof value !== 'undefined') return value;
        }

        var parent = node.parent;

        // Hack for first rule in CSS
        if (detect === 'before') {
            if (!parent || parent.type === 'root' && parent.first === node) {
                return '';
            }
        }

        // Floating child without parent
        if (!parent) return defaultRaw[detect];

        // Detect style by other nodes
        var root = node.root();
        if (!root.rawCache) root.rawCache = {};
        if (typeof root.rawCache[detect] !== 'undefined') {
            return root.rawCache[detect];
        }

        if (detect === 'before' || detect === 'after') {
            return this.beforeAfter(node, detect);
        } else {
            var method = 'raw' + capitalize(detect);
            if (this[method]) {
                value = this[method](root, node);
            } else {
                root.walk(function (i) {
                    value = i.raws[own];
                    if (typeof value !== 'undefined') return false;
                });
            }
        }

        if (typeof value === 'undefined') value = defaultRaw[detect];

        root.rawCache[detect] = value;
        return value;
    };

    Stringifier.prototype.rawSemicolon = function rawSemicolon(root) {
        var value = void 0;
        root.walk(function (i) {
            if (i.nodes && i.nodes.length && i.last.type === 'decl') {
                value = i.raws.semicolon;
                if (typeof value !== 'undefined') return false;
            }
        });
        return value;
    };

    Stringifier.prototype.rawEmptyBody = function rawEmptyBody(root) {
        var value = void 0;
        root.walk(function (i) {
            if (i.nodes && i.nodes.length === 0) {
                value = i.raws.after;
                if (typeof value !== 'undefined') return false;
            }
        });
        return value;
    };

    Stringifier.prototype.rawIndent = function rawIndent(root) {
        if (root.raws.indent) return root.raws.indent;
        var value = void 0;
        root.walk(function (i) {
            var p = i.parent;
            if (p && p !== root && p.parent && p.parent === root) {
                if (typeof i.raws.before !== 'undefined') {
                    var parts = i.raws.before.split('\n');
                    value = parts[parts.length - 1];
                    value = value.replace(/[^\s]/g, '');
                    return false;
                }
            }
        });
        return value;
    };

    Stringifier.prototype.rawBeforeComment = function rawBeforeComment(root, node) {
        var value = void 0;
        root.walkComments(function (i) {
            if (typeof i.raws.before !== 'undefined') {
                value = i.raws.before;
                if (value.indexOf('\n') !== -1) {
                    value = value.replace(/[^\n]+$/, '');
                }
                return false;
            }
        });
        if (typeof value === 'undefined') {
            value = this.raw(node, null, 'beforeDecl');
        }
        return value;
    };

    Stringifier.prototype.rawBeforeDecl = function rawBeforeDecl(root, node) {
        var value = void 0;
        root.walkDecls(function (i) {
            if (typeof i.raws.before !== 'undefined') {
                value = i.raws.before;
                if (value.indexOf('\n') !== -1) {
                    value = value.replace(/[^\n]+$/, '');
                }
                return false;
            }
        });
        if (typeof value === 'undefined') {
            value = this.raw(node, null, 'beforeRule');
        }
        return value;
    };

    Stringifier.prototype.rawBeforeRule = function rawBeforeRule(root) {
        var value = void 0;
        root.walk(function (i) {
            if (i.nodes && (i.parent !== root || root.first !== i)) {
                if (typeof i.raws.before !== 'undefined') {
                    value = i.raws.before;
                    if (value.indexOf('\n') !== -1) {
                        value = value.replace(/[^\n]+$/, '');
                    }
                    return false;
                }
            }
        });
        return value;
    };

    Stringifier.prototype.rawBeforeClose = function rawBeforeClose(root) {
        var value = void 0;
        root.walk(function (i) {
            if (i.nodes && i.nodes.length > 0) {
                if (typeof i.raws.after !== 'undefined') {
                    value = i.raws.after;
                    if (value.indexOf('\n') !== -1) {
                        value = value.replace(/[^\n]+$/, '');
                    }
                    return false;
                }
            }
        });
        return value;
    };

    Stringifier.prototype.rawBeforeOpen = function rawBeforeOpen(root) {
        var value = void 0;
        root.walk(function (i) {
            if (i.type !== 'decl') {
                value = i.raws.between;
                if (typeof value !== 'undefined') return false;
            }
        });
        return value;
    };

    Stringifier.prototype.rawColon = function rawColon(root) {
        var value = void 0;
        root.walkDecls(function (i) {
            if (typeof i.raws.between !== 'undefined') {
                value = i.raws.between.replace(/[^\s:]/g, '');
                return false;
            }
        });
        return value;
    };

    Stringifier.prototype.beforeAfter = function beforeAfter(node, detect) {
        var value = void 0;
        if (node.type === 'decl') {
            value = this.raw(node, null, 'beforeDecl');
        } else if (node.type === 'comment') {
            value = this.raw(node, null, 'beforeComment');
        } else if (detect === 'before') {
            value = this.raw(node, null, 'beforeRule');
        } else {
            value = this.raw(node, null, 'beforeClose');
        }

        var buf = node.parent;
        var depth = 0;
        while (buf && buf.type !== 'root') {
            depth += 1;
            buf = buf.parent;
        }

        if (value.indexOf('\n') !== -1) {
            var indent = this.raw(node, null, 'indent');
            if (indent.length) {
                for (var step = 0; step < depth; step++) {
                    value += indent;
                }
            }
        }

        return value;
    };

    Stringifier.prototype.rawValue = function rawValue(node, prop) {
        var value = node[prop];
        var raw = node.raws[prop];
        if (raw && raw.value === value) {
            return raw.raw;
        } else {
            return value;
        }
    };

    return Stringifier;
}();

exports.default = Stringifier;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmluZ2lmaWVyLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFFQSxJQUFNLGFBQWE7QUFDZixXQUFlLElBREE7QUFFZixZQUFlLE1BRkE7QUFHZixnQkFBZSxJQUhBO0FBSWYsZ0JBQWUsSUFKQTtBQUtmLGdCQUFlLEdBTEE7QUFNZixpQkFBZSxJQU5BO0FBT2YsbUJBQWUsSUFQQTtBQVFmLFdBQWUsSUFSQTtBQVNmLGVBQWUsRUFUQTtBQVVmLGlCQUFlLEdBVkE7QUFXZixrQkFBZTtBQVhBLENBQW5COztBQWNBLFNBQVMsVUFBVCxDQUFvQixHQUFwQixFQUF5QjtBQUNyQixXQUFPLElBQUksQ0FBSixFQUFPLFdBQVAsS0FBdUIsSUFBSSxLQUFKLENBQVUsQ0FBVixDQUE5QjtBQUNIOztJQUVLLFc7QUFFRix5QkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQ2pCLGFBQUssT0FBTCxHQUFlLE9BQWY7QUFDSDs7MEJBRUQsUyxzQkFBVSxJLEVBQU0sUyxFQUFXO0FBQ3ZCLGFBQUssS0FBSyxJQUFWLEVBQWdCLElBQWhCLEVBQXNCLFNBQXRCO0FBQ0gsSzs7MEJBRUQsSSxpQkFBSyxJLEVBQU07QUFDUCxhQUFLLElBQUwsQ0FBVSxJQUFWO0FBQ0EsWUFBSyxLQUFLLElBQUwsQ0FBVSxLQUFmLEVBQXVCLEtBQUssT0FBTCxDQUFhLEtBQUssSUFBTCxDQUFVLEtBQXZCO0FBQzFCLEs7OzBCQUVELE8sb0JBQVEsSSxFQUFNO0FBQ1YsWUFBSSxPQUFRLEtBQUssR0FBTCxDQUFTLElBQVQsRUFBZSxNQUFmLEVBQXdCLGFBQXhCLENBQVo7QUFDQSxZQUFJLFFBQVEsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFlLE9BQWYsRUFBd0IsY0FBeEIsQ0FBWjtBQUNBLGFBQUssT0FBTCxDQUFhLE9BQU8sSUFBUCxHQUFjLEtBQUssSUFBbkIsR0FBMEIsS0FBMUIsR0FBa0MsSUFBL0MsRUFBcUQsSUFBckQ7QUFDSCxLOzswQkFFRCxJLGlCQUFLLEksRUFBTSxTLEVBQVc7QUFDbEIsWUFBSSxVQUFVLEtBQUssR0FBTCxDQUFTLElBQVQsRUFBZSxTQUFmLEVBQTBCLE9BQTFCLENBQWQ7QUFDQSxZQUFJLFNBQVUsS0FBSyxJQUFMLEdBQVksT0FBWixHQUFzQixLQUFLLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLE9BQXBCLENBQXBDOztBQUVBLFlBQUssS0FBSyxTQUFWLEVBQXNCO0FBQ2xCLHNCQUFVLEtBQUssSUFBTCxDQUFVLFNBQVYsSUFBdUIsYUFBakM7QUFDSDs7QUFFRCxZQUFLLFNBQUwsRUFBaUIsVUFBVSxHQUFWO0FBQ2pCLGFBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsSUFBckI7QUFDSCxLOzswQkFFRCxJLGlCQUFLLEksRUFBTTtBQUNQLGFBQUssS0FBTCxDQUFXLElBQVgsRUFBaUIsS0FBSyxRQUFMLENBQWMsSUFBZCxFQUFvQixVQUFwQixDQUFqQjtBQUNILEs7OzBCQUVELE0sbUJBQU8sSSxFQUFNLFMsRUFBVztBQUNwQixZQUFJLE9BQVMsTUFBTSxLQUFLLElBQXhCO0FBQ0EsWUFBSSxTQUFTLEtBQUssTUFBTCxHQUFjLEtBQUssUUFBTCxDQUFjLElBQWQsRUFBb0IsUUFBcEIsQ0FBZCxHQUE4QyxFQUEzRDs7QUFFQSxZQUFLLE9BQU8sS0FBSyxJQUFMLENBQVUsU0FBakIsS0FBK0IsV0FBcEMsRUFBa0Q7QUFDOUMsb0JBQVEsS0FBSyxJQUFMLENBQVUsU0FBbEI7QUFDSCxTQUZELE1BRU8sSUFBSyxNQUFMLEVBQWM7QUFDakIsb0JBQVEsR0FBUjtBQUNIOztBQUVELFlBQUssS0FBSyxLQUFWLEVBQWtCO0FBQ2QsaUJBQUssS0FBTCxDQUFXLElBQVgsRUFBaUIsT0FBTyxNQUF4QjtBQUNILFNBRkQsTUFFTztBQUNILGdCQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUwsQ0FBVSxPQUFWLElBQXFCLEVBQXRCLEtBQTZCLFlBQVksR0FBWixHQUFrQixFQUEvQyxDQUFWO0FBQ0EsaUJBQUssT0FBTCxDQUFhLE9BQU8sTUFBUCxHQUFnQixHQUE3QixFQUFrQyxJQUFsQztBQUNIO0FBQ0osSzs7MEJBRUQsSSxpQkFBSyxJLEVBQU07QUFDUCxZQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixDQUEvQjtBQUNBLGVBQVEsT0FBTyxDQUFmLEVBQW1CO0FBQ2YsZ0JBQUssS0FBSyxLQUFMLENBQVcsSUFBWCxFQUFpQixJQUFqQixLQUEwQixTQUEvQixFQUEyQztBQUMzQyxvQkFBUSxDQUFSO0FBQ0g7O0FBRUQsWUFBSSxZQUFZLEtBQUssR0FBTCxDQUFTLElBQVQsRUFBZSxXQUFmLENBQWhCO0FBQ0EsYUFBTSxJQUFJLElBQUksQ0FBZCxFQUFpQixJQUFJLEtBQUssS0FBTCxDQUFXLE1BQWhDLEVBQXdDLEdBQXhDLEVBQThDO0FBQzFDLGdCQUFJLFFBQVMsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUFiO0FBQ0EsZ0JBQUksU0FBUyxLQUFLLEdBQUwsQ0FBUyxLQUFULEVBQWdCLFFBQWhCLENBQWI7QUFDQSxnQkFBSyxNQUFMLEVBQWMsS0FBSyxPQUFMLENBQWEsTUFBYjtBQUNkLGlCQUFLLFNBQUwsQ0FBZSxLQUFmLEVBQXNCLFNBQVMsQ0FBVCxJQUFjLFNBQXBDO0FBQ0g7QUFDSixLOzswQkFFRCxLLGtCQUFNLEksRUFBTSxLLEVBQU87QUFDZixZQUFJLFVBQVUsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFlLFNBQWYsRUFBMEIsWUFBMUIsQ0FBZDtBQUNBLGFBQUssT0FBTCxDQUFhLFFBQVEsT0FBUixHQUFrQixHQUEvQixFQUFvQyxJQUFwQyxFQUEwQyxPQUExQzs7QUFFQSxZQUFJLGNBQUo7QUFDQSxZQUFLLEtBQUssS0FBTCxJQUFjLEtBQUssS0FBTCxDQUFXLE1BQTlCLEVBQXVDO0FBQ25DLGlCQUFLLElBQUwsQ0FBVSxJQUFWO0FBQ0Esb0JBQVEsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFlLE9BQWYsQ0FBUjtBQUNILFNBSEQsTUFHTztBQUNILG9CQUFRLEtBQUssR0FBTCxDQUFTLElBQVQsRUFBZSxPQUFmLEVBQXdCLFdBQXhCLENBQVI7QUFDSDs7QUFFRCxZQUFLLEtBQUwsRUFBYSxLQUFLLE9BQUwsQ0FBYSxLQUFiO0FBQ2IsYUFBSyxPQUFMLENBQWEsR0FBYixFQUFrQixJQUFsQixFQUF3QixLQUF4QjtBQUNILEs7OzBCQUVELEcsZ0JBQUksSSxFQUFNLEcsRUFBSyxNLEVBQVE7QUFDbkIsWUFBSSxjQUFKO0FBQ0EsWUFBSyxDQUFDLE1BQU4sRUFBZSxTQUFTLEdBQVQ7O0FBRWY7QUFDQSxZQUFLLEdBQUwsRUFBVztBQUNQLG9CQUFRLEtBQUssSUFBTCxDQUFVLEdBQVYsQ0FBUjtBQUNBLGdCQUFLLE9BQU8sS0FBUCxLQUFpQixXQUF0QixFQUFvQyxPQUFPLEtBQVA7QUFDdkM7O0FBRUQsWUFBSSxTQUFTLEtBQUssTUFBbEI7O0FBRUE7QUFDQSxZQUFLLFdBQVcsUUFBaEIsRUFBMkI7QUFDdkIsZ0JBQUssQ0FBQyxNQUFELElBQVcsT0FBTyxJQUFQLEtBQWdCLE1BQWhCLElBQTBCLE9BQU8sS0FBUCxLQUFpQixJQUEzRCxFQUFrRTtBQUM5RCx1QkFBTyxFQUFQO0FBQ0g7QUFDSjs7QUFFRDtBQUNBLFlBQUssQ0FBQyxNQUFOLEVBQWUsT0FBTyxXQUFXLE1BQVgsQ0FBUDs7QUFFZjtBQUNBLFlBQUksT0FBTyxLQUFLLElBQUwsRUFBWDtBQUNBLFlBQUssQ0FBQyxLQUFLLFFBQVgsRUFBc0IsS0FBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ3RCLFlBQUssT0FBTyxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQVAsS0FBaUMsV0FBdEMsRUFBb0Q7QUFDaEQsbUJBQU8sS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFQO0FBQ0g7O0FBRUQsWUFBSyxXQUFXLFFBQVgsSUFBdUIsV0FBVyxPQUF2QyxFQUFpRDtBQUM3QyxtQkFBTyxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsRUFBdUIsTUFBdkIsQ0FBUDtBQUNILFNBRkQsTUFFTztBQUNILGdCQUFJLFNBQVMsUUFBUSxXQUFXLE1BQVgsQ0FBckI7QUFDQSxnQkFBSyxLQUFLLE1BQUwsQ0FBTCxFQUFvQjtBQUNoQix3QkFBUSxLQUFLLE1BQUwsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQVI7QUFDSCxhQUZELE1BRU87QUFDSCxxQkFBSyxJQUFMLENBQVcsYUFBSztBQUNaLDRCQUFRLEVBQUUsSUFBRixDQUFPLEdBQVAsQ0FBUjtBQUNBLHdCQUFLLE9BQU8sS0FBUCxLQUFpQixXQUF0QixFQUFvQyxPQUFPLEtBQVA7QUFDdkMsaUJBSEQ7QUFJSDtBQUNKOztBQUVELFlBQUssT0FBTyxLQUFQLEtBQWlCLFdBQXRCLEVBQW9DLFFBQVEsV0FBVyxNQUFYLENBQVI7O0FBRXBDLGFBQUssUUFBTCxDQUFjLE1BQWQsSUFBd0IsS0FBeEI7QUFDQSxlQUFPLEtBQVA7QUFDSCxLOzswQkFFRCxZLHlCQUFhLEksRUFBTTtBQUNmLFlBQUksY0FBSjtBQUNBLGFBQUssSUFBTCxDQUFXLGFBQUs7QUFDWixnQkFBSyxFQUFFLEtBQUYsSUFBVyxFQUFFLEtBQUYsQ0FBUSxNQUFuQixJQUE2QixFQUFFLElBQUYsQ0FBTyxJQUFQLEtBQWdCLE1BQWxELEVBQTJEO0FBQ3ZELHdCQUFRLEVBQUUsSUFBRixDQUFPLFNBQWY7QUFDQSxvQkFBSyxPQUFPLEtBQVAsS0FBaUIsV0FBdEIsRUFBb0MsT0FBTyxLQUFQO0FBQ3ZDO0FBQ0osU0FMRDtBQU1BLGVBQU8sS0FBUDtBQUNILEs7OzBCQUVELFkseUJBQWEsSSxFQUFNO0FBQ2YsWUFBSSxjQUFKO0FBQ0EsYUFBSyxJQUFMLENBQVcsYUFBSztBQUNaLGdCQUFLLEVBQUUsS0FBRixJQUFXLEVBQUUsS0FBRixDQUFRLE1BQVIsS0FBbUIsQ0FBbkMsRUFBdUM7QUFDbkMsd0JBQVEsRUFBRSxJQUFGLENBQU8sS0FBZjtBQUNBLG9CQUFLLE9BQU8sS0FBUCxLQUFpQixXQUF0QixFQUFvQyxPQUFPLEtBQVA7QUFDdkM7QUFDSixTQUxEO0FBTUEsZUFBTyxLQUFQO0FBQ0gsSzs7MEJBRUQsUyxzQkFBVSxJLEVBQU07QUFDWixZQUFLLEtBQUssSUFBTCxDQUFVLE1BQWYsRUFBd0IsT0FBTyxLQUFLLElBQUwsQ0FBVSxNQUFqQjtBQUN4QixZQUFJLGNBQUo7QUFDQSxhQUFLLElBQUwsQ0FBVyxhQUFLO0FBQ1osZ0JBQUksSUFBSSxFQUFFLE1BQVY7QUFDQSxnQkFBSyxLQUFLLE1BQU0sSUFBWCxJQUFtQixFQUFFLE1BQXJCLElBQStCLEVBQUUsTUFBRixLQUFhLElBQWpELEVBQXdEO0FBQ3BELG9CQUFLLE9BQU8sRUFBRSxJQUFGLENBQU8sTUFBZCxLQUF5QixXQUE5QixFQUE0QztBQUN4Qyx3QkFBSSxRQUFRLEVBQUUsSUFBRixDQUFPLE1BQVAsQ0FBYyxLQUFkLENBQW9CLElBQXBCLENBQVo7QUFDQSw0QkFBUSxNQUFNLE1BQU0sTUFBTixHQUFlLENBQXJCLENBQVI7QUFDQSw0QkFBUSxNQUFNLE9BQU4sQ0FBYyxRQUFkLEVBQXdCLEVBQXhCLENBQVI7QUFDQSwyQkFBTyxLQUFQO0FBQ0g7QUFDSjtBQUNKLFNBVkQ7QUFXQSxlQUFPLEtBQVA7QUFDSCxLOzswQkFFRCxnQiw2QkFBaUIsSSxFQUFNLEksRUFBTTtBQUN6QixZQUFJLGNBQUo7QUFDQSxhQUFLLFlBQUwsQ0FBbUIsYUFBSztBQUNwQixnQkFBSyxPQUFPLEVBQUUsSUFBRixDQUFPLE1BQWQsS0FBeUIsV0FBOUIsRUFBNEM7QUFDeEMsd0JBQVEsRUFBRSxJQUFGLENBQU8sTUFBZjtBQUNBLG9CQUFLLE1BQU0sT0FBTixDQUFjLElBQWQsTUFBd0IsQ0FBQyxDQUE5QixFQUFrQztBQUM5Qiw0QkFBUSxNQUFNLE9BQU4sQ0FBYyxTQUFkLEVBQXlCLEVBQXpCLENBQVI7QUFDSDtBQUNELHVCQUFPLEtBQVA7QUFDSDtBQUNKLFNBUkQ7QUFTQSxZQUFLLE9BQU8sS0FBUCxLQUFpQixXQUF0QixFQUFvQztBQUNoQyxvQkFBUSxLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWUsSUFBZixFQUFxQixZQUFyQixDQUFSO0FBQ0g7QUFDRCxlQUFPLEtBQVA7QUFDSCxLOzswQkFFRCxhLDBCQUFjLEksRUFBTSxJLEVBQU07QUFDdEIsWUFBSSxjQUFKO0FBQ0EsYUFBSyxTQUFMLENBQWdCLGFBQUs7QUFDakIsZ0JBQUssT0FBTyxFQUFFLElBQUYsQ0FBTyxNQUFkLEtBQXlCLFdBQTlCLEVBQTRDO0FBQ3hDLHdCQUFRLEVBQUUsSUFBRixDQUFPLE1BQWY7QUFDQSxvQkFBSyxNQUFNLE9BQU4sQ0FBYyxJQUFkLE1BQXdCLENBQUMsQ0FBOUIsRUFBa0M7QUFDOUIsNEJBQVEsTUFBTSxPQUFOLENBQWMsU0FBZCxFQUF5QixFQUF6QixDQUFSO0FBQ0g7QUFDRCx1QkFBTyxLQUFQO0FBQ0g7QUFDSixTQVJEO0FBU0EsWUFBSyxPQUFPLEtBQVAsS0FBaUIsV0FBdEIsRUFBb0M7QUFDaEMsb0JBQVEsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUIsWUFBckIsQ0FBUjtBQUNIO0FBQ0QsZUFBTyxLQUFQO0FBQ0gsSzs7MEJBRUQsYSwwQkFBYyxJLEVBQU07QUFDaEIsWUFBSSxjQUFKO0FBQ0EsYUFBSyxJQUFMLENBQVcsYUFBSztBQUNaLGdCQUFLLEVBQUUsS0FBRixLQUFZLEVBQUUsTUFBRixLQUFhLElBQWIsSUFBcUIsS0FBSyxLQUFMLEtBQWUsQ0FBaEQsQ0FBTCxFQUEwRDtBQUN0RCxvQkFBSyxPQUFPLEVBQUUsSUFBRixDQUFPLE1BQWQsS0FBeUIsV0FBOUIsRUFBNEM7QUFDeEMsNEJBQVEsRUFBRSxJQUFGLENBQU8sTUFBZjtBQUNBLHdCQUFLLE1BQU0sT0FBTixDQUFjLElBQWQsTUFBd0IsQ0FBQyxDQUE5QixFQUFrQztBQUM5QixnQ0FBUSxNQUFNLE9BQU4sQ0FBYyxTQUFkLEVBQXlCLEVBQXpCLENBQVI7QUFDSDtBQUNELDJCQUFPLEtBQVA7QUFDSDtBQUNKO0FBQ0osU0FWRDtBQVdBLGVBQU8sS0FBUDtBQUNILEs7OzBCQUVELGMsMkJBQWUsSSxFQUFNO0FBQ2pCLFlBQUksY0FBSjtBQUNBLGFBQUssSUFBTCxDQUFXLGFBQUs7QUFDWixnQkFBSyxFQUFFLEtBQUYsSUFBVyxFQUFFLEtBQUYsQ0FBUSxNQUFSLEdBQWlCLENBQWpDLEVBQXFDO0FBQ2pDLG9CQUFLLE9BQU8sRUFBRSxJQUFGLENBQU8sS0FBZCxLQUF3QixXQUE3QixFQUEyQztBQUN2Qyw0QkFBUSxFQUFFLElBQUYsQ0FBTyxLQUFmO0FBQ0Esd0JBQUssTUFBTSxPQUFOLENBQWMsSUFBZCxNQUF3QixDQUFDLENBQTlCLEVBQWtDO0FBQzlCLGdDQUFRLE1BQU0sT0FBTixDQUFjLFNBQWQsRUFBeUIsRUFBekIsQ0FBUjtBQUNIO0FBQ0QsMkJBQU8sS0FBUDtBQUNIO0FBQ0o7QUFDSixTQVZEO0FBV0EsZUFBTyxLQUFQO0FBQ0gsSzs7MEJBRUQsYSwwQkFBYyxJLEVBQU07QUFDaEIsWUFBSSxjQUFKO0FBQ0EsYUFBSyxJQUFMLENBQVcsYUFBSztBQUNaLGdCQUFLLEVBQUUsSUFBRixLQUFXLE1BQWhCLEVBQXlCO0FBQ3JCLHdCQUFRLEVBQUUsSUFBRixDQUFPLE9BQWY7QUFDQSxvQkFBSyxPQUFPLEtBQVAsS0FBaUIsV0FBdEIsRUFBb0MsT0FBTyxLQUFQO0FBQ3ZDO0FBQ0osU0FMRDtBQU1BLGVBQU8sS0FBUDtBQUNILEs7OzBCQUVELFEscUJBQVMsSSxFQUFNO0FBQ1gsWUFBSSxjQUFKO0FBQ0EsYUFBSyxTQUFMLENBQWdCLGFBQUs7QUFDakIsZ0JBQUssT0FBTyxFQUFFLElBQUYsQ0FBTyxPQUFkLEtBQTBCLFdBQS9CLEVBQTZDO0FBQ3pDLHdCQUFRLEVBQUUsSUFBRixDQUFPLE9BQVAsQ0FBZSxPQUFmLENBQXVCLFNBQXZCLEVBQWtDLEVBQWxDLENBQVI7QUFDQSx1QkFBTyxLQUFQO0FBQ0g7QUFDSixTQUxEO0FBTUEsZUFBTyxLQUFQO0FBQ0gsSzs7MEJBRUQsVyx3QkFBWSxJLEVBQU0sTSxFQUFRO0FBQ3RCLFlBQUksY0FBSjtBQUNBLFlBQUssS0FBSyxJQUFMLEtBQWMsTUFBbkIsRUFBNEI7QUFDeEIsb0JBQVEsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUIsWUFBckIsQ0FBUjtBQUNILFNBRkQsTUFFTyxJQUFLLEtBQUssSUFBTCxLQUFjLFNBQW5CLEVBQStCO0FBQ2xDLG9CQUFRLEtBQUssR0FBTCxDQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCLGVBQXJCLENBQVI7QUFDSCxTQUZNLE1BRUEsSUFBSyxXQUFXLFFBQWhCLEVBQTJCO0FBQzlCLG9CQUFRLEtBQUssR0FBTCxDQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCLFlBQXJCLENBQVI7QUFDSCxTQUZNLE1BRUE7QUFDSCxvQkFBUSxLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWUsSUFBZixFQUFxQixhQUFyQixDQUFSO0FBQ0g7O0FBRUQsWUFBSSxNQUFRLEtBQUssTUFBakI7QUFDQSxZQUFJLFFBQVEsQ0FBWjtBQUNBLGVBQVEsT0FBTyxJQUFJLElBQUosS0FBYSxNQUE1QixFQUFxQztBQUNqQyxxQkFBUyxDQUFUO0FBQ0Esa0JBQU0sSUFBSSxNQUFWO0FBQ0g7O0FBRUQsWUFBSyxNQUFNLE9BQU4sQ0FBYyxJQUFkLE1BQXdCLENBQUMsQ0FBOUIsRUFBa0M7QUFDOUIsZ0JBQUksU0FBUyxLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWUsSUFBZixFQUFxQixRQUFyQixDQUFiO0FBQ0EsZ0JBQUssT0FBTyxNQUFaLEVBQXFCO0FBQ2pCLHFCQUFNLElBQUksT0FBTyxDQUFqQixFQUFvQixPQUFPLEtBQTNCLEVBQWtDLE1BQWxDO0FBQTJDLDZCQUFTLE1BQVQ7QUFBM0M7QUFDSDtBQUNKOztBQUVELGVBQU8sS0FBUDtBQUNILEs7OzBCQUVELFEscUJBQVMsSSxFQUFNLEksRUFBTTtBQUNqQixZQUFJLFFBQVEsS0FBSyxJQUFMLENBQVo7QUFDQSxZQUFJLE1BQVEsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFaO0FBQ0EsWUFBSyxPQUFPLElBQUksS0FBSixLQUFjLEtBQTFCLEVBQWtDO0FBQzlCLG1CQUFPLElBQUksR0FBWDtBQUNILFNBRkQsTUFFTztBQUNILG1CQUFPLEtBQVA7QUFDSDtBQUNKLEs7Ozs7O2tCQUlVLFciLCJmaWxlIjoic3RyaW5naWZpZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xuXG5jb25zdCBkZWZhdWx0UmF3ID0ge1xuICAgIGNvbG9uOiAgICAgICAgICc6ICcsXG4gICAgaW5kZW50OiAgICAgICAgJyAgICAnLFxuICAgIGJlZm9yZURlY2w6ICAgICdcXG4nLFxuICAgIGJlZm9yZVJ1bGU6ICAgICdcXG4nLFxuICAgIGJlZm9yZU9wZW46ICAgICcgJyxcbiAgICBiZWZvcmVDbG9zZTogICAnXFxuJyxcbiAgICBiZWZvcmVDb21tZW50OiAnXFxuJyxcbiAgICBhZnRlcjogICAgICAgICAnXFxuJyxcbiAgICBlbXB0eUJvZHk6ICAgICAnJyxcbiAgICBjb21tZW50TGVmdDogICAnICcsXG4gICAgY29tbWVudFJpZ2h0OiAgJyAnXG59O1xuXG5mdW5jdGlvbiBjYXBpdGFsaXplKHN0cikge1xuICAgIHJldHVybiBzdHJbMF0udG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbn1cblxuY2xhc3MgU3RyaW5naWZpZXIge1xuXG4gICAgY29uc3RydWN0b3IoYnVpbGRlcikge1xuICAgICAgICB0aGlzLmJ1aWxkZXIgPSBidWlsZGVyO1xuICAgIH1cblxuICAgIHN0cmluZ2lmeShub2RlLCBzZW1pY29sb24pIHtcbiAgICAgICAgdGhpc1tub2RlLnR5cGVdKG5vZGUsIHNlbWljb2xvbik7XG4gICAgfVxuXG4gICAgcm9vdChub2RlKSB7XG4gICAgICAgIHRoaXMuYm9keShub2RlKTtcbiAgICAgICAgaWYgKCBub2RlLnJhd3MuYWZ0ZXIgKSB0aGlzLmJ1aWxkZXIobm9kZS5yYXdzLmFmdGVyKTtcbiAgICB9XG5cbiAgICBjb21tZW50KG5vZGUpIHtcbiAgICAgICAgbGV0IGxlZnQgID0gdGhpcy5yYXcobm9kZSwgJ2xlZnQnLCAgJ2NvbW1lbnRMZWZ0Jyk7XG4gICAgICAgIGxldCByaWdodCA9IHRoaXMucmF3KG5vZGUsICdyaWdodCcsICdjb21tZW50UmlnaHQnKTtcbiAgICAgICAgdGhpcy5idWlsZGVyKCcvKicgKyBsZWZ0ICsgbm9kZS50ZXh0ICsgcmlnaHQgKyAnKi8nLCBub2RlKTtcbiAgICB9XG5cbiAgICBkZWNsKG5vZGUsIHNlbWljb2xvbikge1xuICAgICAgICBsZXQgYmV0d2VlbiA9IHRoaXMucmF3KG5vZGUsICdiZXR3ZWVuJywgJ2NvbG9uJyk7XG4gICAgICAgIGxldCBzdHJpbmcgID0gbm9kZS5wcm9wICsgYmV0d2VlbiArIHRoaXMucmF3VmFsdWUobm9kZSwgJ3ZhbHVlJyk7XG5cbiAgICAgICAgaWYgKCBub2RlLmltcG9ydGFudCApIHtcbiAgICAgICAgICAgIHN0cmluZyArPSBub2RlLnJhd3MuaW1wb3J0YW50IHx8ICcgIWltcG9ydGFudCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHNlbWljb2xvbiApIHN0cmluZyArPSAnOyc7XG4gICAgICAgIHRoaXMuYnVpbGRlcihzdHJpbmcsIG5vZGUpO1xuICAgIH1cblxuICAgIHJ1bGUobm9kZSkge1xuICAgICAgICB0aGlzLmJsb2NrKG5vZGUsIHRoaXMucmF3VmFsdWUobm9kZSwgJ3NlbGVjdG9yJykpO1xuICAgIH1cblxuICAgIGF0cnVsZShub2RlLCBzZW1pY29sb24pIHtcbiAgICAgICAgbGV0IG5hbWUgICA9ICdAJyArIG5vZGUubmFtZTtcbiAgICAgICAgbGV0IHBhcmFtcyA9IG5vZGUucGFyYW1zID8gdGhpcy5yYXdWYWx1ZShub2RlLCAncGFyYW1zJykgOiAnJztcblxuICAgICAgICBpZiAoIHR5cGVvZiBub2RlLnJhd3MuYWZ0ZXJOYW1lICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIG5hbWUgKz0gbm9kZS5yYXdzLmFmdGVyTmFtZTtcbiAgICAgICAgfSBlbHNlIGlmICggcGFyYW1zICkge1xuICAgICAgICAgICAgbmFtZSArPSAnICc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIG5vZGUubm9kZXMgKSB7XG4gICAgICAgICAgICB0aGlzLmJsb2NrKG5vZGUsIG5hbWUgKyBwYXJhbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGVuZCA9IChub2RlLnJhd3MuYmV0d2VlbiB8fCAnJykgKyAoc2VtaWNvbG9uID8gJzsnIDogJycpO1xuICAgICAgICAgICAgdGhpcy5idWlsZGVyKG5hbWUgKyBwYXJhbXMgKyBlbmQsIG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYm9keShub2RlKSB7XG4gICAgICAgIGxldCBsYXN0ID0gbm9kZS5ub2Rlcy5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAoIGxhc3QgPiAwICkge1xuICAgICAgICAgICAgaWYgKCBub2RlLm5vZGVzW2xhc3RdLnR5cGUgIT09ICdjb21tZW50JyApIGJyZWFrO1xuICAgICAgICAgICAgbGFzdCAtPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlbWljb2xvbiA9IHRoaXMucmF3KG5vZGUsICdzZW1pY29sb24nKTtcbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgbm9kZS5ub2Rlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCAgPSBub2RlLm5vZGVzW2ldO1xuICAgICAgICAgICAgbGV0IGJlZm9yZSA9IHRoaXMucmF3KGNoaWxkLCAnYmVmb3JlJyk7XG4gICAgICAgICAgICBpZiAoIGJlZm9yZSApIHRoaXMuYnVpbGRlcihiZWZvcmUpO1xuICAgICAgICAgICAgdGhpcy5zdHJpbmdpZnkoY2hpbGQsIGxhc3QgIT09IGkgfHwgc2VtaWNvbG9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJsb2NrKG5vZGUsIHN0YXJ0KSB7XG4gICAgICAgIGxldCBiZXR3ZWVuID0gdGhpcy5yYXcobm9kZSwgJ2JldHdlZW4nLCAnYmVmb3JlT3BlbicpO1xuICAgICAgICB0aGlzLmJ1aWxkZXIoc3RhcnQgKyBiZXR3ZWVuICsgJ3snLCBub2RlLCAnc3RhcnQnKTtcblxuICAgICAgICBsZXQgYWZ0ZXI7XG4gICAgICAgIGlmICggbm9kZS5ub2RlcyAmJiBub2RlLm5vZGVzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHRoaXMuYm9keShub2RlKTtcbiAgICAgICAgICAgIGFmdGVyID0gdGhpcy5yYXcobm9kZSwgJ2FmdGVyJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhZnRlciA9IHRoaXMucmF3KG5vZGUsICdhZnRlcicsICdlbXB0eUJvZHknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggYWZ0ZXIgKSB0aGlzLmJ1aWxkZXIoYWZ0ZXIpO1xuICAgICAgICB0aGlzLmJ1aWxkZXIoJ30nLCBub2RlLCAnZW5kJyk7XG4gICAgfVxuXG4gICAgcmF3KG5vZGUsIG93biwgZGV0ZWN0KSB7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgaWYgKCAhZGV0ZWN0ICkgZGV0ZWN0ID0gb3duO1xuXG4gICAgICAgIC8vIEFscmVhZHkgaGFkXG4gICAgICAgIGlmICggb3duICkge1xuICAgICAgICAgICAgdmFsdWUgPSBub2RlLnJhd3Nbb3duXTtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyApIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYXJlbnQgPSBub2RlLnBhcmVudDtcblxuICAgICAgICAvLyBIYWNrIGZvciBmaXJzdCBydWxlIGluIENTU1xuICAgICAgICBpZiAoIGRldGVjdCA9PT0gJ2JlZm9yZScgKSB7XG4gICAgICAgICAgICBpZiAoICFwYXJlbnQgfHwgcGFyZW50LnR5cGUgPT09ICdyb290JyAmJiBwYXJlbnQuZmlyc3QgPT09IG5vZGUgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmxvYXRpbmcgY2hpbGQgd2l0aG91dCBwYXJlbnRcbiAgICAgICAgaWYgKCAhcGFyZW50ICkgcmV0dXJuIGRlZmF1bHRSYXdbZGV0ZWN0XTtcblxuICAgICAgICAvLyBEZXRlY3Qgc3R5bGUgYnkgb3RoZXIgbm9kZXNcbiAgICAgICAgbGV0IHJvb3QgPSBub2RlLnJvb3QoKTtcbiAgICAgICAgaWYgKCAhcm9vdC5yYXdDYWNoZSApIHJvb3QucmF3Q2FjaGUgPSB7IH07XG4gICAgICAgIGlmICggdHlwZW9mIHJvb3QucmF3Q2FjaGVbZGV0ZWN0XSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdC5yYXdDYWNoZVtkZXRlY3RdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBkZXRlY3QgPT09ICdiZWZvcmUnIHx8IGRldGVjdCA9PT0gJ2FmdGVyJyApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJlZm9yZUFmdGVyKG5vZGUsIGRldGVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbWV0aG9kID0gJ3JhdycgKyBjYXBpdGFsaXplKGRldGVjdCk7XG4gICAgICAgICAgICBpZiAoIHRoaXNbbWV0aG9kXSApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXNbbWV0aG9kXShyb290LCBub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm9vdC53YWxrKCBpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBpLnJhd3Nbb3duXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkgdmFsdWUgPSBkZWZhdWx0UmF3W2RldGVjdF07XG5cbiAgICAgICAgcm9vdC5yYXdDYWNoZVtkZXRlY3RdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByYXdTZW1pY29sb24ocm9vdCkge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIHJvb3Qud2FsayggaSA9PiB7XG4gICAgICAgICAgICBpZiAoIGkubm9kZXMgJiYgaS5ub2Rlcy5sZW5ndGggJiYgaS5sYXN0LnR5cGUgPT09ICdkZWNsJyApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGkucmF3cy5zZW1pY29sb247XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJhd0VtcHR5Qm9keShyb290KSB7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgcm9vdC53YWxrKCBpID0+IHtcbiAgICAgICAgICAgIGlmICggaS5ub2RlcyAmJiBpLm5vZGVzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGkucmF3cy5hZnRlcjtcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmF3SW5kZW50KHJvb3QpIHtcbiAgICAgICAgaWYgKCByb290LnJhd3MuaW5kZW50ICkgcmV0dXJuIHJvb3QucmF3cy5pbmRlbnQ7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgcm9vdC53YWxrKCBpID0+IHtcbiAgICAgICAgICAgIGxldCBwID0gaS5wYXJlbnQ7XG4gICAgICAgICAgICBpZiAoIHAgJiYgcCAhPT0gcm9vdCAmJiBwLnBhcmVudCAmJiBwLnBhcmVudCA9PT0gcm9vdCApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBpLnJhd3MuYmVmb3JlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnRzID0gaS5yYXdzLmJlZm9yZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvW15cXHNdL2csICcnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByYXdCZWZvcmVDb21tZW50KHJvb3QsIG5vZGUpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICByb290LndhbGtDb21tZW50cyggaSA9PiB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBpLnJhd3MuYmVmb3JlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGkucmF3cy5iZWZvcmU7XG4gICAgICAgICAgICAgICAgaWYgKCB2YWx1ZS5pbmRleE9mKCdcXG4nKSAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvW15cXG5dKyQvLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yYXcobm9kZSwgbnVsbCwgJ2JlZm9yZURlY2wnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmF3QmVmb3JlRGVjbChyb290LCBub2RlKSB7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgcm9vdC53YWxrRGVjbHMoIGkgPT4ge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2YgaS5yYXdzLmJlZm9yZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBpLnJhd3MuYmVmb3JlO1xuICAgICAgICAgICAgICAgIGlmICggdmFsdWUuaW5kZXhPZignXFxuJykgIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1teXFxuXSskLywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMucmF3KG5vZGUsIG51bGwsICdiZWZvcmVSdWxlJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJhd0JlZm9yZVJ1bGUocm9vdCkge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIHJvb3Qud2FsayggaSA9PiB7XG4gICAgICAgICAgICBpZiAoIGkubm9kZXMgJiYgKGkucGFyZW50ICE9PSByb290IHx8IHJvb3QuZmlyc3QgIT09IGkpICkge1xuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIGkucmF3cy5iZWZvcmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGkucmF3cy5iZWZvcmU7XG4gICAgICAgICAgICAgICAgICAgIGlmICggdmFsdWUuaW5kZXhPZignXFxuJykgIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9bXlxcbl0rJC8sICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJhd0JlZm9yZUNsb3NlKHJvb3QpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICByb290LndhbGsoIGkgPT4ge1xuICAgICAgICAgICAgaWYgKCBpLm5vZGVzICYmIGkubm9kZXMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBpLnJhd3MuYWZ0ZXIgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGkucmF3cy5hZnRlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB2YWx1ZS5pbmRleE9mKCdcXG4nKSAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1teXFxuXSskLywgJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmF3QmVmb3JlT3Blbihyb290KSB7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgcm9vdC53YWxrKCBpID0+IHtcbiAgICAgICAgICAgIGlmICggaS50eXBlICE9PSAnZGVjbCcgKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBpLnJhd3MuYmV0d2VlbjtcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmF3Q29sb24ocm9vdCkge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIHJvb3Qud2Fsa0RlY2xzKCBpID0+IHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIGkucmF3cy5iZXR3ZWVuICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGkucmF3cy5iZXR3ZWVuLnJlcGxhY2UoL1teXFxzOl0vZywgJycpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBiZWZvcmVBZnRlcihub2RlLCBkZXRlY3QpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICBpZiAoIG5vZGUudHlwZSA9PT0gJ2RlY2wnICkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnJhdyhub2RlLCBudWxsLCAnYmVmb3JlRGVjbCcpO1xuICAgICAgICB9IGVsc2UgaWYgKCBub2RlLnR5cGUgPT09ICdjb21tZW50JyApIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yYXcobm9kZSwgbnVsbCwgJ2JlZm9yZUNvbW1lbnQnKTtcbiAgICAgICAgfSBlbHNlIGlmICggZGV0ZWN0ID09PSAnYmVmb3JlJyApIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yYXcobm9kZSwgbnVsbCwgJ2JlZm9yZVJ1bGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yYXcobm9kZSwgbnVsbCwgJ2JlZm9yZUNsb3NlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYnVmICAgPSBub2RlLnBhcmVudDtcbiAgICAgICAgbGV0IGRlcHRoID0gMDtcbiAgICAgICAgd2hpbGUgKCBidWYgJiYgYnVmLnR5cGUgIT09ICdyb290JyApIHtcbiAgICAgICAgICAgIGRlcHRoICs9IDE7XG4gICAgICAgICAgICBidWYgPSBidWYucGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCB2YWx1ZS5pbmRleE9mKCdcXG4nKSAhPT0gLTEgKSB7XG4gICAgICAgICAgICBsZXQgaW5kZW50ID0gdGhpcy5yYXcobm9kZSwgbnVsbCwgJ2luZGVudCcpO1xuICAgICAgICAgICAgaWYgKCBpbmRlbnQubGVuZ3RoICkge1xuICAgICAgICAgICAgICAgIGZvciAoIGxldCBzdGVwID0gMDsgc3RlcCA8IGRlcHRoOyBzdGVwKysgKSB2YWx1ZSArPSBpbmRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmF3VmFsdWUobm9kZSwgcHJvcCkge1xuICAgICAgICBsZXQgdmFsdWUgPSBub2RlW3Byb3BdO1xuICAgICAgICBsZXQgcmF3ICAgPSBub2RlLnJhd3NbcHJvcF07XG4gICAgICAgIGlmICggcmF3ICYmIHJhdy52YWx1ZSA9PT0gdmFsdWUgKSB7XG4gICAgICAgICAgICByZXR1cm4gcmF3LnJhdztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTdHJpbmdpZmllcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
