'use strict';

exports.__esModule = true;

var _declaration = require('./declaration');

var _declaration2 = _interopRequireDefault(_declaration);

var _tokenize = require('./tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _atRule = require('./at-rule');

var _atRule2 = _interopRequireDefault(_atRule);

var _root = require('./root');

var _root2 = _interopRequireDefault(_root);

var _rule = require('./rule');

var _rule2 = _interopRequireDefault(_rule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function () {
    function Parser(input) {
        _classCallCheck(this, Parser);

        this.input = input;

        this.pos = 0;
        this.root = new _root2.default();
        this.current = this.root;
        this.spaces = '';
        this.semicolon = false;

        this.root.source = { input: input, start: { line: 1, column: 1 } };
    }

    Parser.prototype.tokenize = function tokenize() {
        this.tokens = (0, _tokenize2.default)(this.input);
    };

    Parser.prototype.loop = function loop() {
        var token = void 0;
        while (this.pos < this.tokens.length) {
            token = this.tokens[this.pos];

            switch (token[0]) {
                case 'word':
                case ':':
                    this.word();
                    break;

                case '}':
                    this.end(token);
                    break;

                case 'comment':
                    this.comment(token);
                    break;

                case 'at-word':
                    this.atrule(token);
                    break;

                case '{':
                    this.emptyRule(token);
                    break;

                default:
                    this.spaces += token[1];
                    break;
            }

            this.pos += 1;
        }
        this.endFile();
    };

    Parser.prototype.comment = function comment(token) {
        var node = new _comment2.default();
        this.init(node, token[2], token[3]);
        node.source.end = { line: token[4], column: token[5] };

        var text = token[1].slice(2, -2);
        if (/^\s*$/.test(text)) {
            node.text = '';
            node.raws.left = text;
            node.raws.right = '';
        } else {
            var match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
            node.text = match[2];
            node.raws.left = match[1];
            node.raws.right = match[3];
        }
    };

    Parser.prototype.emptyRule = function emptyRule(token) {
        var node = new _rule2.default();
        this.init(node, token[2], token[3]);
        node.selector = '';
        node.raws.between = '';
        this.current = node;
    };

    Parser.prototype.word = function word() {
        var token = void 0;
        var end = false;
        var type = null;
        var colon = false;
        var bracket = null;
        var brackets = 0;

        var start = this.pos;
        this.pos += 1;
        while (this.pos < this.tokens.length) {
            token = this.tokens[this.pos];
            type = token[0];

            if (type === '(') {
                if (!bracket) bracket = token;
                brackets += 1;
            } else if (brackets === 0) {
                if (type === ';') {
                    if (colon) {
                        this.decl(this.tokens.slice(start, this.pos + 1));
                        return;
                    } else {
                        break;
                    }
                } else if (type === '{') {
                    this.rule(this.tokens.slice(start, this.pos + 1));
                    return;
                } else if (type === '}') {
                    this.pos -= 1;
                    end = true;
                    break;
                } else if (type === ':') {
                    colon = true;
                }
            } else if (type === ')') {
                brackets -= 1;
                if (brackets === 0) bracket = null;
            }

            this.pos += 1;
        }
        if (this.pos === this.tokens.length) {
            this.pos -= 1;
            end = true;
        }

        if (brackets > 0) this.unclosedBracket(bracket);

        if (end && colon) {
            while (this.pos > start) {
                token = this.tokens[this.pos][0];
                if (token !== 'space' && token !== 'comment') break;
                this.pos -= 1;
            }
            this.decl(this.tokens.slice(start, this.pos + 1));
            return;
        }

        this.unknownWord(start);
    };

    Parser.prototype.rule = function rule(tokens) {
        tokens.pop();

        var node = new _rule2.default();
        this.init(node, tokens[0][2], tokens[0][3]);

        node.raws.between = this.spacesFromEnd(tokens);
        this.raw(node, 'selector', tokens);
        this.current = node;
    };

    Parser.prototype.decl = function decl(tokens) {
        var node = new _declaration2.default();
        this.init(node);

        var last = tokens[tokens.length - 1];
        if (last[0] === ';') {
            this.semicolon = true;
            tokens.pop();
        }
        if (last[4]) {
            node.source.end = { line: last[4], column: last[5] };
        } else {
            node.source.end = { line: last[2], column: last[3] };
        }

        while (tokens[0][0] !== 'word') {
            node.raws.before += tokens.shift()[1];
        }
        node.source.start = { line: tokens[0][2], column: tokens[0][3] };

        node.prop = '';
        while (tokens.length) {
            var type = tokens[0][0];
            if (type === ':' || type === 'space' || type === 'comment') {
                break;
            }
            node.prop += tokens.shift()[1];
        }

        node.raws.between = '';

        var token = void 0;
        while (tokens.length) {
            token = tokens.shift();

            if (token[0] === ':') {
                node.raws.between += token[1];
                break;
            } else {
                node.raws.between += token[1];
            }
        }

        if (node.prop[0] === '_' || node.prop[0] === '*') {
            node.raws.before += node.prop[0];
            node.prop = node.prop.slice(1);
        }
        node.raws.between += this.spacesFromStart(tokens);
        this.precheckMissedSemicolon(tokens);

        for (var i = tokens.length - 1; i > 0; i--) {
            token = tokens[i];
            if (token[1] === '!important') {
                node.important = true;
                var string = this.stringFrom(tokens, i);
                string = this.spacesFromEnd(tokens) + string;
                if (string !== ' !important') node.raws.important = string;
                break;
            } else if (token[1] === 'important') {
                var cache = tokens.slice(0);
                var str = '';
                for (var j = i; j > 0; j--) {
                    var _type = cache[j][0];
                    if (str.trim().indexOf('!') === 0 && _type !== 'space') {
                        break;
                    }
                    str = cache.pop()[1] + str;
                }
                if (str.trim().indexOf('!') === 0) {
                    node.important = true;
                    node.raws.important = str;
                    tokens = cache;
                }
            }

            if (token[0] !== 'space' && token[0] !== 'comment') {
                break;
            }
        }

        this.raw(node, 'value', tokens);

        if (node.value.indexOf(':') !== -1) this.checkMissedSemicolon(tokens);
    };

    Parser.prototype.atrule = function atrule(token) {
        var node = new _atRule2.default();
        node.name = token[1].slice(1);
        if (node.name === '') {
            this.unnamedAtrule(node, token);
        }
        this.init(node, token[2], token[3]);

        var last = false;
        var open = false;
        var params = [];

        this.pos += 1;
        while (this.pos < this.tokens.length) {
            token = this.tokens[this.pos];

            if (token[0] === ';') {
                node.source.end = { line: token[2], column: token[3] };
                this.semicolon = true;
                break;
            } else if (token[0] === '{') {
                open = true;
                break;
            } else if (token[0] === '}') {
                this.end(token);
                break;
            } else {
                params.push(token);
            }

            this.pos += 1;
        }
        if (this.pos === this.tokens.length) {
            last = true;
        }

        node.raws.between = this.spacesFromEnd(params);
        if (params.length) {
            node.raws.afterName = this.spacesFromStart(params);
            this.raw(node, 'params', params);
            if (last) {
                token = params[params.length - 1];
                node.source.end = { line: token[4], column: token[5] };
                this.spaces = node.raws.between;
                node.raws.between = '';
            }
        } else {
            node.raws.afterName = '';
            node.params = '';
        }

        if (open) {
            node.nodes = [];
            this.current = node;
        }
    };

    Parser.prototype.end = function end(token) {
        if (this.current.nodes && this.current.nodes.length) {
            this.current.raws.semicolon = this.semicolon;
        }
        this.semicolon = false;

        this.current.raws.after = (this.current.raws.after || '') + this.spaces;
        this.spaces = '';

        if (this.current.parent) {
            this.current.source.end = { line: token[2], column: token[3] };
            this.current = this.current.parent;
        } else {
            this.unexpectedClose(token);
        }
    };

    Parser.prototype.endFile = function endFile() {
        if (this.current.parent) this.unclosedBlock();
        if (this.current.nodes && this.current.nodes.length) {
            this.current.raws.semicolon = this.semicolon;
        }
        this.current.raws.after = (this.current.raws.after || '') + this.spaces;
    };

    // Helpers

    Parser.prototype.init = function init(node, line, column) {
        this.current.push(node);

        node.source = { start: { line: line, column: column }, input: this.input };
        node.raws.before = this.spaces;
        this.spaces = '';
        if (node.type !== 'comment') this.semicolon = false;
    };

    Parser.prototype.raw = function raw(node, prop, tokens) {
        var token = void 0,
            type = void 0;
        var length = tokens.length;
        var value = '';
        var clean = true;
        for (var i = 0; i < length; i += 1) {
            token = tokens[i];
            type = token[0];
            if (type === 'comment' || type === 'space' && i === length - 1) {
                clean = false;
            } else {
                value += token[1];
            }
        }
        if (!clean) {
            var raw = tokens.reduce(function (all, i) {
                return all + i[1];
            }, '');
            node.raws[prop] = { value: value, raw: raw };
        }
        node[prop] = value;
    };

    Parser.prototype.spacesFromEnd = function spacesFromEnd(tokens) {
        var lastTokenType = void 0;
        var spaces = '';
        while (tokens.length) {
            lastTokenType = tokens[tokens.length - 1][0];
            if (lastTokenType !== 'space' && lastTokenType !== 'comment') break;
            spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
    };

    Parser.prototype.spacesFromStart = function spacesFromStart(tokens) {
        var next = void 0;
        var spaces = '';
        while (tokens.length) {
            next = tokens[0][0];
            if (next !== 'space' && next !== 'comment') break;
            spaces += tokens.shift()[1];
        }
        return spaces;
    };

    Parser.prototype.stringFrom = function stringFrom(tokens, from) {
        var result = '';
        for (var i = from; i < tokens.length; i++) {
            result += tokens[i][1];
        }
        tokens.splice(from, tokens.length - from);
        return result;
    };

    Parser.prototype.colon = function colon(tokens) {
        var brackets = 0;
        var token = void 0,
            type = void 0,
            prev = void 0;
        for (var i = 0; i < tokens.length; i++) {
            token = tokens[i];
            type = token[0];

            if (type === '(') {
                brackets += 1;
            } else if (type === ')') {
                brackets -= 1;
            } else if (brackets === 0 && type === ':') {
                if (!prev) {
                    this.doubleColon(token);
                } else if (prev[0] === 'word' && prev[1] === 'progid') {
                    continue;
                } else {
                    return i;
                }
            }

            prev = token;
        }
        return false;
    };

    // Errors

    Parser.prototype.unclosedBracket = function unclosedBracket(bracket) {
        throw this.input.error('Unclosed bracket', bracket[2], bracket[3]);
    };

    Parser.prototype.unknownWord = function unknownWord(start) {
        var token = this.tokens[start];
        throw this.input.error('Unknown word', token[2], token[3]);
    };

    Parser.prototype.unexpectedClose = function unexpectedClose(token) {
        throw this.input.error('Unexpected }', token[2], token[3]);
    };

    Parser.prototype.unclosedBlock = function unclosedBlock() {
        var pos = this.current.source.start;
        throw this.input.error('Unclosed block', pos.line, pos.column);
    };

    Parser.prototype.doubleColon = function doubleColon(token) {
        throw this.input.error('Double colon', token[2], token[3]);
    };

    Parser.prototype.unnamedAtrule = function unnamedAtrule(node, token) {
        throw this.input.error('At-rule without name', token[2], token[3]);
    };

    Parser.prototype.precheckMissedSemicolon = function precheckMissedSemicolon(tokens) {
        // Hook for Safe Parser
        tokens;
    };

    Parser.prototype.checkMissedSemicolon = function checkMissedSemicolon(tokens) {
        var colon = this.colon(tokens);
        if (colon === false) return;

        var founded = 0;
        var token = void 0;
        for (var j = colon - 1; j >= 0; j--) {
            token = tokens[j];
            if (token[0] !== 'space') {
                founded += 1;
                if (founded === 2) break;
            }
        }
        throw this.input.error('Missed semicolon', token[2], token[3]);
    };

    return Parser;
}();

exports.default = Parser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7SUFFcUIsTTtBQUVqQixvQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQ2YsYUFBSyxLQUFMLEdBQWEsS0FBYjs7QUFFQSxhQUFLLEdBQUwsR0FBaUIsQ0FBakI7QUFDQSxhQUFLLElBQUwsR0FBaUIsb0JBQWpCO0FBQ0EsYUFBSyxPQUFMLEdBQWlCLEtBQUssSUFBdEI7QUFDQSxhQUFLLE1BQUwsR0FBaUIsRUFBakI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsS0FBakI7O0FBRUEsYUFBSyxJQUFMLENBQVUsTUFBVixHQUFtQixFQUFFLFlBQUYsRUFBUyxPQUFPLEVBQUUsTUFBTSxDQUFSLEVBQVcsUUFBUSxDQUFuQixFQUFoQixFQUFuQjtBQUNIOztxQkFFRCxRLHVCQUFXO0FBQ1AsYUFBSyxNQUFMLEdBQWMsd0JBQVUsS0FBSyxLQUFmLENBQWQ7QUFDSCxLOztxQkFFRCxJLG1CQUFPO0FBQ0gsWUFBSSxjQUFKO0FBQ0EsZUFBUSxLQUFLLEdBQUwsR0FBVyxLQUFLLE1BQUwsQ0FBWSxNQUEvQixFQUF3QztBQUNwQyxvQkFBUSxLQUFLLE1BQUwsQ0FBWSxLQUFLLEdBQWpCLENBQVI7O0FBRUEsb0JBQVMsTUFBTSxDQUFOLENBQVQ7QUFDQSxxQkFBSyxNQUFMO0FBQ0EscUJBQUssR0FBTDtBQUNJLHlCQUFLLElBQUw7QUFDQTs7QUFFSixxQkFBSyxHQUFMO0FBQ0kseUJBQUssR0FBTCxDQUFTLEtBQVQ7QUFDQTs7QUFFSixxQkFBSyxTQUFMO0FBQ0kseUJBQUssT0FBTCxDQUFhLEtBQWI7QUFDQTs7QUFFSixxQkFBSyxTQUFMO0FBQ0kseUJBQUssTUFBTCxDQUFZLEtBQVo7QUFDQTs7QUFFSixxQkFBSyxHQUFMO0FBQ0kseUJBQUssU0FBTCxDQUFlLEtBQWY7QUFDQTs7QUFFSjtBQUNJLHlCQUFLLE1BQUwsSUFBZSxNQUFNLENBQU4sQ0FBZjtBQUNBO0FBeEJKOztBQTJCQSxpQkFBSyxHQUFMLElBQVksQ0FBWjtBQUNIO0FBQ0QsYUFBSyxPQUFMO0FBQ0gsSzs7cUJBRUQsTyxvQkFBUSxLLEVBQU87QUFDWCxZQUFJLE9BQU8sdUJBQVg7QUFDQSxhQUFLLElBQUwsQ0FBVSxJQUFWLEVBQWdCLE1BQU0sQ0FBTixDQUFoQixFQUEwQixNQUFNLENBQU4sQ0FBMUI7QUFDQSxhQUFLLE1BQUwsQ0FBWSxHQUFaLEdBQWtCLEVBQUUsTUFBTSxNQUFNLENBQU4sQ0FBUixFQUFrQixRQUFRLE1BQU0sQ0FBTixDQUExQixFQUFsQjs7QUFFQSxZQUFJLE9BQU8sTUFBTSxDQUFOLEVBQVMsS0FBVCxDQUFlLENBQWYsRUFBa0IsQ0FBQyxDQUFuQixDQUFYO0FBQ0EsWUFBSyxRQUFRLElBQVIsQ0FBYSxJQUFiLENBQUwsRUFBMEI7QUFDdEIsaUJBQUssSUFBTCxHQUFrQixFQUFsQjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxJQUFWLEdBQWtCLElBQWxCO0FBQ0EsaUJBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsRUFBbEI7QUFDSCxTQUpELE1BSU87QUFDSCxnQkFBSSxRQUFRLEtBQUssS0FBTCxDQUFXLHlCQUFYLENBQVo7QUFDQSxpQkFBSyxJQUFMLEdBQWtCLE1BQU0sQ0FBTixDQUFsQjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxJQUFWLEdBQWtCLE1BQU0sQ0FBTixDQUFsQjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLE1BQU0sQ0FBTixDQUFsQjtBQUNIO0FBQ0osSzs7cUJBRUQsUyxzQkFBVSxLLEVBQU87QUFDYixZQUFJLE9BQU8sb0JBQVg7QUFDQSxhQUFLLElBQUwsQ0FBVSxJQUFWLEVBQWdCLE1BQU0sQ0FBTixDQUFoQixFQUEwQixNQUFNLENBQU4sQ0FBMUI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxhQUFLLElBQUwsQ0FBVSxPQUFWLEdBQW9CLEVBQXBCO0FBQ0EsYUFBSyxPQUFMLEdBQWUsSUFBZjtBQUNILEs7O3FCQUVELEksbUJBQU87QUFDSCxZQUFJLGNBQUo7QUFDQSxZQUFJLE1BQVcsS0FBZjtBQUNBLFlBQUksT0FBVyxJQUFmO0FBQ0EsWUFBSSxRQUFXLEtBQWY7QUFDQSxZQUFJLFVBQVcsSUFBZjtBQUNBLFlBQUksV0FBVyxDQUFmOztBQUVBLFlBQUksUUFBUSxLQUFLLEdBQWpCO0FBQ0EsYUFBSyxHQUFMLElBQVksQ0FBWjtBQUNBLGVBQVEsS0FBSyxHQUFMLEdBQVcsS0FBSyxNQUFMLENBQVksTUFBL0IsRUFBd0M7QUFDcEMsb0JBQVEsS0FBSyxNQUFMLENBQVksS0FBSyxHQUFqQixDQUFSO0FBQ0EsbUJBQVEsTUFBTSxDQUFOLENBQVI7O0FBRUEsZ0JBQUssU0FBUyxHQUFkLEVBQW9CO0FBQ2hCLG9CQUFLLENBQUMsT0FBTixFQUFnQixVQUFVLEtBQVY7QUFDaEIsNEJBQVksQ0FBWjtBQUVILGFBSkQsTUFJTyxJQUFLLGFBQWEsQ0FBbEIsRUFBc0I7QUFDekIsb0JBQUssU0FBUyxHQUFkLEVBQW9CO0FBQ2hCLHdCQUFLLEtBQUwsRUFBYTtBQUNULDZCQUFLLElBQUwsQ0FBVSxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLEtBQWxCLEVBQXlCLEtBQUssR0FBTCxHQUFXLENBQXBDLENBQVY7QUFDQTtBQUNILHFCQUhELE1BR087QUFDSDtBQUNIO0FBRUosaUJBUkQsTUFRTyxJQUFLLFNBQVMsR0FBZCxFQUFvQjtBQUN2Qix5QkFBSyxJQUFMLENBQVUsS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixLQUFsQixFQUF5QixLQUFLLEdBQUwsR0FBVyxDQUFwQyxDQUFWO0FBQ0E7QUFFSCxpQkFKTSxNQUlBLElBQUssU0FBUyxHQUFkLEVBQW9CO0FBQ3ZCLHlCQUFLLEdBQUwsSUFBWSxDQUFaO0FBQ0EsMEJBQU0sSUFBTjtBQUNBO0FBRUgsaUJBTE0sTUFLQSxJQUFLLFNBQVMsR0FBZCxFQUFvQjtBQUN2Qiw0QkFBUSxJQUFSO0FBQ0g7QUFFSixhQXRCTSxNQXNCQSxJQUFLLFNBQVMsR0FBZCxFQUFvQjtBQUN2Qiw0QkFBWSxDQUFaO0FBQ0Esb0JBQUssYUFBYSxDQUFsQixFQUFzQixVQUFVLElBQVY7QUFDekI7O0FBRUQsaUJBQUssR0FBTCxJQUFZLENBQVo7QUFDSDtBQUNELFlBQUssS0FBSyxHQUFMLEtBQWEsS0FBSyxNQUFMLENBQVksTUFBOUIsRUFBdUM7QUFDbkMsaUJBQUssR0FBTCxJQUFZLENBQVo7QUFDQSxrQkFBTSxJQUFOO0FBQ0g7O0FBRUQsWUFBSyxXQUFXLENBQWhCLEVBQW9CLEtBQUssZUFBTCxDQUFxQixPQUFyQjs7QUFFcEIsWUFBSyxPQUFPLEtBQVosRUFBb0I7QUFDaEIsbUJBQVEsS0FBSyxHQUFMLEdBQVcsS0FBbkIsRUFBMkI7QUFDdkIsd0JBQVEsS0FBSyxNQUFMLENBQVksS0FBSyxHQUFqQixFQUFzQixDQUF0QixDQUFSO0FBQ0Esb0JBQUssVUFBVSxPQUFWLElBQXFCLFVBQVUsU0FBcEMsRUFBZ0Q7QUFDaEQscUJBQUssR0FBTCxJQUFZLENBQVo7QUFDSDtBQUNELGlCQUFLLElBQUwsQ0FBVSxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLEtBQWxCLEVBQXlCLEtBQUssR0FBTCxHQUFXLENBQXBDLENBQVY7QUFDQTtBQUNIOztBQUVELGFBQUssV0FBTCxDQUFpQixLQUFqQjtBQUNILEs7O3FCQUVELEksaUJBQUssTSxFQUFRO0FBQ1QsZUFBTyxHQUFQOztBQUVBLFlBQUksT0FBTyxvQkFBWDtBQUNBLGFBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFoQixFQUE4QixPQUFPLENBQVAsRUFBVSxDQUFWLENBQTlCOztBQUVBLGFBQUssSUFBTCxDQUFVLE9BQVYsR0FBb0IsS0FBSyxhQUFMLENBQW1CLE1BQW5CLENBQXBCO0FBQ0EsYUFBSyxHQUFMLENBQVMsSUFBVCxFQUFlLFVBQWYsRUFBMkIsTUFBM0I7QUFDQSxhQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0gsSzs7cUJBRUQsSSxpQkFBSyxNLEVBQVE7QUFDVCxZQUFJLE9BQU8sMkJBQVg7QUFDQSxhQUFLLElBQUwsQ0FBVSxJQUFWOztBQUVBLFlBQUksT0FBTyxPQUFPLE9BQU8sTUFBUCxHQUFnQixDQUF2QixDQUFYO0FBQ0EsWUFBSyxLQUFLLENBQUwsTUFBWSxHQUFqQixFQUF1QjtBQUNuQixpQkFBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsbUJBQU8sR0FBUDtBQUNIO0FBQ0QsWUFBSyxLQUFLLENBQUwsQ0FBTCxFQUFlO0FBQ1gsaUJBQUssTUFBTCxDQUFZLEdBQVosR0FBa0IsRUFBRSxNQUFNLEtBQUssQ0FBTCxDQUFSLEVBQWlCLFFBQVEsS0FBSyxDQUFMLENBQXpCLEVBQWxCO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsaUJBQUssTUFBTCxDQUFZLEdBQVosR0FBa0IsRUFBRSxNQUFNLEtBQUssQ0FBTCxDQUFSLEVBQWlCLFFBQVEsS0FBSyxDQUFMLENBQXpCLEVBQWxCO0FBQ0g7O0FBRUQsZUFBUSxPQUFPLENBQVAsRUFBVSxDQUFWLE1BQWlCLE1BQXpCLEVBQWtDO0FBQzlCLGlCQUFLLElBQUwsQ0FBVSxNQUFWLElBQW9CLE9BQU8sS0FBUCxHQUFlLENBQWYsQ0FBcEI7QUFDSDtBQUNELGFBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsRUFBRSxNQUFNLE9BQU8sQ0FBUCxFQUFVLENBQVYsQ0FBUixFQUFzQixRQUFRLE9BQU8sQ0FBUCxFQUFVLENBQVYsQ0FBOUIsRUFBcEI7O0FBRUEsYUFBSyxJQUFMLEdBQVksRUFBWjtBQUNBLGVBQVEsT0FBTyxNQUFmLEVBQXdCO0FBQ3BCLGdCQUFJLE9BQU8sT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFYO0FBQ0EsZ0JBQUssU0FBUyxHQUFULElBQWdCLFNBQVMsT0FBekIsSUFBb0MsU0FBUyxTQUFsRCxFQUE4RDtBQUMxRDtBQUNIO0FBQ0QsaUJBQUssSUFBTCxJQUFhLE9BQU8sS0FBUCxHQUFlLENBQWYsQ0FBYjtBQUNIOztBQUVELGFBQUssSUFBTCxDQUFVLE9BQVYsR0FBb0IsRUFBcEI7O0FBRUEsWUFBSSxjQUFKO0FBQ0EsZUFBUSxPQUFPLE1BQWYsRUFBd0I7QUFDcEIsb0JBQVEsT0FBTyxLQUFQLEVBQVI7O0FBRUEsZ0JBQUssTUFBTSxDQUFOLE1BQWEsR0FBbEIsRUFBd0I7QUFDcEIscUJBQUssSUFBTCxDQUFVLE9BQVYsSUFBcUIsTUFBTSxDQUFOLENBQXJCO0FBQ0E7QUFDSCxhQUhELE1BR087QUFDSCxxQkFBSyxJQUFMLENBQVUsT0FBVixJQUFxQixNQUFNLENBQU4sQ0FBckI7QUFDSDtBQUNKOztBQUVELFlBQUssS0FBSyxJQUFMLENBQVUsQ0FBVixNQUFpQixHQUFqQixJQUF3QixLQUFLLElBQUwsQ0FBVSxDQUFWLE1BQWlCLEdBQTlDLEVBQW9EO0FBQ2hELGlCQUFLLElBQUwsQ0FBVSxNQUFWLElBQW9CLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBcEI7QUFDQSxpQkFBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixDQUFoQixDQUFaO0FBQ0g7QUFDRCxhQUFLLElBQUwsQ0FBVSxPQUFWLElBQXFCLEtBQUssZUFBTCxDQUFxQixNQUFyQixDQUFyQjtBQUNBLGFBQUssdUJBQUwsQ0FBNkIsTUFBN0I7O0FBRUEsYUFBTSxJQUFJLElBQUksT0FBTyxNQUFQLEdBQWdCLENBQTlCLEVBQWlDLElBQUksQ0FBckMsRUFBd0MsR0FBeEMsRUFBOEM7QUFDMUMsb0JBQVEsT0FBTyxDQUFQLENBQVI7QUFDQSxnQkFBSyxNQUFNLENBQU4sTUFBYSxZQUFsQixFQUFpQztBQUM3QixxQkFBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0Esb0JBQUksU0FBUyxLQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsRUFBd0IsQ0FBeEIsQ0FBYjtBQUNBLHlCQUFTLEtBQUssYUFBTCxDQUFtQixNQUFuQixJQUE2QixNQUF0QztBQUNBLG9CQUFLLFdBQVcsYUFBaEIsRUFBZ0MsS0FBSyxJQUFMLENBQVUsU0FBVixHQUFzQixNQUF0QjtBQUNoQztBQUVILGFBUEQsTUFPTyxJQUFJLE1BQU0sQ0FBTixNQUFhLFdBQWpCLEVBQThCO0FBQ2pDLG9CQUFJLFFBQVEsT0FBTyxLQUFQLENBQWEsQ0FBYixDQUFaO0FBQ0Esb0JBQUksTUFBUSxFQUFaO0FBQ0EscUJBQU0sSUFBSSxJQUFJLENBQWQsRUFBaUIsSUFBSSxDQUFyQixFQUF3QixHQUF4QixFQUE4QjtBQUMxQix3QkFBSSxRQUFPLE1BQU0sQ0FBTixFQUFTLENBQVQsQ0FBWDtBQUNBLHdCQUFLLElBQUksSUFBSixHQUFXLE9BQVgsQ0FBbUIsR0FBbkIsTUFBNEIsQ0FBNUIsSUFBaUMsVUFBUyxPQUEvQyxFQUF5RDtBQUNyRDtBQUNIO0FBQ0QsMEJBQU0sTUFBTSxHQUFOLEdBQVksQ0FBWixJQUFpQixHQUF2QjtBQUNIO0FBQ0Qsb0JBQUssSUFBSSxJQUFKLEdBQVcsT0FBWCxDQUFtQixHQUFuQixNQUE0QixDQUFqQyxFQUFxQztBQUNqQyx5QkFBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EseUJBQUssSUFBTCxDQUFVLFNBQVYsR0FBc0IsR0FBdEI7QUFDQSw2QkFBUyxLQUFUO0FBQ0g7QUFDSjs7QUFFRCxnQkFBSyxNQUFNLENBQU4sTUFBYSxPQUFiLElBQXdCLE1BQU0sQ0FBTixNQUFhLFNBQTFDLEVBQXNEO0FBQ2xEO0FBQ0g7QUFDSjs7QUFFRCxhQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWUsT0FBZixFQUF3QixNQUF4Qjs7QUFFQSxZQUFLLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsR0FBbkIsTUFBNEIsQ0FBQyxDQUFsQyxFQUFzQyxLQUFLLG9CQUFMLENBQTBCLE1BQTFCO0FBQ3pDLEs7O3FCQUVELE0sbUJBQU8sSyxFQUFPO0FBQ1YsWUFBSSxPQUFRLHNCQUFaO0FBQ0EsYUFBSyxJQUFMLEdBQVksTUFBTSxDQUFOLEVBQVMsS0FBVCxDQUFlLENBQWYsQ0FBWjtBQUNBLFlBQUssS0FBSyxJQUFMLEtBQWMsRUFBbkIsRUFBd0I7QUFDcEIsaUJBQUssYUFBTCxDQUFtQixJQUFuQixFQUF5QixLQUF6QjtBQUNIO0FBQ0QsYUFBSyxJQUFMLENBQVUsSUFBVixFQUFnQixNQUFNLENBQU4sQ0FBaEIsRUFBMEIsTUFBTSxDQUFOLENBQTFCOztBQUVBLFlBQUksT0FBUyxLQUFiO0FBQ0EsWUFBSSxPQUFTLEtBQWI7QUFDQSxZQUFJLFNBQVMsRUFBYjs7QUFFQSxhQUFLLEdBQUwsSUFBWSxDQUFaO0FBQ0EsZUFBUSxLQUFLLEdBQUwsR0FBVyxLQUFLLE1BQUwsQ0FBWSxNQUEvQixFQUF3QztBQUNwQyxvQkFBUSxLQUFLLE1BQUwsQ0FBWSxLQUFLLEdBQWpCLENBQVI7O0FBRUEsZ0JBQUssTUFBTSxDQUFOLE1BQWEsR0FBbEIsRUFBd0I7QUFDcEIscUJBQUssTUFBTCxDQUFZLEdBQVosR0FBa0IsRUFBRSxNQUFNLE1BQU0sQ0FBTixDQUFSLEVBQWtCLFFBQVEsTUFBTSxDQUFOLENBQTFCLEVBQWxCO0FBQ0EscUJBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNBO0FBQ0gsYUFKRCxNQUlPLElBQUssTUFBTSxDQUFOLE1BQWEsR0FBbEIsRUFBd0I7QUFDM0IsdUJBQU8sSUFBUDtBQUNBO0FBQ0gsYUFITSxNQUdBLElBQUssTUFBTSxDQUFOLE1BQWEsR0FBbEIsRUFBdUI7QUFDMUIscUJBQUssR0FBTCxDQUFTLEtBQVQ7QUFDQTtBQUNILGFBSE0sTUFHQTtBQUNILHVCQUFPLElBQVAsQ0FBWSxLQUFaO0FBQ0g7O0FBRUQsaUJBQUssR0FBTCxJQUFZLENBQVo7QUFDSDtBQUNELFlBQUssS0FBSyxHQUFMLEtBQWEsS0FBSyxNQUFMLENBQVksTUFBOUIsRUFBdUM7QUFDbkMsbUJBQU8sSUFBUDtBQUNIOztBQUVELGFBQUssSUFBTCxDQUFVLE9BQVYsR0FBb0IsS0FBSyxhQUFMLENBQW1CLE1BQW5CLENBQXBCO0FBQ0EsWUFBSyxPQUFPLE1BQVosRUFBcUI7QUFDakIsaUJBQUssSUFBTCxDQUFVLFNBQVYsR0FBc0IsS0FBSyxlQUFMLENBQXFCLE1BQXJCLENBQXRCO0FBQ0EsaUJBQUssR0FBTCxDQUFTLElBQVQsRUFBZSxRQUFmLEVBQXlCLE1BQXpCO0FBQ0EsZ0JBQUssSUFBTCxFQUFZO0FBQ1Isd0JBQVEsT0FBTyxPQUFPLE1BQVAsR0FBZ0IsQ0FBdkIsQ0FBUjtBQUNBLHFCQUFLLE1BQUwsQ0FBWSxHQUFaLEdBQW9CLEVBQUUsTUFBTSxNQUFNLENBQU4sQ0FBUixFQUFrQixRQUFRLE1BQU0sQ0FBTixDQUExQixFQUFwQjtBQUNBLHFCQUFLLE1BQUwsR0FBb0IsS0FBSyxJQUFMLENBQVUsT0FBOUI7QUFDQSxxQkFBSyxJQUFMLENBQVUsT0FBVixHQUFvQixFQUFwQjtBQUNIO0FBQ0osU0FURCxNQVNPO0FBQ0gsaUJBQUssSUFBTCxDQUFVLFNBQVYsR0FBc0IsRUFBdEI7QUFDQSxpQkFBSyxNQUFMLEdBQXNCLEVBQXRCO0FBQ0g7O0FBRUQsWUFBSyxJQUFMLEVBQVk7QUFDUixpQkFBSyxLQUFMLEdBQWUsRUFBZjtBQUNBLGlCQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0g7QUFDSixLOztxQkFFRCxHLGdCQUFJLEssRUFBTztBQUNQLFlBQUssS0FBSyxPQUFMLENBQWEsS0FBYixJQUFzQixLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLE1BQTlDLEVBQXVEO0FBQ25ELGlCQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLFNBQWxCLEdBQThCLEtBQUssU0FBbkM7QUFDSDtBQUNELGFBQUssU0FBTCxHQUFpQixLQUFqQjs7QUFFQSxhQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLEtBQWxCLEdBQTBCLENBQUMsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFsQixJQUEyQixFQUE1QixJQUFrQyxLQUFLLE1BQWpFO0FBQ0EsYUFBSyxNQUFMLEdBQWMsRUFBZDs7QUFFQSxZQUFLLEtBQUssT0FBTCxDQUFhLE1BQWxCLEVBQTJCO0FBQ3ZCLGlCQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLEdBQXBCLEdBQTBCLEVBQUUsTUFBTSxNQUFNLENBQU4sQ0FBUixFQUFrQixRQUFRLE1BQU0sQ0FBTixDQUExQixFQUExQjtBQUNBLGlCQUFLLE9BQUwsR0FBZSxLQUFLLE9BQUwsQ0FBYSxNQUE1QjtBQUNILFNBSEQsTUFHTztBQUNILGlCQUFLLGVBQUwsQ0FBcUIsS0FBckI7QUFDSDtBQUNKLEs7O3FCQUVELE8sc0JBQVU7QUFDTixZQUFLLEtBQUssT0FBTCxDQUFhLE1BQWxCLEVBQTJCLEtBQUssYUFBTDtBQUMzQixZQUFLLEtBQUssT0FBTCxDQUFhLEtBQWIsSUFBc0IsS0FBSyxPQUFMLENBQWEsS0FBYixDQUFtQixNQUE5QyxFQUF1RDtBQUNuRCxpQkFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixTQUFsQixHQUE4QixLQUFLLFNBQW5DO0FBQ0g7QUFDRCxhQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLEtBQWxCLEdBQTBCLENBQUMsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFsQixJQUEyQixFQUE1QixJQUFrQyxLQUFLLE1BQWpFO0FBQ0gsSzs7QUFFRDs7cUJBRUEsSSxpQkFBSyxJLEVBQU0sSSxFQUFNLE0sRUFBUTtBQUNyQixhQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLElBQWxCOztBQUVBLGFBQUssTUFBTCxHQUFjLEVBQUUsT0FBTyxFQUFFLFVBQUYsRUFBUSxjQUFSLEVBQVQsRUFBMkIsT0FBTyxLQUFLLEtBQXZDLEVBQWQ7QUFDQSxhQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLEtBQUssTUFBeEI7QUFDQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsWUFBSyxLQUFLLElBQUwsS0FBYyxTQUFuQixFQUErQixLQUFLLFNBQUwsR0FBaUIsS0FBakI7QUFDbEMsSzs7cUJBRUQsRyxnQkFBSSxJLEVBQU0sSSxFQUFNLE0sRUFBUTtBQUNwQixZQUFJLGNBQUo7QUFBQSxZQUFXLGFBQVg7QUFDQSxZQUFJLFNBQVMsT0FBTyxNQUFwQjtBQUNBLFlBQUksUUFBUyxFQUFiO0FBQ0EsWUFBSSxRQUFTLElBQWI7QUFDQSxhQUFNLElBQUksSUFBSSxDQUFkLEVBQWlCLElBQUksTUFBckIsRUFBNkIsS0FBSyxDQUFsQyxFQUFzQztBQUNsQyxvQkFBUSxPQUFPLENBQVAsQ0FBUjtBQUNBLG1CQUFRLE1BQU0sQ0FBTixDQUFSO0FBQ0EsZ0JBQUssU0FBUyxTQUFULElBQXNCLFNBQVMsT0FBVCxJQUFvQixNQUFNLFNBQVMsQ0FBOUQsRUFBa0U7QUFDOUQsd0JBQVEsS0FBUjtBQUNILGFBRkQsTUFFTztBQUNILHlCQUFTLE1BQU0sQ0FBTixDQUFUO0FBQ0g7QUFDSjtBQUNELFlBQUssQ0FBQyxLQUFOLEVBQWM7QUFDVixnQkFBSSxNQUFNLE9BQU8sTUFBUCxDQUFlLFVBQUMsR0FBRCxFQUFNLENBQU47QUFBQSx1QkFBWSxNQUFNLEVBQUUsQ0FBRixDQUFsQjtBQUFBLGFBQWYsRUFBdUMsRUFBdkMsQ0FBVjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxJQUFWLElBQWtCLEVBQUUsWUFBRixFQUFTLFFBQVQsRUFBbEI7QUFDSDtBQUNELGFBQUssSUFBTCxJQUFhLEtBQWI7QUFDSCxLOztxQkFFRCxhLDBCQUFjLE0sRUFBUTtBQUNsQixZQUFJLHNCQUFKO0FBQ0EsWUFBSSxTQUFTLEVBQWI7QUFDQSxlQUFRLE9BQU8sTUFBZixFQUF3QjtBQUNwQiw0QkFBZ0IsT0FBTyxPQUFPLE1BQVAsR0FBZ0IsQ0FBdkIsRUFBMEIsQ0FBMUIsQ0FBaEI7QUFDQSxnQkFBSyxrQkFBa0IsT0FBbEIsSUFDRCxrQkFBa0IsU0FEdEIsRUFDa0M7QUFDbEMscUJBQVMsT0FBTyxHQUFQLEdBQWEsQ0FBYixJQUFrQixNQUEzQjtBQUNIO0FBQ0QsZUFBTyxNQUFQO0FBQ0gsSzs7cUJBRUQsZSw0QkFBZ0IsTSxFQUFRO0FBQ3BCLFlBQUksYUFBSjtBQUNBLFlBQUksU0FBUyxFQUFiO0FBQ0EsZUFBUSxPQUFPLE1BQWYsRUFBd0I7QUFDcEIsbUJBQU8sT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFQO0FBQ0EsZ0JBQUssU0FBUyxPQUFULElBQW9CLFNBQVMsU0FBbEMsRUFBOEM7QUFDOUMsc0JBQVUsT0FBTyxLQUFQLEdBQWUsQ0FBZixDQUFWO0FBQ0g7QUFDRCxlQUFPLE1BQVA7QUFDSCxLOztxQkFFRCxVLHVCQUFXLE0sRUFBUSxJLEVBQU07QUFDckIsWUFBSSxTQUFTLEVBQWI7QUFDQSxhQUFNLElBQUksSUFBSSxJQUFkLEVBQW9CLElBQUksT0FBTyxNQUEvQixFQUF1QyxHQUF2QyxFQUE2QztBQUN6QyxzQkFBVSxPQUFPLENBQVAsRUFBVSxDQUFWLENBQVY7QUFDSDtBQUNELGVBQU8sTUFBUCxDQUFjLElBQWQsRUFBb0IsT0FBTyxNQUFQLEdBQWdCLElBQXBDO0FBQ0EsZUFBTyxNQUFQO0FBQ0gsSzs7cUJBRUQsSyxrQkFBTSxNLEVBQVE7QUFDVixZQUFJLFdBQVcsQ0FBZjtBQUNBLFlBQUksY0FBSjtBQUFBLFlBQVcsYUFBWDtBQUFBLFlBQWlCLGFBQWpCO0FBQ0EsYUFBTSxJQUFJLElBQUksQ0FBZCxFQUFpQixJQUFJLE9BQU8sTUFBNUIsRUFBb0MsR0FBcEMsRUFBMEM7QUFDdEMsb0JBQVEsT0FBTyxDQUFQLENBQVI7QUFDQSxtQkFBUSxNQUFNLENBQU4sQ0FBUjs7QUFFQSxnQkFBSyxTQUFTLEdBQWQsRUFBb0I7QUFDaEIsNEJBQVksQ0FBWjtBQUNILGFBRkQsTUFFTyxJQUFLLFNBQVMsR0FBZCxFQUFvQjtBQUN2Qiw0QkFBWSxDQUFaO0FBQ0gsYUFGTSxNQUVBLElBQUssYUFBYSxDQUFiLElBQWtCLFNBQVMsR0FBaEMsRUFBc0M7QUFDekMsb0JBQUssQ0FBQyxJQUFOLEVBQWE7QUFDVCx5QkFBSyxXQUFMLENBQWlCLEtBQWpCO0FBQ0gsaUJBRkQsTUFFTyxJQUFLLEtBQUssQ0FBTCxNQUFZLE1BQVosSUFBc0IsS0FBSyxDQUFMLE1BQVksUUFBdkMsRUFBa0Q7QUFDckQ7QUFDSCxpQkFGTSxNQUVBO0FBQ0gsMkJBQU8sQ0FBUDtBQUNIO0FBQ0o7O0FBRUQsbUJBQU8sS0FBUDtBQUNIO0FBQ0QsZUFBTyxLQUFQO0FBQ0gsSzs7QUFFRDs7cUJBRUEsZSw0QkFBZ0IsTyxFQUFTO0FBQ3JCLGNBQU0sS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixrQkFBakIsRUFBcUMsUUFBUSxDQUFSLENBQXJDLEVBQWlELFFBQVEsQ0FBUixDQUFqRCxDQUFOO0FBQ0gsSzs7cUJBRUQsVyx3QkFBWSxLLEVBQU87QUFDZixZQUFJLFFBQVEsS0FBSyxNQUFMLENBQVksS0FBWixDQUFaO0FBQ0EsY0FBTSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLGNBQWpCLEVBQWlDLE1BQU0sQ0FBTixDQUFqQyxFQUEyQyxNQUFNLENBQU4sQ0FBM0MsQ0FBTjtBQUNILEs7O3FCQUVELGUsNEJBQWdCLEssRUFBTztBQUNuQixjQUFNLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsY0FBakIsRUFBaUMsTUFBTSxDQUFOLENBQWpDLEVBQTJDLE1BQU0sQ0FBTixDQUEzQyxDQUFOO0FBQ0gsSzs7cUJBRUQsYSw0QkFBZ0I7QUFDWixZQUFJLE1BQU0sS0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixLQUE5QjtBQUNBLGNBQU0sS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixnQkFBakIsRUFBbUMsSUFBSSxJQUF2QyxFQUE2QyxJQUFJLE1BQWpELENBQU47QUFDSCxLOztxQkFFRCxXLHdCQUFZLEssRUFBTztBQUNmLGNBQU0sS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixjQUFqQixFQUFpQyxNQUFNLENBQU4sQ0FBakMsRUFBMkMsTUFBTSxDQUFOLENBQTNDLENBQU47QUFDSCxLOztxQkFFRCxhLDBCQUFjLEksRUFBTSxLLEVBQU87QUFDdkIsY0FBTSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLHNCQUFqQixFQUF5QyxNQUFNLENBQU4sQ0FBekMsRUFBbUQsTUFBTSxDQUFOLENBQW5ELENBQU47QUFDSCxLOztxQkFFRCx1QixvQ0FBd0IsTSxFQUFRO0FBQzVCO0FBQ0E7QUFDSCxLOztxQkFFRCxvQixpQ0FBcUIsTSxFQUFRO0FBQ3pCLFlBQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQVo7QUFDQSxZQUFLLFVBQVUsS0FBZixFQUF1Qjs7QUFFdkIsWUFBSSxVQUFVLENBQWQ7QUFDQSxZQUFJLGNBQUo7QUFDQSxhQUFNLElBQUksSUFBSSxRQUFRLENBQXRCLEVBQXlCLEtBQUssQ0FBOUIsRUFBaUMsR0FBakMsRUFBdUM7QUFDbkMsb0JBQVEsT0FBTyxDQUFQLENBQVI7QUFDQSxnQkFBSyxNQUFNLENBQU4sTUFBYSxPQUFsQixFQUE0QjtBQUN4QiwyQkFBVyxDQUFYO0FBQ0Esb0JBQUssWUFBWSxDQUFqQixFQUFxQjtBQUN4QjtBQUNKO0FBQ0QsY0FBTSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLGtCQUFqQixFQUFxQyxNQUFNLENBQU4sQ0FBckMsRUFBK0MsTUFBTSxDQUFOLENBQS9DLENBQU47QUFDSCxLOzs7OztrQkFoZGdCLE0iLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERlY2xhcmF0aW9uIGZyb20gJy4vZGVjbGFyYXRpb24nO1xuaW1wb3J0IHRva2VuaXplciAgIGZyb20gJy4vdG9rZW5pemUnO1xuaW1wb3J0IENvbW1lbnQgICAgIGZyb20gJy4vY29tbWVudCc7XG5pbXBvcnQgQXRSdWxlICAgICAgZnJvbSAnLi9hdC1ydWxlJztcbmltcG9ydCBSb290ICAgICAgICBmcm9tICcuL3Jvb3QnO1xuaW1wb3J0IFJ1bGUgICAgICAgIGZyb20gJy4vcnVsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihpbnB1dCkge1xuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XG5cbiAgICAgICAgdGhpcy5wb3MgICAgICAgPSAwO1xuICAgICAgICB0aGlzLnJvb3QgICAgICA9IG5ldyBSb290KCk7XG4gICAgICAgIHRoaXMuY3VycmVudCAgID0gdGhpcy5yb290O1xuICAgICAgICB0aGlzLnNwYWNlcyAgICA9ICcnO1xuICAgICAgICB0aGlzLnNlbWljb2xvbiA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMucm9vdC5zb3VyY2UgPSB7IGlucHV0LCBzdGFydDogeyBsaW5lOiAxLCBjb2x1bW46IDEgfSB9O1xuICAgIH1cblxuICAgIHRva2VuaXplKCkge1xuICAgICAgICB0aGlzLnRva2VucyA9IHRva2VuaXplcih0aGlzLmlucHV0KTtcbiAgICB9XG5cbiAgICBsb29wKCkge1xuICAgICAgICBsZXQgdG9rZW47XG4gICAgICAgIHdoaWxlICggdGhpcy5wb3MgPCB0aGlzLnRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRoaXMudG9rZW5zW3RoaXMucG9zXTtcblxuICAgICAgICAgICAgc3dpdGNoICggdG9rZW5bMF0gKSB7XG4gICAgICAgICAgICBjYXNlICd3b3JkJzpcbiAgICAgICAgICAgIGNhc2UgJzonOlxuICAgICAgICAgICAgICAgIHRoaXMud29yZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd9JzpcbiAgICAgICAgICAgICAgICB0aGlzLmVuZCh0b2tlbik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudCh0b2tlbik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2F0LXdvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuYXRydWxlKHRva2VuKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAneyc6XG4gICAgICAgICAgICAgICAgdGhpcy5lbXB0eVJ1bGUodG9rZW4pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuc3BhY2VzICs9IHRva2VuWzFdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnBvcyArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5kRmlsZSgpO1xuICAgIH1cblxuICAgIGNvbW1lbnQodG9rZW4pIHtcbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgQ29tbWVudCgpO1xuICAgICAgICB0aGlzLmluaXQobm9kZSwgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICAgICAgbm9kZS5zb3VyY2UuZW5kID0geyBsaW5lOiB0b2tlbls0XSwgY29sdW1uOiB0b2tlbls1XSB9O1xuXG4gICAgICAgIGxldCB0ZXh0ID0gdG9rZW5bMV0uc2xpY2UoMiwgLTIpO1xuICAgICAgICBpZiAoIC9eXFxzKiQvLnRlc3QodGV4dCkgKSB7XG4gICAgICAgICAgICBub2RlLnRleHQgICAgICAgPSAnJztcbiAgICAgICAgICAgIG5vZGUucmF3cy5sZWZ0ICA9IHRleHQ7XG4gICAgICAgICAgICBub2RlLnJhd3MucmlnaHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IHRleHQubWF0Y2goL14oXFxzKikoW15dKlteXFxzXSkoXFxzKikkLyk7XG4gICAgICAgICAgICBub2RlLnRleHQgICAgICAgPSBtYXRjaFsyXTtcbiAgICAgICAgICAgIG5vZGUucmF3cy5sZWZ0ICA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgbm9kZS5yYXdzLnJpZ2h0ID0gbWF0Y2hbM107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbXB0eVJ1bGUodG9rZW4pIHtcbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgUnVsZSgpO1xuICAgICAgICB0aGlzLmluaXQobm9kZSwgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICAgICAgbm9kZS5zZWxlY3RvciA9ICcnO1xuICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiA9ICcnO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBub2RlO1xuICAgIH1cblxuICAgIHdvcmQoKSB7XG4gICAgICAgIGxldCB0b2tlbjtcbiAgICAgICAgbGV0IGVuZCAgICAgID0gZmFsc2U7XG4gICAgICAgIGxldCB0eXBlICAgICA9IG51bGw7XG4gICAgICAgIGxldCBjb2xvbiAgICA9IGZhbHNlO1xuICAgICAgICBsZXQgYnJhY2tldCAgPSBudWxsO1xuICAgICAgICBsZXQgYnJhY2tldHMgPSAwO1xuXG4gICAgICAgIGxldCBzdGFydCA9IHRoaXMucG9zO1xuICAgICAgICB0aGlzLnBvcyArPSAxO1xuICAgICAgICB3aGlsZSAoIHRoaXMucG9zIDwgdGhpcy50b2tlbnMubGVuZ3RoICkge1xuICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRva2Vuc1t0aGlzLnBvc107XG4gICAgICAgICAgICB0eXBlICA9IHRva2VuWzBdO1xuXG4gICAgICAgICAgICBpZiAoIHR5cGUgPT09ICcoJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoICFicmFja2V0ICkgYnJhY2tldCA9IHRva2VuO1xuICAgICAgICAgICAgICAgIGJyYWNrZXRzICs9IDE7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGJyYWNrZXRzID09PSAwICkge1xuICAgICAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJzsnICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGNvbG9uICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNsKHRoaXMudG9rZW5zLnNsaWNlKHN0YXJ0LCB0aGlzLnBvcyArIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAneycgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucnVsZSh0aGlzLnRva2Vucy5zbGljZShzdGFydCwgdGhpcy5wb3MgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICd9JyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnOicgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICcpJyApIHtcbiAgICAgICAgICAgICAgICBicmFja2V0cyAtPSAxO1xuICAgICAgICAgICAgICAgIGlmICggYnJhY2tldHMgPT09IDAgKSBicmFja2V0ID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wb3MgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHRoaXMucG9zID09PSB0aGlzLnRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICB0aGlzLnBvcyAtPSAxO1xuICAgICAgICAgICAgZW5kID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggYnJhY2tldHMgPiAwICkgdGhpcy51bmNsb3NlZEJyYWNrZXQoYnJhY2tldCk7XG5cbiAgICAgICAgaWYgKCBlbmQgJiYgY29sb24gKSB7XG4gICAgICAgICAgICB3aGlsZSAoIHRoaXMucG9zID4gc3RhcnQgKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRva2Vuc1t0aGlzLnBvc11bMF07XG4gICAgICAgICAgICAgICAgaWYgKCB0b2tlbiAhPT0gJ3NwYWNlJyAmJiB0b2tlbiAhPT0gJ2NvbW1lbnQnICkgYnJlYWs7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3MgLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGVjbCh0aGlzLnRva2Vucy5zbGljZShzdGFydCwgdGhpcy5wb3MgKyAxKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVua25vd25Xb3JkKHN0YXJ0KTtcbiAgICB9XG5cbiAgICBydWxlKHRva2Vucykge1xuICAgICAgICB0b2tlbnMucG9wKCk7XG5cbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgUnVsZSgpO1xuICAgICAgICB0aGlzLmluaXQobm9kZSwgdG9rZW5zWzBdWzJdLCB0b2tlbnNbMF1bM10pO1xuXG4gICAgICAgIG5vZGUucmF3cy5iZXR3ZWVuID0gdGhpcy5zcGFjZXNGcm9tRW5kKHRva2Vucyk7XG4gICAgICAgIHRoaXMucmF3KG5vZGUsICdzZWxlY3RvcicsIHRva2Vucyk7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IG5vZGU7XG4gICAgfVxuXG4gICAgZGVjbCh0b2tlbnMpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgRGVjbGFyYXRpb24oKTtcbiAgICAgICAgdGhpcy5pbml0KG5vZGUpO1xuXG4gICAgICAgIGxldCBsYXN0ID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKCBsYXN0WzBdID09PSAnOycgKSB7XG4gICAgICAgICAgICB0aGlzLnNlbWljb2xvbiA9IHRydWU7XG4gICAgICAgICAgICB0b2tlbnMucG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBsYXN0WzRdICkge1xuICAgICAgICAgICAgbm9kZS5zb3VyY2UuZW5kID0geyBsaW5lOiBsYXN0WzRdLCBjb2x1bW46IGxhc3RbNV0gfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuc291cmNlLmVuZCA9IHsgbGluZTogbGFzdFsyXSwgY29sdW1uOiBsYXN0WzNdIH07XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoIHRva2Vuc1swXVswXSAhPT0gJ3dvcmQnICkge1xuICAgICAgICAgICAgbm9kZS5yYXdzLmJlZm9yZSArPSB0b2tlbnMuc2hpZnQoKVsxXTtcbiAgICAgICAgfVxuICAgICAgICBub2RlLnNvdXJjZS5zdGFydCA9IHsgbGluZTogdG9rZW5zWzBdWzJdLCBjb2x1bW46IHRva2Vuc1swXVszXSB9O1xuXG4gICAgICAgIG5vZGUucHJvcCA9ICcnO1xuICAgICAgICB3aGlsZSAoIHRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IHRva2Vuc1swXVswXTtcbiAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJzonIHx8IHR5cGUgPT09ICdzcGFjZScgfHwgdHlwZSA9PT0gJ2NvbW1lbnQnICkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5wcm9wICs9IHRva2Vucy5zaGlmdCgpWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gPSAnJztcblxuICAgICAgICBsZXQgdG9rZW47XG4gICAgICAgIHdoaWxlICggdG9rZW5zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG5cbiAgICAgICAgICAgIGlmICggdG9rZW5bMF0gPT09ICc6JyApIHtcbiAgICAgICAgICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiArPSB0b2tlblsxXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gKz0gdG9rZW5bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIG5vZGUucHJvcFswXSA9PT0gJ18nIHx8IG5vZGUucHJvcFswXSA9PT0gJyonICkge1xuICAgICAgICAgICAgbm9kZS5yYXdzLmJlZm9yZSArPSBub2RlLnByb3BbMF07XG4gICAgICAgICAgICBub2RlLnByb3AgPSBub2RlLnByb3Auc2xpY2UoMSk7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gKz0gdGhpcy5zcGFjZXNGcm9tU3RhcnQodG9rZW5zKTtcbiAgICAgICAgdGhpcy5wcmVjaGVja01pc3NlZFNlbWljb2xvbih0b2tlbnMpO1xuXG4gICAgICAgIGZvciAoIGxldCBpID0gdG9rZW5zLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0gKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIGlmICggdG9rZW5bMV0gPT09ICchaW1wb3J0YW50JyApIHtcbiAgICAgICAgICAgICAgICBub2RlLmltcG9ydGFudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IHN0cmluZyA9IHRoaXMuc3RyaW5nRnJvbSh0b2tlbnMsIGkpO1xuICAgICAgICAgICAgICAgIHN0cmluZyA9IHRoaXMuc3BhY2VzRnJvbUVuZCh0b2tlbnMpICsgc3RyaW5nO1xuICAgICAgICAgICAgICAgIGlmICggc3RyaW5nICE9PSAnICFpbXBvcnRhbnQnICkgbm9kZS5yYXdzLmltcG9ydGFudCA9IHN0cmluZztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlblsxXSA9PT0gJ2ltcG9ydGFudCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2FjaGUgPSB0b2tlbnMuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgbGV0IHN0ciAgID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICggbGV0IGogPSBpOyBqID4gMDsgai0tICkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IGNhY2hlW2pdWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHN0ci50cmltKCkuaW5kZXhPZignIScpID09PSAwICYmIHR5cGUgIT09ICdzcGFjZScgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdHIgPSBjYWNoZS5wb3AoKVsxXSArIHN0cjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCBzdHIudHJpbSgpLmluZGV4T2YoJyEnKSA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5pbXBvcnRhbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBub2RlLnJhd3MuaW1wb3J0YW50ID0gc3RyO1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMgPSBjYWNoZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggdG9rZW5bMF0gIT09ICdzcGFjZScgJiYgdG9rZW5bMF0gIT09ICdjb21tZW50JyApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmF3KG5vZGUsICd2YWx1ZScsIHRva2Vucyk7XG5cbiAgICAgICAgaWYgKCBub2RlLnZhbHVlLmluZGV4T2YoJzonKSAhPT0gLTEgKSB0aGlzLmNoZWNrTWlzc2VkU2VtaWNvbG9uKHRva2Vucyk7XG4gICAgfVxuXG4gICAgYXRydWxlKHRva2VuKSB7XG4gICAgICAgIGxldCBub2RlICA9IG5ldyBBdFJ1bGUoKTtcbiAgICAgICAgbm9kZS5uYW1lID0gdG9rZW5bMV0uc2xpY2UoMSk7XG4gICAgICAgIGlmICggbm9kZS5uYW1lID09PSAnJyApIHtcbiAgICAgICAgICAgIHRoaXMudW5uYW1lZEF0cnVsZShub2RlLCB0b2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0KG5vZGUsIHRva2VuWzJdLCB0b2tlblszXSk7XG5cbiAgICAgICAgbGV0IGxhc3QgICA9IGZhbHNlO1xuICAgICAgICBsZXQgb3BlbiAgID0gZmFsc2U7XG4gICAgICAgIGxldCBwYXJhbXMgPSBbXTtcblxuICAgICAgICB0aGlzLnBvcyArPSAxO1xuICAgICAgICB3aGlsZSAoIHRoaXMucG9zIDwgdGhpcy50b2tlbnMubGVuZ3RoICkge1xuICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRva2Vuc1t0aGlzLnBvc107XG5cbiAgICAgICAgICAgIGlmICggdG9rZW5bMF0gPT09ICc7JyApIHtcbiAgICAgICAgICAgICAgICBub2RlLnNvdXJjZS5lbmQgPSB7IGxpbmU6IHRva2VuWzJdLCBjb2x1bW46IHRva2VuWzNdIH07XG4gICAgICAgICAgICAgICAgdGhpcy5zZW1pY29sb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdG9rZW5bMF0gPT09ICd7JyApIHtcbiAgICAgICAgICAgICAgICBvcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRva2VuWzBdID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZCh0b2tlbik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wb3MgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHRoaXMucG9zID09PSB0aGlzLnRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICBsYXN0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUucmF3cy5iZXR3ZWVuID0gdGhpcy5zcGFjZXNGcm9tRW5kKHBhcmFtcyk7XG4gICAgICAgIGlmICggcGFyYW1zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIG5vZGUucmF3cy5hZnRlck5hbWUgPSB0aGlzLnNwYWNlc0Zyb21TdGFydChwYXJhbXMpO1xuICAgICAgICAgICAgdGhpcy5yYXcobm9kZSwgJ3BhcmFtcycsIHBhcmFtcyk7XG4gICAgICAgICAgICBpZiAoIGxhc3QgKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSBwYXJhbXNbcGFyYW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIG5vZGUuc291cmNlLmVuZCAgID0geyBsaW5lOiB0b2tlbls0XSwgY29sdW1uOiB0b2tlbls1XSB9O1xuICAgICAgICAgICAgICAgIHRoaXMuc3BhY2VzICAgICAgID0gbm9kZS5yYXdzLmJldHdlZW47XG4gICAgICAgICAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUucmF3cy5hZnRlck5hbWUgPSAnJztcbiAgICAgICAgICAgIG5vZGUucGFyYW1zICAgICAgICAgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggb3BlbiApIHtcbiAgICAgICAgICAgIG5vZGUubm9kZXMgICA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gbm9kZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVuZCh0b2tlbikge1xuICAgICAgICBpZiAoIHRoaXMuY3VycmVudC5ub2RlcyAmJiB0aGlzLmN1cnJlbnQubm9kZXMubGVuZ3RoICkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50LnJhd3Muc2VtaWNvbG9uID0gdGhpcy5zZW1pY29sb247XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZW1pY29sb24gPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmN1cnJlbnQucmF3cy5hZnRlciA9ICh0aGlzLmN1cnJlbnQucmF3cy5hZnRlciB8fCAnJykgKyB0aGlzLnNwYWNlcztcbiAgICAgICAgdGhpcy5zcGFjZXMgPSAnJztcblxuICAgICAgICBpZiAoIHRoaXMuY3VycmVudC5wYXJlbnQgKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQuc291cmNlLmVuZCA9IHsgbGluZTogdG9rZW5bMl0sIGNvbHVtbjogdG9rZW5bM10gfTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuY3VycmVudC5wYXJlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVuZXhwZWN0ZWRDbG9zZSh0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbmRGaWxlKCkge1xuICAgICAgICBpZiAoIHRoaXMuY3VycmVudC5wYXJlbnQgKSB0aGlzLnVuY2xvc2VkQmxvY2soKTtcbiAgICAgICAgaWYgKCB0aGlzLmN1cnJlbnQubm9kZXMgJiYgdGhpcy5jdXJyZW50Lm5vZGVzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5yYXdzLnNlbWljb2xvbiA9IHRoaXMuc2VtaWNvbG9uO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudC5yYXdzLmFmdGVyID0gKHRoaXMuY3VycmVudC5yYXdzLmFmdGVyIHx8ICcnKSArIHRoaXMuc3BhY2VzO1xuICAgIH1cblxuICAgIC8vIEhlbHBlcnNcblxuICAgIGluaXQobm9kZSwgbGluZSwgY29sdW1uKSB7XG4gICAgICAgIHRoaXMuY3VycmVudC5wdXNoKG5vZGUpO1xuXG4gICAgICAgIG5vZGUuc291cmNlID0geyBzdGFydDogeyBsaW5lLCBjb2x1bW4gfSwgaW5wdXQ6IHRoaXMuaW5wdXQgfTtcbiAgICAgICAgbm9kZS5yYXdzLmJlZm9yZSA9IHRoaXMuc3BhY2VzO1xuICAgICAgICB0aGlzLnNwYWNlcyA9ICcnO1xuICAgICAgICBpZiAoIG5vZGUudHlwZSAhPT0gJ2NvbW1lbnQnICkgdGhpcy5zZW1pY29sb24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICByYXcobm9kZSwgcHJvcCwgdG9rZW5zKSB7XG4gICAgICAgIGxldCB0b2tlbiwgdHlwZTtcbiAgICAgICAgbGV0IGxlbmd0aCA9IHRva2Vucy5sZW5ndGg7XG4gICAgICAgIGxldCB2YWx1ZSAgPSAnJztcbiAgICAgICAgbGV0IGNsZWFuICA9IHRydWU7XG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxICkge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICB0eXBlICA9IHRva2VuWzBdO1xuICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnY29tbWVudCcgfHwgdHlwZSA9PT0gJ3NwYWNlJyAmJiBpID09PSBsZW5ndGggLSAxICkge1xuICAgICAgICAgICAgICAgIGNsZWFuID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlICs9IHRva2VuWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICggIWNsZWFuICkge1xuICAgICAgICAgICAgbGV0IHJhdyA9IHRva2Vucy5yZWR1Y2UoIChhbGwsIGkpID0+IGFsbCArIGlbMV0sICcnKTtcbiAgICAgICAgICAgIG5vZGUucmF3c1twcm9wXSA9IHsgdmFsdWUsIHJhdyB9O1xuICAgICAgICB9XG4gICAgICAgIG5vZGVbcHJvcF0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBzcGFjZXNGcm9tRW5kKHRva2Vucykge1xuICAgICAgICBsZXQgbGFzdFRva2VuVHlwZTtcbiAgICAgICAgbGV0IHNwYWNlcyA9ICcnO1xuICAgICAgICB3aGlsZSAoIHRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICBsYXN0VG9rZW5UeXBlID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXVswXTtcbiAgICAgICAgICAgIGlmICggbGFzdFRva2VuVHlwZSAhPT0gJ3NwYWNlJyAmJlxuICAgICAgICAgICAgICAgIGxhc3RUb2tlblR5cGUgIT09ICdjb21tZW50JyApIGJyZWFrO1xuICAgICAgICAgICAgc3BhY2VzID0gdG9rZW5zLnBvcCgpWzFdICsgc3BhY2VzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcGFjZXM7XG4gICAgfVxuXG4gICAgc3BhY2VzRnJvbVN0YXJ0KHRva2Vucykge1xuICAgICAgICBsZXQgbmV4dDtcbiAgICAgICAgbGV0IHNwYWNlcyA9ICcnO1xuICAgICAgICB3aGlsZSAoIHRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICBuZXh0ID0gdG9rZW5zWzBdWzBdO1xuICAgICAgICAgICAgaWYgKCBuZXh0ICE9PSAnc3BhY2UnICYmIG5leHQgIT09ICdjb21tZW50JyApIGJyZWFrO1xuICAgICAgICAgICAgc3BhY2VzICs9IHRva2Vucy5zaGlmdCgpWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcGFjZXM7XG4gICAgfVxuXG4gICAgc3RyaW5nRnJvbSh0b2tlbnMsIGZyb20pIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICBmb3IgKCBsZXQgaSA9IGZyb207IGkgPCB0b2tlbnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gdG9rZW5zW2ldWzFdO1xuICAgICAgICB9XG4gICAgICAgIHRva2Vucy5zcGxpY2UoZnJvbSwgdG9rZW5zLmxlbmd0aCAtIGZyb20pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNvbG9uKHRva2Vucykge1xuICAgICAgICBsZXQgYnJhY2tldHMgPSAwO1xuICAgICAgICBsZXQgdG9rZW4sIHR5cGUsIHByZXY7XG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgdHlwZSAgPSB0b2tlblswXTtcblxuICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnKCcgKSB7XG4gICAgICAgICAgICAgICAgYnJhY2tldHMgKz0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICcpJyApIHtcbiAgICAgICAgICAgICAgICBicmFja2V0cyAtPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggYnJhY2tldHMgPT09IDAgJiYgdHlwZSA9PT0gJzonICkge1xuICAgICAgICAgICAgICAgIGlmICggIXByZXYgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG91YmxlQ29sb24odG9rZW4pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHByZXZbMF0gPT09ICd3b3JkJyAmJiBwcmV2WzFdID09PSAncHJvZ2lkJyApIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmV2ID0gdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEVycm9yc1xuXG4gICAgdW5jbG9zZWRCcmFja2V0KGJyYWNrZXQpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcignVW5jbG9zZWQgYnJhY2tldCcsIGJyYWNrZXRbMl0sIGJyYWNrZXRbM10pO1xuICAgIH1cblxuICAgIHVua25vd25Xb3JkKHN0YXJ0KSB7XG4gICAgICAgIGxldCB0b2tlbiA9IHRoaXMudG9rZW5zW3N0YXJ0XTtcbiAgICAgICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcignVW5rbm93biB3b3JkJywgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICB9XG5cbiAgICB1bmV4cGVjdGVkQ2xvc2UodG9rZW4pIHtcbiAgICAgICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcignVW5leHBlY3RlZCB9JywgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICB9XG5cbiAgICB1bmNsb3NlZEJsb2NrKCkge1xuICAgICAgICBsZXQgcG9zID0gdGhpcy5jdXJyZW50LnNvdXJjZS5zdGFydDtcbiAgICAgICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcignVW5jbG9zZWQgYmxvY2snLCBwb3MubGluZSwgcG9zLmNvbHVtbik7XG4gICAgfVxuXG4gICAgZG91YmxlQ29sb24odG9rZW4pIHtcbiAgICAgICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcignRG91YmxlIGNvbG9uJywgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICB9XG5cbiAgICB1bm5hbWVkQXRydWxlKG5vZGUsIHRva2VuKSB7XG4gICAgICAgIHRocm93IHRoaXMuaW5wdXQuZXJyb3IoJ0F0LXJ1bGUgd2l0aG91dCBuYW1lJywgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICB9XG5cbiAgICBwcmVjaGVja01pc3NlZFNlbWljb2xvbih0b2tlbnMpIHtcbiAgICAgICAgLy8gSG9vayBmb3IgU2FmZSBQYXJzZXJcbiAgICAgICAgdG9rZW5zO1xuICAgIH1cblxuICAgIGNoZWNrTWlzc2VkU2VtaWNvbG9uKHRva2Vucykge1xuICAgICAgICBsZXQgY29sb24gPSB0aGlzLmNvbG9uKHRva2Vucyk7XG4gICAgICAgIGlmICggY29sb24gPT09IGZhbHNlICkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBmb3VuZGVkID0gMDtcbiAgICAgICAgbGV0IHRva2VuO1xuICAgICAgICBmb3IgKCBsZXQgaiA9IGNvbG9uIC0gMTsgaiA+PSAwOyBqLS0gKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tqXTtcbiAgICAgICAgICAgIGlmICggdG9rZW5bMF0gIT09ICdzcGFjZScgKSB7XG4gICAgICAgICAgICAgICAgZm91bmRlZCArPSAxO1xuICAgICAgICAgICAgICAgIGlmICggZm91bmRlZCA9PT0gMiApIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93IHRoaXMuaW5wdXQuZXJyb3IoJ01pc3NlZCBzZW1pY29sb24nLCB0b2tlblsyXSwgdG9rZW5bM10pO1xuICAgIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
