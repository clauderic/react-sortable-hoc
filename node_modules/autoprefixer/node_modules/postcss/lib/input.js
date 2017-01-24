'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cssSyntaxError = require('./css-syntax-error');

var _cssSyntaxError2 = _interopRequireDefault(_cssSyntaxError);

var _previousMap = require('./previous-map');

var _previousMap2 = _interopRequireDefault(_previousMap);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sequence = 0;

/**
 * @typedef  {object} filePosition
 * @property {string} file   - path to file
 * @property {number} line   - source line in file
 * @property {number} column - source column in file
 */

/**
 * Represents the source CSS.
 *
 * @example
 * const root  = postcss.parse(css, { from: file });
 * const input = root.source.input;
 */

var Input = function () {

    /**
     * @param {string} css    - input CSS source
     * @param {object} [opts] - {@link Processor#process} options
     */
    function Input(css) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Input);

        /**
         * @member {string} - input CSS source
         *
         * @example
         * const input = postcss.parse('a{}', { from: file }).input;
         * input.css //=> "a{}";
         */
        this.css = css.toString();

        if (this.css[0] === '﻿' || this.css[0] === '￾') {
            this.css = this.css.slice(1);
        }

        if (opts.from) {
            if (/^\w+:\/\//.test(opts.from)) {
                /**
                 * @member {string} - The absolute path to the CSS source file
                 *                    defined with the `from` option.
                 *
                 * @example
                 * const root = postcss.parse(css, { from: 'a.css' });
                 * root.source.input.file //=> '/home/ai/a.css'
                 */
                this.file = opts.from;
            } else {
                this.file = _path2.default.resolve(opts.from);
            }
        }

        var map = new _previousMap2.default(this.css, opts);
        if (map.text) {
            /**
             * @member {PreviousMap} - The input source map passed from
             *                         a compilation step before PostCSS
             *                         (for example, from Sass compiler).
             *
             * @example
             * root.source.input.map.consumer().sources //=> ['a.sass']
             */
            this.map = map;
            var file = map.consumer().file;
            if (!this.file && file) this.file = this.mapResolve(file);
        }

        if (!this.file) {
            sequence += 1;
            /**
             * @member {string} - The unique ID of the CSS source. It will be
             *                    created if `from` option is not provided
             *                    (because PostCSS does not know the file path).
             *
             * @example
             * const root = postcss.parse(css);
             * root.source.input.file //=> undefined
             * root.source.input.id   //=> "<input css 1>"
             */
            this.id = '<input css ' + sequence + '>';
        }
        if (this.map) this.map.file = this.from;
    }

    Input.prototype.error = function error(message, line, column) {
        var opts = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

        var result = void 0;
        var origin = this.origin(line, column);
        if (origin) {
            result = new _cssSyntaxError2.default(message, origin.line, origin.column, origin.source, origin.file, opts.plugin);
        } else {
            result = new _cssSyntaxError2.default(message, line, column, this.css, this.file, opts.plugin);
        }

        result.input = { line: line, column: column, source: this.css };
        if (this.file) result.input.file = this.file;

        return result;
    };

    /**
     * Reads the input source map and returns a symbol position
     * in the input source (e.g., in a Sass file that was compiled
     * to CSS before being passed to PostCSS).
     *
     * @param {number} line   - line in input CSS
     * @param {number} column - column in input CSS
     *
     * @return {filePosition} position in input source
     *
     * @example
     * root.source.input.origin(1, 1) //=> { file: 'a.css', line: 3, column: 1 }
     */


    Input.prototype.origin = function origin(line, column) {
        if (!this.map) return false;
        var consumer = this.map.consumer();

        var from = consumer.originalPositionFor({ line: line, column: column });
        if (!from.source) return false;

        var result = {
            file: this.mapResolve(from.source),
            line: from.line,
            column: from.column
        };

        var source = consumer.sourceContentFor(from.source);
        if (source) result.source = source;

        return result;
    };

    Input.prototype.mapResolve = function mapResolve(file) {
        if (/^\w+:\/\//.test(file)) {
            return file;
        } else {
            return _path2.default.resolve(this.map.consumer().sourceRoot || '.', file);
        }
    };

    /**
     * The CSS source identifier. Contains {@link Input#file} if the user
     * set the `from` option, or {@link Input#id} if they did not.
     * @type {string}
     *
     * @example
     * const root = postcss.parse(css, { from: 'a.css' });
     * root.source.input.from //=> "/home/ai/a.css"
     *
     * const root = postcss.parse(css);
     * root.source.input.from //=> "<input css 1>"
     */


    _createClass(Input, [{
        key: 'from',
        get: function get() {
            return this.file || this.id;
        }
    }]);

    return Input;
}();

exports.default = Input;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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UDs7QUFFcEIsWUFBSSxTQUFTO0FBQ1Qsa0JBQVEsS0FBSyxVQUFMLENBQWdCLEtBQUssTUFBckIsQ0FEQztBQUVULGtCQUFRLEtBQUssSUFGSjtBQUdULG9CQUFRLEtBQUs7QUFISixTQUFiOztBQU1BLFlBQUksU0FBUyxTQUFTLGdCQUFULENBQTBCLEtBQUssTUFBL0IsQ0FBYjtBQUNBLFlBQUssTUFBTCxFQUFjLE9BQU8sTUFBUCxHQUFnQixNQUFoQjs7QUFFZCxlQUFPLE1BQVA7QUFDSCxLOztvQkFFRCxVLHVCQUFXLEksRUFBTTtBQUNiLFlBQUssWUFBWSxJQUFaLENBQWlCLElBQWpCLENBQUwsRUFBOEI7QUFDMUIsbUJBQU8sSUFBUDtBQUNILFNBRkQsTUFFTztBQUNILG1CQUFPLGVBQUssT0FBTCxDQUFhLEtBQUssR0FBTCxDQUFTLFFBQVQsR0FBb0IsVUFBcEIsSUFBa0MsR0FBL0MsRUFBb0QsSUFBcEQsQ0FBUDtBQUNIO0FBQ0osSzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFZVztBQUNQLG1CQUFPLEtBQUssSUFBTCxJQUFhLEtBQUssRUFBekI7QUFDSDs7Ozs7O2tCQUlVLEsiLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ3NzU3ludGF4RXJyb3IgZnJvbSAnLi9jc3Mtc3ludGF4LWVycm9yJztcbmltcG9ydCBQcmV2aW91c01hcCAgICBmcm9tICcuL3ByZXZpb3VzLW1hcCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5sZXQgc2VxdWVuY2UgPSAwO1xuXG4vKipcbiAqIEB0eXBlZGVmICB7b2JqZWN0fSBmaWxlUG9zaXRpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBmaWxlICAgLSBwYXRoIHRvIGZpbGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsaW5lICAgLSBzb3VyY2UgbGluZSBpbiBmaWxlXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29sdW1uIC0gc291cmNlIGNvbHVtbiBpbiBmaWxlXG4gKi9cblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBzb3VyY2UgQ1NTLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCByb290ICA9IHBvc3Rjc3MucGFyc2UoY3NzLCB7IGZyb206IGZpbGUgfSk7XG4gKiBjb25zdCBpbnB1dCA9IHJvb3Quc291cmNlLmlucHV0O1xuICovXG5jbGFzcyBJbnB1dCB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY3NzICAgIC0gaW5wdXQgQ1NTIHNvdXJjZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0c10gLSB7QGxpbmsgUHJvY2Vzc29yI3Byb2Nlc3N9IG9wdGlvbnNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjc3MsIG9wdHMgPSB7IH0pIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBpbnB1dCBDU1Mgc291cmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGNvbnN0IGlucHV0ID0gcG9zdGNzcy5wYXJzZSgnYXt9JywgeyBmcm9tOiBmaWxlIH0pLmlucHV0O1xuICAgICAgICAgKiBpbnB1dC5jc3MgLy89PiBcImF7fVwiO1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jc3MgPSBjc3MudG9TdHJpbmcoKTtcblxuICAgICAgICBpZiAoIHRoaXMuY3NzWzBdID09PSAnXFx1RkVGRicgfHwgdGhpcy5jc3NbMF0gPT09ICdcXHVGRkZFJyApIHtcbiAgICAgICAgICAgIHRoaXMuY3NzID0gdGhpcy5jc3Muc2xpY2UoMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIG9wdHMuZnJvbSApIHtcbiAgICAgICAgICAgIGlmICggL15cXHcrOlxcL1xcLy8udGVzdChvcHRzLmZyb20pICkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBUaGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgQ1NTIHNvdXJjZSBmaWxlXG4gICAgICAgICAgICAgICAgICogICAgICAgICAgICAgICAgICAgIGRlZmluZWQgd2l0aCB0aGUgYGZyb21gIG9wdGlvbi5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgICAgICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoY3NzLCB7IGZyb206ICdhLmNzcycgfSk7XG4gICAgICAgICAgICAgICAgICogcm9vdC5zb3VyY2UuaW5wdXQuZmlsZSAvLz0+ICcvaG9tZS9haS9hLmNzcydcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB0aGlzLmZpbGUgPSBvcHRzLmZyb207XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsZSA9IHBhdGgucmVzb2x2ZShvcHRzLmZyb20pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hcCA9IG5ldyBQcmV2aW91c01hcCh0aGlzLmNzcywgb3B0cyk7XG4gICAgICAgIGlmICggbWFwLnRleHQgKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge1ByZXZpb3VzTWFwfSAtIFRoZSBpbnB1dCBzb3VyY2UgbWFwIHBhc3NlZCBmcm9tXG4gICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBhIGNvbXBpbGF0aW9uIHN0ZXAgYmVmb3JlIFBvc3RDU1NcbiAgICAgICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIChmb3IgZXhhbXBsZSwgZnJvbSBTYXNzIGNvbXBpbGVyKS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogcm9vdC5zb3VyY2UuaW5wdXQubWFwLmNvbnN1bWVyKCkuc291cmNlcyAvLz0+IFsnYS5zYXNzJ11cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5tYXAgPSBtYXA7XG4gICAgICAgICAgICBsZXQgZmlsZSA9IG1hcC5jb25zdW1lcigpLmZpbGU7XG4gICAgICAgICAgICBpZiAoICF0aGlzLmZpbGUgJiYgZmlsZSApIHRoaXMuZmlsZSA9IHRoaXMubWFwUmVzb2x2ZShmaWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggIXRoaXMuZmlsZSApIHtcbiAgICAgICAgICAgIHNlcXVlbmNlICs9IDE7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBUaGUgdW5pcXVlIElEIG9mIHRoZSBDU1Mgc291cmNlLiBJdCB3aWxsIGJlXG4gICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZCBpZiBgZnJvbWAgb3B0aW9uIGlzIG5vdCBwcm92aWRlZFxuICAgICAgICAgICAgICogICAgICAgICAgICAgICAgICAgIChiZWNhdXNlIFBvc3RDU1MgZG9lcyBub3Qga25vdyB0aGUgZmlsZSBwYXRoKS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoY3NzKTtcbiAgICAgICAgICAgICAqIHJvb3Quc291cmNlLmlucHV0LmZpbGUgLy89PiB1bmRlZmluZWRcbiAgICAgICAgICAgICAqIHJvb3Quc291cmNlLmlucHV0LmlkICAgLy89PiBcIjxpbnB1dCBjc3MgMT5cIlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmlkICAgPSAnPGlucHV0IGNzcyAnICsgc2VxdWVuY2UgKyAnPic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0aGlzLm1hcCApIHRoaXMubWFwLmZpbGUgPSB0aGlzLmZyb207XG4gICAgfVxuXG4gICAgZXJyb3IobWVzc2FnZSwgbGluZSwgY29sdW1uLCBvcHRzID0geyB9KSB7XG4gICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgIGxldCBvcmlnaW4gPSB0aGlzLm9yaWdpbihsaW5lLCBjb2x1bW4pO1xuICAgICAgICBpZiAoIG9yaWdpbiApIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBDc3NTeW50YXhFcnJvcihtZXNzYWdlLCBvcmlnaW4ubGluZSwgb3JpZ2luLmNvbHVtbixcbiAgICAgICAgICAgICAgICBvcmlnaW4uc291cmNlLCBvcmlnaW4uZmlsZSwgb3B0cy5wbHVnaW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IENzc1N5bnRheEVycm9yKG1lc3NhZ2UsIGxpbmUsIGNvbHVtbixcbiAgICAgICAgICAgICAgICB0aGlzLmNzcywgdGhpcy5maWxlLCBvcHRzLnBsdWdpbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQuaW5wdXQgPSB7IGxpbmUsIGNvbHVtbiwgc291cmNlOiB0aGlzLmNzcyB9O1xuICAgICAgICBpZiAoIHRoaXMuZmlsZSApIHJlc3VsdC5pbnB1dC5maWxlID0gdGhpcy5maWxlO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhZHMgdGhlIGlucHV0IHNvdXJjZSBtYXAgYW5kIHJldHVybnMgYSBzeW1ib2wgcG9zaXRpb25cbiAgICAgKiBpbiB0aGUgaW5wdXQgc291cmNlIChlLmcuLCBpbiBhIFNhc3MgZmlsZSB0aGF0IHdhcyBjb21waWxlZFxuICAgICAqIHRvIENTUyBiZWZvcmUgYmVpbmcgcGFzc2VkIHRvIFBvc3RDU1MpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxpbmUgICAtIGxpbmUgaW4gaW5wdXQgQ1NTXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbHVtbiAtIGNvbHVtbiBpbiBpbnB1dCBDU1NcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2ZpbGVQb3NpdGlvbn0gcG9zaXRpb24gaW4gaW5wdXQgc291cmNlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJvb3Quc291cmNlLmlucHV0Lm9yaWdpbigxLCAxKSAvLz0+IHsgZmlsZTogJ2EuY3NzJywgbGluZTogMywgY29sdW1uOiAxIH1cbiAgICAgKi9cbiAgICBvcmlnaW4obGluZSwgY29sdW1uKSB7XG4gICAgICAgIGlmICggIXRoaXMubWFwICkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBsZXQgY29uc3VtZXIgPSB0aGlzLm1hcC5jb25zdW1lcigpO1xuXG4gICAgICAgIGxldCBmcm9tID0gY29uc3VtZXIub3JpZ2luYWxQb3NpdGlvbkZvcih7IGxpbmUsIGNvbHVtbiB9KTtcbiAgICAgICAgaWYgKCAhZnJvbS5zb3VyY2UgKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGZpbGU6ICAgdGhpcy5tYXBSZXNvbHZlKGZyb20uc291cmNlKSxcbiAgICAgICAgICAgIGxpbmU6ICAgZnJvbS5saW5lLFxuICAgICAgICAgICAgY29sdW1uOiBmcm9tLmNvbHVtblxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBzb3VyY2UgPSBjb25zdW1lci5zb3VyY2VDb250ZW50Rm9yKGZyb20uc291cmNlKTtcbiAgICAgICAgaWYgKCBzb3VyY2UgKSByZXN1bHQuc291cmNlID0gc291cmNlO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgbWFwUmVzb2x2ZShmaWxlKSB7XG4gICAgICAgIGlmICggL15cXHcrOlxcL1xcLy8udGVzdChmaWxlKSApIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgucmVzb2x2ZSh0aGlzLm1hcC5jb25zdW1lcigpLnNvdXJjZVJvb3QgfHwgJy4nLCBmaWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBDU1Mgc291cmNlIGlkZW50aWZpZXIuIENvbnRhaW5zIHtAbGluayBJbnB1dCNmaWxlfSBpZiB0aGUgdXNlclxuICAgICAqIHNldCB0aGUgYGZyb21gIG9wdGlvbiwgb3Ige0BsaW5rIElucHV0I2lkfSBpZiB0aGV5IGRpZCBub3QuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoY3NzLCB7IGZyb206ICdhLmNzcycgfSk7XG4gICAgICogcm9vdC5zb3VyY2UuaW5wdXQuZnJvbSAvLz0+IFwiL2hvbWUvYWkvYS5jc3NcIlxuICAgICAqXG4gICAgICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoY3NzKTtcbiAgICAgKiByb290LnNvdXJjZS5pbnB1dC5mcm9tIC8vPT4gXCI8aW5wdXQgY3NzIDE+XCJcbiAgICAgKi9cbiAgICBnZXQgZnJvbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsZSB8fCB0aGlzLmlkO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnB1dDtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
