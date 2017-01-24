'use strict';

exports.__esModule = true;

var _jsBase = require('js-base64');

var _sourceMap = require('source-map');

var _sourceMap2 = _interopRequireDefault(_sourceMap);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapGenerator = function () {
    function MapGenerator(stringify, root, opts) {
        _classCallCheck(this, MapGenerator);

        this.stringify = stringify;
        this.mapOpts = opts.map || {};
        this.root = root;
        this.opts = opts;
    }

    MapGenerator.prototype.isMap = function isMap() {
        if (typeof this.opts.map !== 'undefined') {
            return !!this.opts.map;
        } else {
            return this.previous().length > 0;
        }
    };

    MapGenerator.prototype.previous = function previous() {
        var _this = this;

        if (!this.previousMaps) {
            this.previousMaps = [];
            this.root.walk(function (node) {
                if (node.source && node.source.input.map) {
                    var map = node.source.input.map;
                    if (_this.previousMaps.indexOf(map) === -1) {
                        _this.previousMaps.push(map);
                    }
                }
            });
        }

        return this.previousMaps;
    };

    MapGenerator.prototype.isInline = function isInline() {
        if (typeof this.mapOpts.inline !== 'undefined') {
            return this.mapOpts.inline;
        }

        var annotation = this.mapOpts.annotation;
        if (typeof annotation !== 'undefined' && annotation !== true) {
            return false;
        }

        if (this.previous().length) {
            return this.previous().some(function (i) {
                return i.inline;
            });
        } else {
            return true;
        }
    };

    MapGenerator.prototype.isSourcesContent = function isSourcesContent() {
        if (typeof this.mapOpts.sourcesContent !== 'undefined') {
            return this.mapOpts.sourcesContent;
        }
        if (this.previous().length) {
            return this.previous().some(function (i) {
                return i.withContent();
            });
        } else {
            return true;
        }
    };

    MapGenerator.prototype.clearAnnotation = function clearAnnotation() {
        if (this.mapOpts.annotation === false) return;

        var node = void 0;
        for (var i = this.root.nodes.length - 1; i >= 0; i--) {
            node = this.root.nodes[i];
            if (node.type !== 'comment') continue;
            if (node.text.indexOf('# sourceMappingURL=') === 0) {
                this.root.removeChild(i);
            }
        }
    };

    MapGenerator.prototype.setSourcesContent = function setSourcesContent() {
        var _this2 = this;

        var already = {};
        this.root.walk(function (node) {
            if (node.source) {
                var from = node.source.input.from;
                if (from && !already[from]) {
                    already[from] = true;
                    var relative = _this2.relative(from);
                    _this2.map.setSourceContent(relative, node.source.input.css);
                }
            }
        });
    };

    MapGenerator.prototype.applyPrevMaps = function applyPrevMaps() {
        for (var _iterator = this.previous(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var prev = _ref;

            var from = this.relative(prev.file);
            var root = prev.root || _path2.default.dirname(prev.file);
            var map = void 0;

            if (this.mapOpts.sourcesContent === false) {
                map = new _sourceMap2.default.SourceMapConsumer(prev.text);
                if (map.sourcesContent) {
                    map.sourcesContent = map.sourcesContent.map(function () {
                        return null;
                    });
                }
            } else {
                map = prev.consumer();
            }

            this.map.applySourceMap(map, from, this.relative(root));
        }
    };

    MapGenerator.prototype.isAnnotation = function isAnnotation() {
        if (this.isInline()) {
            return true;
        } else if (typeof this.mapOpts.annotation !== 'undefined') {
            return this.mapOpts.annotation;
        } else if (this.previous().length) {
            return this.previous().some(function (i) {
                return i.annotation;
            });
        } else {
            return true;
        }
    };

    MapGenerator.prototype.addAnnotation = function addAnnotation() {
        var content = void 0;

        if (this.isInline()) {
            content = 'data:application/json;base64,' + _jsBase.Base64.encode(this.map.toString());
        } else if (typeof this.mapOpts.annotation === 'string') {
            content = this.mapOpts.annotation;
        } else {
            content = this.outputFile() + '.map';
        }

        var eol = '\n';
        if (this.css.indexOf('\r\n') !== -1) eol = '\r\n';

        this.css += eol + '/*# sourceMappingURL=' + content + ' */';
    };

    MapGenerator.prototype.outputFile = function outputFile() {
        if (this.opts.to) {
            return this.relative(this.opts.to);
        } else if (this.opts.from) {
            return this.relative(this.opts.from);
        } else {
            return 'to.css';
        }
    };

    MapGenerator.prototype.generateMap = function generateMap() {
        this.generateString();
        if (this.isSourcesContent()) this.setSourcesContent();
        if (this.previous().length > 0) this.applyPrevMaps();
        if (this.isAnnotation()) this.addAnnotation();

        if (this.isInline()) {
            return [this.css];
        } else {
            return [this.css, this.map];
        }
    };

    MapGenerator.prototype.relative = function relative(file) {
        if (/^\w+:\/\//.test(file)) return file;

        var from = this.opts.to ? _path2.default.dirname(this.opts.to) : '.';

        if (typeof this.mapOpts.annotation === 'string') {
            from = _path2.default.dirname(_path2.default.resolve(from, this.mapOpts.annotation));
        }

        file = _path2.default.relative(from, file);
        if (_path2.default.sep === '\\') {
            return file.replace(/\\/g, '/');
        } else {
            return file;
        }
    };

    MapGenerator.prototype.sourcePath = function sourcePath(node) {
        if (this.mapOpts.from) {
            return this.mapOpts.from;
        } else {
            return this.relative(node.source.input.from);
        }
    };

    MapGenerator.prototype.generateString = function generateString() {
        var _this3 = this;

        this.css = '';
        this.map = new _sourceMap2.default.SourceMapGenerator({ file: this.outputFile() });

        var line = 1;
        var column = 1;

        var lines = void 0,
            last = void 0;
        this.stringify(this.root, function (str, node, type) {
            _this3.css += str;

            if (node && type !== 'end') {
                if (node.source && node.source.start) {
                    _this3.map.addMapping({
                        source: _this3.sourcePath(node),
                        generated: { line: line, column: column - 1 },
                        original: {
                            line: node.source.start.line,
                            column: node.source.start.column - 1
                        }
                    });
                } else {
                    _this3.map.addMapping({
                        source: '<no source>',
                        original: { line: 1, column: 0 },
                        generated: { line: line, column: column - 1 }
                    });
                }
            }

            lines = str.match(/\n/g);
            if (lines) {
                line += lines.length;
                last = str.lastIndexOf('\n');
                column = str.length - last;
            } else {
                column += str.length;
            }

            if (node && type !== 'start') {
                if (node.source && node.source.end) {
                    _this3.map.addMapping({
                        source: _this3.sourcePath(node),
                        generated: { line: line, column: column - 1 },
                        original: {
                            line: node.source.end.line,
                            column: node.source.end.column
                        }
                    });
                } else {
                    _this3.map.addMapping({
                        source: '<no source>',
                        original: { line: 1, column: 0 },
                        generated: { line: line, column: column - 1 }
                    });
                }
            }
        });
    };

    MapGenerator.prototype.generate = function generate() {
        this.clearAnnotation();

        if (this.isMap()) {
            return this.generateMap();
        } else {
            var result = '';
            this.stringify(this.root, function (i) {
                result += i;
            });
            return [result];
        }
    };

    return MapGenerator;
}();

exports.default = MapGenerator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hcC1nZW5lcmF0b3IuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUVxQixZO0FBRWpCLDBCQUFZLFNBQVosRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0IsRUFBbUM7QUFBQTs7QUFDL0IsYUFBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0EsYUFBSyxPQUFMLEdBQWlCLEtBQUssR0FBTCxJQUFZLEVBQTdCO0FBQ0EsYUFBSyxJQUFMLEdBQWlCLElBQWpCO0FBQ0EsYUFBSyxJQUFMLEdBQWlCLElBQWpCO0FBQ0g7OzJCQUVELEssb0JBQVE7QUFDSixZQUFLLE9BQU8sS0FBSyxJQUFMLENBQVUsR0FBakIsS0FBeUIsV0FBOUIsRUFBNEM7QUFDeEMsbUJBQU8sQ0FBQyxDQUFDLEtBQUssSUFBTCxDQUFVLEdBQW5CO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsbUJBQU8sS0FBSyxRQUFMLEdBQWdCLE1BQWhCLEdBQXlCLENBQWhDO0FBQ0g7QUFDSixLOzsyQkFFRCxRLHVCQUFXO0FBQUE7O0FBQ1AsWUFBSyxDQUFDLEtBQUssWUFBWCxFQUEwQjtBQUN0QixpQkFBSyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsaUJBQUssSUFBTCxDQUFVLElBQVYsQ0FBZ0IsZ0JBQVE7QUFDcEIsb0JBQUssS0FBSyxNQUFMLElBQWUsS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixHQUF0QyxFQUE0QztBQUN4Qyx3QkFBSSxNQUFNLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsR0FBNUI7QUFDQSx3QkFBSyxNQUFLLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBMEIsR0FBMUIsTUFBbUMsQ0FBQyxDQUF6QyxFQUE2QztBQUN6Qyw4QkFBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLEdBQXZCO0FBQ0g7QUFDSjtBQUNKLGFBUEQ7QUFRSDs7QUFFRCxlQUFPLEtBQUssWUFBWjtBQUNILEs7OzJCQUVELFEsdUJBQVc7QUFDUCxZQUFLLE9BQU8sS0FBSyxPQUFMLENBQWEsTUFBcEIsS0FBK0IsV0FBcEMsRUFBa0Q7QUFDOUMsbUJBQU8sS0FBSyxPQUFMLENBQWEsTUFBcEI7QUFDSDs7QUFFRCxZQUFJLGFBQWEsS0FBSyxPQUFMLENBQWEsVUFBOUI7QUFDQSxZQUFLLE9BQU8sVUFBUCxLQUFzQixXQUF0QixJQUFxQyxlQUFlLElBQXpELEVBQWdFO0FBQzVELG1CQUFPLEtBQVA7QUFDSDs7QUFFRCxZQUFLLEtBQUssUUFBTCxHQUFnQixNQUFyQixFQUE4QjtBQUMxQixtQkFBTyxLQUFLLFFBQUwsR0FBZ0IsSUFBaEIsQ0FBc0I7QUFBQSx1QkFBSyxFQUFFLE1BQVA7QUFBQSxhQUF0QixDQUFQO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsbUJBQU8sSUFBUDtBQUNIO0FBQ0osSzs7MkJBRUQsZ0IsK0JBQW1CO0FBQ2YsWUFBSyxPQUFPLEtBQUssT0FBTCxDQUFhLGNBQXBCLEtBQXVDLFdBQTVDLEVBQTBEO0FBQ3RELG1CQUFPLEtBQUssT0FBTCxDQUFhLGNBQXBCO0FBQ0g7QUFDRCxZQUFLLEtBQUssUUFBTCxHQUFnQixNQUFyQixFQUE4QjtBQUMxQixtQkFBTyxLQUFLLFFBQUwsR0FBZ0IsSUFBaEIsQ0FBc0I7QUFBQSx1QkFBSyxFQUFFLFdBQUYsRUFBTDtBQUFBLGFBQXRCLENBQVA7QUFDSCxTQUZELE1BRU87QUFDSCxtQkFBTyxJQUFQO0FBQ0g7QUFDSixLOzsyQkFFRCxlLDhCQUFrQjtBQUNkLFlBQUssS0FBSyxPQUFMLENBQWEsVUFBYixLQUE0QixLQUFqQyxFQUF5Qzs7QUFFekMsWUFBSSxhQUFKO0FBQ0EsYUFBTSxJQUFJLElBQUksS0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixNQUFoQixHQUF5QixDQUF2QyxFQUEwQyxLQUFLLENBQS9DLEVBQWtELEdBQWxELEVBQXdEO0FBQ3BELG1CQUFPLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FBUDtBQUNBLGdCQUFLLEtBQUssSUFBTCxLQUFjLFNBQW5CLEVBQStCO0FBQy9CLGdCQUFLLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IscUJBQWxCLE1BQTZDLENBQWxELEVBQXNEO0FBQ2xELHFCQUFLLElBQUwsQ0FBVSxXQUFWLENBQXNCLENBQXRCO0FBQ0g7QUFDSjtBQUNKLEs7OzJCQUVELGlCLGdDQUFvQjtBQUFBOztBQUNoQixZQUFJLFVBQVUsRUFBZDtBQUNBLGFBQUssSUFBTCxDQUFVLElBQVYsQ0FBZ0IsZ0JBQVE7QUFDcEIsZ0JBQUssS0FBSyxNQUFWLEVBQW1CO0FBQ2Ysb0JBQUksT0FBTyxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLElBQTdCO0FBQ0Esb0JBQUssUUFBUSxDQUFDLFFBQVEsSUFBUixDQUFkLEVBQThCO0FBQzFCLDRCQUFRLElBQVIsSUFBZ0IsSUFBaEI7QUFDQSx3QkFBSSxXQUFXLE9BQUssUUFBTCxDQUFjLElBQWQsQ0FBZjtBQUNBLDJCQUFLLEdBQUwsQ0FBUyxnQkFBVCxDQUEwQixRQUExQixFQUFvQyxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLEdBQXREO0FBQ0g7QUFDSjtBQUNKLFNBVEQ7QUFVSCxLOzsyQkFFRCxhLDRCQUFnQjtBQUNaLDZCQUFrQixLQUFLLFFBQUwsRUFBbEIsa0hBQW9DO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQSxnQkFBMUIsSUFBMEI7O0FBQ2hDLGdCQUFJLE9BQU8sS0FBSyxRQUFMLENBQWMsS0FBSyxJQUFuQixDQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQUwsSUFBYSxlQUFLLE9BQUwsQ0FBYSxLQUFLLElBQWxCLENBQXhCO0FBQ0EsZ0JBQUksWUFBSjs7QUFFQSxnQkFBSyxLQUFLLE9BQUwsQ0FBYSxjQUFiLEtBQWdDLEtBQXJDLEVBQTZDO0FBQ3pDLHNCQUFNLElBQUksb0JBQVEsaUJBQVosQ0FBOEIsS0FBSyxJQUFuQyxDQUFOO0FBQ0Esb0JBQUssSUFBSSxjQUFULEVBQTBCO0FBQ3RCLHdCQUFJLGNBQUosR0FBcUIsSUFBSSxjQUFKLENBQW1CLEdBQW5CLENBQXdCO0FBQUEsK0JBQU0sSUFBTjtBQUFBLHFCQUF4QixDQUFyQjtBQUNIO0FBQ0osYUFMRCxNQUtPO0FBQ0gsc0JBQU0sS0FBSyxRQUFMLEVBQU47QUFDSDs7QUFFRCxpQkFBSyxHQUFMLENBQVMsY0FBVCxDQUF3QixHQUF4QixFQUE2QixJQUE3QixFQUFtQyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW5DO0FBQ0g7QUFDSixLOzsyQkFFRCxZLDJCQUFlO0FBQ1gsWUFBSyxLQUFLLFFBQUwsRUFBTCxFQUF1QjtBQUNuQixtQkFBTyxJQUFQO0FBQ0gsU0FGRCxNQUVPLElBQUssT0FBTyxLQUFLLE9BQUwsQ0FBYSxVQUFwQixLQUFtQyxXQUF4QyxFQUFzRDtBQUN6RCxtQkFBTyxLQUFLLE9BQUwsQ0FBYSxVQUFwQjtBQUNILFNBRk0sTUFFQSxJQUFLLEtBQUssUUFBTCxHQUFnQixNQUFyQixFQUE4QjtBQUNqQyxtQkFBTyxLQUFLLFFBQUwsR0FBZ0IsSUFBaEIsQ0FBc0I7QUFBQSx1QkFBSyxFQUFFLFVBQVA7QUFBQSxhQUF0QixDQUFQO0FBQ0gsU0FGTSxNQUVBO0FBQ0gsbUJBQU8sSUFBUDtBQUNIO0FBQ0osSzs7MkJBRUQsYSw0QkFBZ0I7QUFDWixZQUFJLGdCQUFKOztBQUVBLFlBQUssS0FBSyxRQUFMLEVBQUwsRUFBdUI7QUFDbkIsc0JBQVUsa0NBQ0MsZUFBTyxNQUFQLENBQWUsS0FBSyxHQUFMLENBQVMsUUFBVCxFQUFmLENBRFg7QUFHSCxTQUpELE1BSU8sSUFBSyxPQUFPLEtBQUssT0FBTCxDQUFhLFVBQXBCLEtBQW1DLFFBQXhDLEVBQW1EO0FBQ3RELHNCQUFVLEtBQUssT0FBTCxDQUFhLFVBQXZCO0FBRUgsU0FITSxNQUdBO0FBQ0gsc0JBQVUsS0FBSyxVQUFMLEtBQW9CLE1BQTlCO0FBQ0g7O0FBRUQsWUFBSSxNQUFRLElBQVo7QUFDQSxZQUFLLEtBQUssR0FBTCxDQUFTLE9BQVQsQ0FBaUIsTUFBakIsTUFBNkIsQ0FBQyxDQUFuQyxFQUF1QyxNQUFNLE1BQU47O0FBRXZDLGFBQUssR0FBTCxJQUFZLE1BQU0sdUJBQU4sR0FBZ0MsT0FBaEMsR0FBMEMsS0FBdEQ7QUFDSCxLOzsyQkFFRCxVLHlCQUFhO0FBQ1QsWUFBSyxLQUFLLElBQUwsQ0FBVSxFQUFmLEVBQW9CO0FBQ2hCLG1CQUFPLEtBQUssUUFBTCxDQUFjLEtBQUssSUFBTCxDQUFVLEVBQXhCLENBQVA7QUFDSCxTQUZELE1BRU8sSUFBSyxLQUFLLElBQUwsQ0FBVSxJQUFmLEVBQXNCO0FBQ3pCLG1CQUFPLEtBQUssUUFBTCxDQUFjLEtBQUssSUFBTCxDQUFVLElBQXhCLENBQVA7QUFDSCxTQUZNLE1BRUE7QUFDSCxtQkFBTyxRQUFQO0FBQ0g7QUFDSixLOzsyQkFFRCxXLDBCQUFjO0FBQ1YsYUFBSyxjQUFMO0FBQ0EsWUFBSyxLQUFLLGdCQUFMLEVBQUwsRUFBa0MsS0FBSyxpQkFBTDtBQUNsQyxZQUFLLEtBQUssUUFBTCxHQUFnQixNQUFoQixHQUF5QixDQUE5QixFQUFrQyxLQUFLLGFBQUw7QUFDbEMsWUFBSyxLQUFLLFlBQUwsRUFBTCxFQUFrQyxLQUFLLGFBQUw7O0FBRWxDLFlBQUssS0FBSyxRQUFMLEVBQUwsRUFBdUI7QUFDbkIsbUJBQU8sQ0FBQyxLQUFLLEdBQU4sQ0FBUDtBQUNILFNBRkQsTUFFTztBQUNILG1CQUFPLENBQUMsS0FBSyxHQUFOLEVBQVcsS0FBSyxHQUFoQixDQUFQO0FBQ0g7QUFDSixLOzsyQkFFRCxRLHFCQUFTLEksRUFBTTtBQUNYLFlBQUssWUFBWSxJQUFaLENBQWlCLElBQWpCLENBQUwsRUFBOEIsT0FBTyxJQUFQOztBQUU5QixZQUFJLE9BQU8sS0FBSyxJQUFMLENBQVUsRUFBVixHQUFlLGVBQUssT0FBTCxDQUFhLEtBQUssSUFBTCxDQUFVLEVBQXZCLENBQWYsR0FBNEMsR0FBdkQ7O0FBRUEsWUFBSyxPQUFPLEtBQUssT0FBTCxDQUFhLFVBQXBCLEtBQW1DLFFBQXhDLEVBQW1EO0FBQy9DLG1CQUFPLGVBQUssT0FBTCxDQUFjLGVBQUssT0FBTCxDQUFhLElBQWIsRUFBbUIsS0FBSyxPQUFMLENBQWEsVUFBaEMsQ0FBZCxDQUFQO0FBQ0g7O0FBRUQsZUFBTyxlQUFLLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLElBQXBCLENBQVA7QUFDQSxZQUFLLGVBQUssR0FBTCxLQUFhLElBQWxCLEVBQXlCO0FBQ3JCLG1CQUFPLEtBQUssT0FBTCxDQUFhLEtBQWIsRUFBb0IsR0FBcEIsQ0FBUDtBQUNILFNBRkQsTUFFTztBQUNILG1CQUFPLElBQVA7QUFDSDtBQUNKLEs7OzJCQUVELFUsdUJBQVcsSSxFQUFNO0FBQ2IsWUFBSyxLQUFLLE9BQUwsQ0FBYSxJQUFsQixFQUF5QjtBQUNyQixtQkFBTyxLQUFLLE9BQUwsQ0FBYSxJQUFwQjtBQUNILFNBRkQsTUFFTztBQUNILG1CQUFPLEtBQUssUUFBTCxDQUFjLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsSUFBaEMsQ0FBUDtBQUNIO0FBQ0osSzs7MkJBRUQsYyw2QkFBaUI7QUFBQTs7QUFDYixhQUFLLEdBQUwsR0FBVyxFQUFYO0FBQ0EsYUFBSyxHQUFMLEdBQVcsSUFBSSxvQkFBUSxrQkFBWixDQUErQixFQUFFLE1BQU0sS0FBSyxVQUFMLEVBQVIsRUFBL0IsQ0FBWDs7QUFFQSxZQUFJLE9BQVMsQ0FBYjtBQUNBLFlBQUksU0FBUyxDQUFiOztBQUVBLFlBQUksY0FBSjtBQUFBLFlBQVcsYUFBWDtBQUNBLGFBQUssU0FBTCxDQUFlLEtBQUssSUFBcEIsRUFBMEIsVUFBQyxHQUFELEVBQU0sSUFBTixFQUFZLElBQVosRUFBcUI7QUFDM0MsbUJBQUssR0FBTCxJQUFZLEdBQVo7O0FBRUEsZ0JBQUssUUFBUSxTQUFTLEtBQXRCLEVBQThCO0FBQzFCLG9CQUFLLEtBQUssTUFBTCxJQUFlLEtBQUssTUFBTCxDQUFZLEtBQWhDLEVBQXdDO0FBQ3BDLDJCQUFLLEdBQUwsQ0FBUyxVQUFULENBQW9CO0FBQ2hCLGdDQUFXLE9BQUssVUFBTCxDQUFnQixJQUFoQixDQURLO0FBRWhCLG1DQUFXLEVBQUUsVUFBRixFQUFRLFFBQVEsU0FBUyxDQUF6QixFQUZLO0FBR2hCLGtDQUFXO0FBQ1Asa0NBQVEsS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixJQURuQjtBQUVQLG9DQUFRLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsTUFBbEIsR0FBMkI7QUFGNUI7QUFISyxxQkFBcEI7QUFRSCxpQkFURCxNQVNPO0FBQ0gsMkJBQUssR0FBTCxDQUFTLFVBQVQsQ0FBb0I7QUFDaEIsZ0NBQVcsYUFESztBQUVoQixrQ0FBVyxFQUFFLE1BQU0sQ0FBUixFQUFXLFFBQVEsQ0FBbkIsRUFGSztBQUdoQixtQ0FBVyxFQUFFLFVBQUYsRUFBUSxRQUFRLFNBQVMsQ0FBekI7QUFISyxxQkFBcEI7QUFLSDtBQUNKOztBQUVELG9CQUFRLElBQUksS0FBSixDQUFVLEtBQVYsQ0FBUjtBQUNBLGdCQUFLLEtBQUwsRUFBYTtBQUNULHdCQUFTLE1BQU0sTUFBZjtBQUNBLHVCQUFTLElBQUksV0FBSixDQUFnQixJQUFoQixDQUFUO0FBQ0EseUJBQVMsSUFBSSxNQUFKLEdBQWEsSUFBdEI7QUFDSCxhQUpELE1BSU87QUFDSCwwQkFBVSxJQUFJLE1BQWQ7QUFDSDs7QUFFRCxnQkFBSyxRQUFRLFNBQVMsT0FBdEIsRUFBZ0M7QUFDNUIsb0JBQUssS0FBSyxNQUFMLElBQWUsS0FBSyxNQUFMLENBQVksR0FBaEMsRUFBc0M7QUFDbEMsMkJBQUssR0FBTCxDQUFTLFVBQVQsQ0FBb0I7QUFDaEIsZ0NBQVcsT0FBSyxVQUFMLENBQWdCLElBQWhCLENBREs7QUFFaEIsbUNBQVcsRUFBRSxVQUFGLEVBQVEsUUFBUSxTQUFTLENBQXpCLEVBRks7QUFHaEIsa0NBQVc7QUFDUCxrQ0FBUSxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLElBRGpCO0FBRVAsb0NBQVEsS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQjtBQUZqQjtBQUhLLHFCQUFwQjtBQVFILGlCQVRELE1BU087QUFDSCwyQkFBSyxHQUFMLENBQVMsVUFBVCxDQUFvQjtBQUNoQixnQ0FBVyxhQURLO0FBRWhCLGtDQUFXLEVBQUUsTUFBTSxDQUFSLEVBQVcsUUFBUSxDQUFuQixFQUZLO0FBR2hCLG1DQUFXLEVBQUUsVUFBRixFQUFRLFFBQVEsU0FBUyxDQUF6QjtBQUhLLHFCQUFwQjtBQUtIO0FBQ0o7QUFDSixTQWpERDtBQWtESCxLOzsyQkFFRCxRLHVCQUFXO0FBQ1AsYUFBSyxlQUFMOztBQUVBLFlBQUssS0FBSyxLQUFMLEVBQUwsRUFBb0I7QUFDaEIsbUJBQU8sS0FBSyxXQUFMLEVBQVA7QUFDSCxTQUZELE1BRU87QUFDSCxnQkFBSSxTQUFTLEVBQWI7QUFDQSxpQkFBSyxTQUFMLENBQWUsS0FBSyxJQUFwQixFQUEwQixhQUFLO0FBQzNCLDBCQUFVLENBQVY7QUFDSCxhQUZEO0FBR0EsbUJBQU8sQ0FBQyxNQUFELENBQVA7QUFDSDtBQUNKLEs7Ozs7O2tCQW5RZ0IsWSIsImZpbGUiOiJtYXAtZ2VuZXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZTY0IH0gZnJvbSAnanMtYmFzZTY0JztcbmltcG9ydCAgIG1vemlsbGEgIGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0ICAgcGF0aCAgICAgZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcEdlbmVyYXRvciB7XG5cbiAgICBjb25zdHJ1Y3RvcihzdHJpbmdpZnksIHJvb3QsIG9wdHMpIHtcbiAgICAgICAgdGhpcy5zdHJpbmdpZnkgPSBzdHJpbmdpZnk7XG4gICAgICAgIHRoaXMubWFwT3B0cyAgID0gb3B0cy5tYXAgfHwgeyB9O1xuICAgICAgICB0aGlzLnJvb3QgICAgICA9IHJvb3Q7XG4gICAgICAgIHRoaXMub3B0cyAgICAgID0gb3B0cztcbiAgICB9XG5cbiAgICBpc01hcCgpIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgdGhpcy5vcHRzLm1hcCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gISF0aGlzLm9wdHMubWFwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKS5sZW5ndGggPiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJldmlvdXMoKSB7XG4gICAgICAgIGlmICggIXRoaXMucHJldmlvdXNNYXBzICkge1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c01hcHMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucm9vdC53YWxrKCBub2RlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIG5vZGUuc291cmNlICYmIG5vZGUuc291cmNlLmlucHV0Lm1hcCApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hcCA9IG5vZGUuc291cmNlLmlucHV0Lm1hcDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLnByZXZpb3VzTWFwcy5pbmRleE9mKG1hcCkgPT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2aW91c01hcHMucHVzaChtYXApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5wcmV2aW91c01hcHM7XG4gICAgfVxuXG4gICAgaXNJbmxpbmUoKSB7XG4gICAgICAgIGlmICggdHlwZW9mIHRoaXMubWFwT3B0cy5pbmxpbmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwT3B0cy5pbmxpbmU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYW5ub3RhdGlvbiA9IHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uO1xuICAgICAgICBpZiAoIHR5cGVvZiBhbm5vdGF0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhbm5vdGF0aW9uICE9PSB0cnVlICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCB0aGlzLnByZXZpb3VzKCkubGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKS5zb21lKCBpID0+IGkuaW5saW5lICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzU291cmNlc0NvbnRlbnQoKSB7XG4gICAgICAgIGlmICggdHlwZW9mIHRoaXMubWFwT3B0cy5zb3VyY2VzQ29udGVudCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBPcHRzLnNvdXJjZXNDb250ZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICggdGhpcy5wcmV2aW91cygpLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCkuc29tZSggaSA9PiBpLndpdGhDb250ZW50KCkgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJBbm5vdGF0aW9uKCkge1xuICAgICAgICBpZiAoIHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uID09PSBmYWxzZSApIHJldHVybjtcblxuICAgICAgICBsZXQgbm9kZTtcbiAgICAgICAgZm9yICggbGV0IGkgPSB0aGlzLnJvb3Qubm9kZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0gKSB7XG4gICAgICAgICAgICBub2RlID0gdGhpcy5yb290Lm5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKCBub2RlLnR5cGUgIT09ICdjb21tZW50JyApIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKCBub2RlLnRleHQuaW5kZXhPZignIyBzb3VyY2VNYXBwaW5nVVJMPScpID09PSAwICkge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5yZW1vdmVDaGlsZChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFNvdXJjZXNDb250ZW50KCkge1xuICAgICAgICBsZXQgYWxyZWFkeSA9IHsgfTtcbiAgICAgICAgdGhpcy5yb290LndhbGsoIG5vZGUgPT4ge1xuICAgICAgICAgICAgaWYgKCBub2RlLnNvdXJjZSApIHtcbiAgICAgICAgICAgICAgICBsZXQgZnJvbSA9IG5vZGUuc291cmNlLmlucHV0LmZyb207XG4gICAgICAgICAgICAgICAgaWYgKCBmcm9tICYmICFhbHJlYWR5W2Zyb21dICkge1xuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5W2Zyb21dID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gdGhpcy5yZWxhdGl2ZShmcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXAuc2V0U291cmNlQ29udGVudChyZWxhdGl2ZSwgbm9kZS5zb3VyY2UuaW5wdXQuY3NzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFwcGx5UHJldk1hcHMoKSB7XG4gICAgICAgIGZvciAoIGxldCBwcmV2IG9mIHRoaXMucHJldmlvdXMoKSApIHtcbiAgICAgICAgICAgIGxldCBmcm9tID0gdGhpcy5yZWxhdGl2ZShwcmV2LmZpbGUpO1xuICAgICAgICAgICAgbGV0IHJvb3QgPSBwcmV2LnJvb3QgfHwgcGF0aC5kaXJuYW1lKHByZXYuZmlsZSk7XG4gICAgICAgICAgICBsZXQgbWFwO1xuXG4gICAgICAgICAgICBpZiAoIHRoaXMubWFwT3B0cy5zb3VyY2VzQ29udGVudCA9PT0gZmFsc2UgKSB7XG4gICAgICAgICAgICAgICAgbWFwID0gbmV3IG1vemlsbGEuU291cmNlTWFwQ29uc3VtZXIocHJldi50ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAoIG1hcC5zb3VyY2VzQ29udGVudCApIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNvdXJjZXNDb250ZW50ID0gbWFwLnNvdXJjZXNDb250ZW50Lm1hcCggKCkgPT4gbnVsbCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWFwID0gcHJldi5jb25zdW1lcigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm1hcC5hcHBseVNvdXJjZU1hcChtYXAsIGZyb20sIHRoaXMucmVsYXRpdmUocm9vdCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNBbm5vdGF0aW9uKCkge1xuICAgICAgICBpZiAoIHRoaXMuaXNJbmxpbmUoKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgdGhpcy5tYXBPcHRzLmFubm90YXRpb24gIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uO1xuICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnByZXZpb3VzKCkubGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKS5zb21lKCBpID0+IGkuYW5ub3RhdGlvbiApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRBbm5vdGF0aW9uKCkge1xuICAgICAgICBsZXQgY29udGVudDtcblxuICAgICAgICBpZiAoIHRoaXMuaXNJbmxpbmUoKSApIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAnZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCwnICtcbiAgICAgICAgICAgICAgICAgICAgICAgQmFzZTY0LmVuY29kZSggdGhpcy5tYXAudG9TdHJpbmcoKSApO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiB0aGlzLm1hcE9wdHMuYW5ub3RhdGlvbiA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gdGhpcy5tYXBPcHRzLmFubm90YXRpb247XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLm91dHB1dEZpbGUoKSArICcubWFwJztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlb2wgICA9ICdcXG4nO1xuICAgICAgICBpZiAoIHRoaXMuY3NzLmluZGV4T2YoJ1xcclxcbicpICE9PSAtMSApIGVvbCA9ICdcXHJcXG4nO1xuXG4gICAgICAgIHRoaXMuY3NzICs9IGVvbCArICcvKiMgc291cmNlTWFwcGluZ1VSTD0nICsgY29udGVudCArICcgKi8nO1xuICAgIH1cblxuICAgIG91dHB1dEZpbGUoKSB7XG4gICAgICAgIGlmICggdGhpcy5vcHRzLnRvICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRpdmUodGhpcy5vcHRzLnRvKTtcbiAgICAgICAgfSBlbHNlIGlmICggdGhpcy5vcHRzLmZyb20gKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWxhdGl2ZSh0aGlzLm9wdHMuZnJvbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RvLmNzcyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZU1hcCgpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVN0cmluZygpO1xuICAgICAgICBpZiAoIHRoaXMuaXNTb3VyY2VzQ29udGVudCgpICkgICAgdGhpcy5zZXRTb3VyY2VzQ29udGVudCgpO1xuICAgICAgICBpZiAoIHRoaXMucHJldmlvdXMoKS5sZW5ndGggPiAwICkgdGhpcy5hcHBseVByZXZNYXBzKCk7XG4gICAgICAgIGlmICggdGhpcy5pc0Fubm90YXRpb24oKSApICAgICAgICB0aGlzLmFkZEFubm90YXRpb24oKTtcblxuICAgICAgICBpZiAoIHRoaXMuaXNJbmxpbmUoKSApIHtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5jc3NdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLmNzcywgdGhpcy5tYXBdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVsYXRpdmUoZmlsZSkge1xuICAgICAgICBpZiAoIC9eXFx3KzpcXC9cXC8vLnRlc3QoZmlsZSkgKSByZXR1cm4gZmlsZTtcblxuICAgICAgICBsZXQgZnJvbSA9IHRoaXMub3B0cy50byA/IHBhdGguZGlybmFtZSh0aGlzLm9wdHMudG8pIDogJy4nO1xuXG4gICAgICAgIGlmICggdHlwZW9mIHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgIGZyb20gPSBwYXRoLmRpcm5hbWUoIHBhdGgucmVzb2x2ZShmcm9tLCB0aGlzLm1hcE9wdHMuYW5ub3RhdGlvbikgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGUgPSBwYXRoLnJlbGF0aXZlKGZyb20sIGZpbGUpO1xuICAgICAgICBpZiAoIHBhdGguc2VwID09PSAnXFxcXCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvdXJjZVBhdGgobm9kZSkge1xuICAgICAgICBpZiAoIHRoaXMubWFwT3B0cy5mcm9tICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwT3B0cy5mcm9tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRpdmUobm9kZS5zb3VyY2UuaW5wdXQuZnJvbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZVN0cmluZygpIHtcbiAgICAgICAgdGhpcy5jc3MgPSAnJztcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgbW96aWxsYS5Tb3VyY2VNYXBHZW5lcmF0b3IoeyBmaWxlOiB0aGlzLm91dHB1dEZpbGUoKSB9KTtcblxuICAgICAgICBsZXQgbGluZSAgID0gMTtcbiAgICAgICAgbGV0IGNvbHVtbiA9IDE7XG5cbiAgICAgICAgbGV0IGxpbmVzLCBsYXN0O1xuICAgICAgICB0aGlzLnN0cmluZ2lmeSh0aGlzLnJvb3QsIChzdHIsIG5vZGUsIHR5cGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3NzICs9IHN0cjtcblxuICAgICAgICAgICAgaWYgKCBub2RlICYmIHR5cGUgIT09ICdlbmQnICkge1xuICAgICAgICAgICAgICAgIGlmICggbm9kZS5zb3VyY2UgJiYgbm9kZS5zb3VyY2Uuc3RhcnQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiAgICB0aGlzLnNvdXJjZVBhdGgobm9kZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZSwgY29sdW1uOiBjb2x1bW4gLSAxIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lOiAgIG5vZGUuc291cmNlLnN0YXJ0LmxpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBub2RlLnNvdXJjZS5zdGFydC5jb2x1bW4gLSAxXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiAgICAnPG5vIHNvdXJjZT4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6ICB7IGxpbmU6IDEsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmUsIGNvbHVtbjogY29sdW1uIC0gMSB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGluZXMgPSBzdHIubWF0Y2goL1xcbi9nKTtcbiAgICAgICAgICAgIGlmICggbGluZXMgKSB7XG4gICAgICAgICAgICAgICAgbGluZSAgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGxhc3QgICA9IHN0ci5sYXN0SW5kZXhPZignXFxuJyk7XG4gICAgICAgICAgICAgICAgY29sdW1uID0gc3RyLmxlbmd0aCAtIGxhc3Q7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbHVtbiArPSBzdHIubGVuZ3RoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIG5vZGUgJiYgdHlwZSAhPT0gJ3N0YXJ0JyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIG5vZGUuc291cmNlICYmIG5vZGUuc291cmNlLmVuZCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICAgIHRoaXMuc291cmNlUGF0aChub2RlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lLCBjb2x1bW46IGNvbHVtbiAtIDEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6ICAgbm9kZS5zb3VyY2UuZW5kLmxpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBub2RlLnNvdXJjZS5lbmQuY29sdW1uXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiAgICAnPG5vIHNvdXJjZT4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6ICB7IGxpbmU6IDEsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmUsIGNvbHVtbjogY29sdW1uIC0gMSB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJBbm5vdGF0aW9uKCk7XG5cbiAgICAgICAgaWYgKCB0aGlzLmlzTWFwKCkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZU1hcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgdGhpcy5zdHJpbmdpZnkodGhpcy5yb290LCBpID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gaTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIFtyZXN1bHRdO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
