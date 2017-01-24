'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _supportsColor = require('supports-color');

var _supportsColor2 = _interopRequireDefault(_supportsColor);

var _warnOnce = require('./warn-once');

var _warnOnce2 = _interopRequireDefault(_warnOnce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The CSS parser throws this error for broken CSS.
 *
 * Custom parsers can throw this error for broken custom syntax using
 * the {@link Node#error} method.
 *
 * PostCSS will use the input source map to detect the original error location.
 * If you wrote a Sass file, compiled it to CSS and then parsed it with PostCSS,
 * PostCSS will show the original position in the Sass file.
 *
 * If you need the position in the PostCSS input
 * (e.g., to debug the previous compiler), use `error.input.file`.
 *
 * @example
 * // Catching and checking syntax error
 * try {
 *   postcss.parse('a{')
 * } catch (error) {
 *   if ( error.name === 'CssSyntaxError' ) {
 *     error //=> CssSyntaxError
 *   }
 * }
 *
 * @example
 * // Raising error from plugin
 * throw node.error('Unknown variable', { plugin: 'postcss-vars' });
 */
var CssSyntaxError = function () {

    /**
     * @param {string} message  - error message
     * @param {number} [line]   - source line of the error
     * @param {number} [column] - source column of the error
     * @param {string} [source] - source code of the broken file
     * @param {string} [file]   - absolute path to the broken file
     * @param {string} [plugin] - PostCSS plugin name, if error came from plugin
     */
    function CssSyntaxError(message, line, column, source, file, plugin) {
        _classCallCheck(this, CssSyntaxError);

        /**
         * @member {string} - Always equal to `'CssSyntaxError'`. You should
         *                    always check error type
         *                    by `error.name === 'CssSyntaxError'` instead of
         *                    `error instanceof CssSyntaxError`, because
         *                    npm could have several PostCSS versions.
         *
         * @example
         * if ( error.name === 'CssSyntaxError' ) {
         *   error //=> CssSyntaxError
         * }
         */
        this.name = 'CssSyntaxError';
        /**
         * @member {string} - Error message.
         *
         * @example
         * error.message //=> 'Unclosed block'
         */
        this.reason = message;

        if (file) {
            /**
             * @member {string} - Absolute path to the broken file.
             *
             * @example
             * error.file       //=> 'a.sass'
             * error.input.file //=> 'a.css'
             */
            this.file = file;
        }
        if (source) {
            /**
             * @member {string} - Source code of the broken file.
             *
             * @example
             * error.source       //=> 'a { b {} }'
             * error.input.column //=> 'a b { }'
             */
            this.source = source;
        }
        if (plugin) {
            /**
             * @member {string} - Plugin name, if error came from plugin.
             *
             * @example
             * error.plugin //=> 'postcss-vars'
             */
            this.plugin = plugin;
        }
        if (typeof line !== 'undefined' && typeof column !== 'undefined') {
            /**
             * @member {number} - Source line of the error.
             *
             * @example
             * error.line       //=> 2
             * error.input.line //=> 4
             */
            this.line = line;
            /**
             * @member {number} - Source column of the error.
             *
             * @example
             * error.column       //=> 1
             * error.input.column //=> 4
             */
            this.column = column;
        }

        this.setMessage();

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CssSyntaxError);
        }
    }

    CssSyntaxError.prototype.setMessage = function setMessage() {
        /**
         * @member {string} - Full error text in the GNU error format
         *                    with plugin, file, line and column.
         *
         * @example
         * error.message //=> 'a.css:1:1: Unclosed block'
         */
        this.message = this.plugin ? this.plugin + ': ' : '';
        this.message += this.file ? this.file : '<css input>';
        if (typeof this.line !== 'undefined') {
            this.message += ':' + this.line + ':' + this.column;
        }
        this.message += ': ' + this.reason;
    };

    /**
     * Returns a few lines of CSS source that caused the error.
     *
     * If the CSS has an input source map without `sourceContent`,
     * this method will return an empty string.
     *
     * @param {boolean} [color] whether arrow will be colored red by terminal
     *                          color codes. By default, PostCSS will detect
     *                          color support by `process.stdout.isTTY`
     *                          and `process.env.NODE_DISABLE_COLORS`.
     *
     * @example
     * error.showSourceCode() //=> "a {
     *                        //      bad
     *                        //      ^
     *                        //    }"
     *
     * @return {string} few lines of CSS source that caused the error
     */


    CssSyntaxError.prototype.showSourceCode = function showSourceCode(color) {
        if (!this.source) return '';

        var num = this.line - 1;
        var lines = this.source.split('\n');

        var prev = num > 0 ? lines[num - 1] + '\n' : '';
        var broken = lines[num];
        var next = num < lines.length - 1 ? '\n' + lines[num + 1] : '';

        var mark = '\n';
        for (var i = 0; i < this.column - 1; i++) {
            mark += ' ';
        }

        if (typeof color === 'undefined') color = _supportsColor2.default;
        if (color) {
            mark += '\x1B[1;31m^\x1B[0m';
        } else {
            mark += '^';
        }

        return '\n' + prev + broken + mark + next;
    };

    /**
     * Returns error position, message and source code of the broken part.
     *
     * @example
     * error.toString() //=> "CssSyntaxError: app.css:1:1: Unclosed block
     *                  //    a {
     *                  //    ^"
     *
     * @return {string} error position, message and source code
     */


    CssSyntaxError.prototype.toString = function toString() {
        return this.name + ': ' + this.message + this.showSourceCode();
    };

    _createClass(CssSyntaxError, [{
        key: 'generated',
        get: function get() {
            (0, _warnOnce2.default)('CssSyntaxError#generated is depreacted. Use input instead.');
            return this.input;
        }

        /**
         * @memberof CssSyntaxError#
         * @member {Input} input - Input object with PostCSS internal information
         *                         about input file. If input has source map
         *                         from previous tool, PostCSS will use origin
         *                         (for example, Sass) source. You can use this
         *                         object to get PostCSS input source.
         *
         * @example
         * error.input.file //=> 'a.css'
         * error.file       //=> 'a.sass'
         */

    }]);

    return CssSyntaxError;
}();

exports.default = CssSyntaxError;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNzcy1zeW50YXgtZXJyb3IuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTJCTSxjOztBQUVGOzs7Ozs7OztBQVFBLDRCQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsTUFBM0IsRUFBbUMsTUFBbkMsRUFBMkMsSUFBM0MsRUFBaUQsTUFBakQsRUFBeUQ7QUFBQTs7QUFDckQ7Ozs7Ozs7Ozs7OztBQVlBLGFBQUssSUFBTCxHQUFjLGdCQUFkO0FBQ0E7Ozs7OztBQU1BLGFBQUssTUFBTCxHQUFjLE9BQWQ7O0FBRUEsWUFBSyxJQUFMLEVBQVk7QUFDUjs7Ozs7OztBQU9BLGlCQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0g7QUFDRCxZQUFLLE1BQUwsRUFBYztBQUNWOzs7Ozs7O0FBT0EsaUJBQUssTUFBTCxHQUFjLE1BQWQ7QUFDSDtBQUNELFlBQUssTUFBTCxFQUFjO0FBQ1Y7Ozs7OztBQU1BLGlCQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0g7QUFDRCxZQUFLLE9BQU8sSUFBUCxLQUFnQixXQUFoQixJQUErQixPQUFPLE1BQVAsS0FBa0IsV0FBdEQsRUFBb0U7QUFDaEU7Ozs7Ozs7QUFPQSxpQkFBSyxJQUFMLEdBQWMsSUFBZDtBQUNBOzs7Ozs7O0FBT0EsaUJBQUssTUFBTCxHQUFjLE1BQWQ7QUFDSDs7QUFFRCxhQUFLLFVBQUw7O0FBRUEsWUFBSyxNQUFNLGlCQUFYLEVBQStCO0FBQzNCLGtCQUFNLGlCQUFOLENBQXdCLElBQXhCLEVBQThCLGNBQTlCO0FBQ0g7QUFDSjs7NkJBRUQsVSx5QkFBYTtBQUNUOzs7Ozs7O0FBT0EsYUFBSyxPQUFMLEdBQWdCLEtBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxHQUFjLElBQTVCLEdBQW1DLEVBQW5EO0FBQ0EsYUFBSyxPQUFMLElBQWdCLEtBQUssSUFBTCxHQUFZLEtBQUssSUFBakIsR0FBd0IsYUFBeEM7QUFDQSxZQUFLLE9BQU8sS0FBSyxJQUFaLEtBQXFCLFdBQTFCLEVBQXdDO0FBQ3BDLGlCQUFLLE9BQUwsSUFBZ0IsTUFBTSxLQUFLLElBQVgsR0FBa0IsR0FBbEIsR0FBd0IsS0FBSyxNQUE3QztBQUNIO0FBQ0QsYUFBSyxPQUFMLElBQWdCLE9BQU8sS0FBSyxNQUE1QjtBQUNILEs7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFtQkEsYywyQkFBZSxLLEVBQU87QUFDbEIsWUFBSyxDQUFDLEtBQUssTUFBWCxFQUFvQixPQUFPLEVBQVA7O0FBRXBCLFlBQUksTUFBUSxLQUFLLElBQUwsR0FBWSxDQUF4QjtBQUNBLFlBQUksUUFBUSxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLElBQWxCLENBQVo7O0FBRUEsWUFBSSxPQUFTLE1BQU0sQ0FBTixHQUFVLE1BQU0sTUFBTSxDQUFaLElBQWlCLElBQTNCLEdBQWtDLEVBQS9DO0FBQ0EsWUFBSSxTQUFTLE1BQU0sR0FBTixDQUFiO0FBQ0EsWUFBSSxPQUFTLE1BQU0sTUFBTSxNQUFOLEdBQWUsQ0FBckIsR0FBeUIsT0FBTyxNQUFNLE1BQU0sQ0FBWixDQUFoQyxHQUFpRCxFQUE5RDs7QUFFQSxZQUFJLE9BQU8sSUFBWDtBQUNBLGFBQU0sSUFBSSxJQUFJLENBQWQsRUFBaUIsSUFBSSxLQUFLLE1BQUwsR0FBYyxDQUFuQyxFQUFzQyxHQUF0QyxFQUE0QztBQUN4QyxvQkFBUSxHQUFSO0FBQ0g7O0FBRUQsWUFBSyxPQUFPLEtBQVAsS0FBaUIsV0FBdEIsRUFBb0M7QUFDcEMsWUFBSyxLQUFMLEVBQWE7QUFDVCxvQkFBUSxvQkFBUjtBQUNILFNBRkQsTUFFTztBQUNILG9CQUFRLEdBQVI7QUFDSDs7QUFFRCxlQUFPLE9BQU8sSUFBUCxHQUFjLE1BQWQsR0FBdUIsSUFBdkIsR0FBOEIsSUFBckM7QUFDSCxLOztBQUVEOzs7Ozs7Ozs7Ozs7NkJBVUEsUSx1QkFBVztBQUNQLGVBQU8sS0FBSyxJQUFMLEdBQVksSUFBWixHQUFtQixLQUFLLE9BQXhCLEdBQWtDLEtBQUssY0FBTCxFQUF6QztBQUNILEs7Ozs7NEJBRWU7QUFDWixvQ0FBUyw0REFBVDtBQUNBLG1CQUFPLEtBQUssS0FBWjtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBZVcsYyIsImZpbGUiOiJjc3Mtc3ludGF4LWVycm9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN1cHBvcnRzQ29sb3IgZnJvbSAnc3VwcG9ydHMtY29sb3InO1xuXG5pbXBvcnQgd2Fybk9uY2UgZnJvbSAnLi93YXJuLW9uY2UnO1xuXG4vKipcbiAqIFRoZSBDU1MgcGFyc2VyIHRocm93cyB0aGlzIGVycm9yIGZvciBicm9rZW4gQ1NTLlxuICpcbiAqIEN1c3RvbSBwYXJzZXJzIGNhbiB0aHJvdyB0aGlzIGVycm9yIGZvciBicm9rZW4gY3VzdG9tIHN5bnRheCB1c2luZ1xuICogdGhlIHtAbGluayBOb2RlI2Vycm9yfSBtZXRob2QuXG4gKlxuICogUG9zdENTUyB3aWxsIHVzZSB0aGUgaW5wdXQgc291cmNlIG1hcCB0byBkZXRlY3QgdGhlIG9yaWdpbmFsIGVycm9yIGxvY2F0aW9uLlxuICogSWYgeW91IHdyb3RlIGEgU2FzcyBmaWxlLCBjb21waWxlZCBpdCB0byBDU1MgYW5kIHRoZW4gcGFyc2VkIGl0IHdpdGggUG9zdENTUyxcbiAqIFBvc3RDU1Mgd2lsbCBzaG93IHRoZSBvcmlnaW5hbCBwb3NpdGlvbiBpbiB0aGUgU2FzcyBmaWxlLlxuICpcbiAqIElmIHlvdSBuZWVkIHRoZSBwb3NpdGlvbiBpbiB0aGUgUG9zdENTUyBpbnB1dFxuICogKGUuZy4sIHRvIGRlYnVnIHRoZSBwcmV2aW91cyBjb21waWxlciksIHVzZSBgZXJyb3IuaW5wdXQuZmlsZWAuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIENhdGNoaW5nIGFuZCBjaGVja2luZyBzeW50YXggZXJyb3JcbiAqIHRyeSB7XG4gKiAgIHBvc3Rjc3MucGFyc2UoJ2F7JylcbiAqIH0gY2F0Y2ggKGVycm9yKSB7XG4gKiAgIGlmICggZXJyb3IubmFtZSA9PT0gJ0Nzc1N5bnRheEVycm9yJyApIHtcbiAqICAgICBlcnJvciAvLz0+IENzc1N5bnRheEVycm9yXG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gUmFpc2luZyBlcnJvciBmcm9tIHBsdWdpblxuICogdGhyb3cgbm9kZS5lcnJvcignVW5rbm93biB2YXJpYWJsZScsIHsgcGx1Z2luOiAncG9zdGNzcy12YXJzJyB9KTtcbiAqL1xuY2xhc3MgQ3NzU3ludGF4RXJyb3Ige1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgIC0gZXJyb3IgbWVzc2FnZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbGluZV0gICAtIHNvdXJjZSBsaW5lIG9mIHRoZSBlcnJvclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbY29sdW1uXSAtIHNvdXJjZSBjb2x1bW4gb2YgdGhlIGVycm9yXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtzb3VyY2VdIC0gc291cmNlIGNvZGUgb2YgdGhlIGJyb2tlbiBmaWxlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtmaWxlXSAgIC0gYWJzb2x1dGUgcGF0aCB0byB0aGUgYnJva2VuIGZpbGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3BsdWdpbl0gLSBQb3N0Q1NTIHBsdWdpbiBuYW1lLCBpZiBlcnJvciBjYW1lIGZyb20gcGx1Z2luXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgbGluZSwgY29sdW1uLCBzb3VyY2UsIGZpbGUsIHBsdWdpbikge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIEFsd2F5cyBlcXVhbCB0byBgJ0Nzc1N5bnRheEVycm9yJ2AuIFlvdSBzaG91bGRcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIGFsd2F5cyBjaGVjayBlcnJvciB0eXBlXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICBieSBgZXJyb3IubmFtZSA9PT0gJ0Nzc1N5bnRheEVycm9yJ2AgaW5zdGVhZCBvZlxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgYGVycm9yIGluc3RhbmNlb2YgQ3NzU3ludGF4RXJyb3JgLCBiZWNhdXNlXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICBucG0gY291bGQgaGF2ZSBzZXZlcmFsIFBvc3RDU1MgdmVyc2lvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGlmICggZXJyb3IubmFtZSA9PT0gJ0Nzc1N5bnRheEVycm9yJyApIHtcbiAgICAgICAgICogICBlcnJvciAvLz0+IENzc1N5bnRheEVycm9yXG4gICAgICAgICAqIH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubmFtZSAgID0gJ0Nzc1N5bnRheEVycm9yJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBFcnJvciBtZXNzYWdlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBlcnJvci5tZXNzYWdlIC8vPT4gJ1VuY2xvc2VkIGJsb2NrJ1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZWFzb24gPSBtZXNzYWdlO1xuXG4gICAgICAgIGlmICggZmlsZSApIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIEFic29sdXRlIHBhdGggdG8gdGhlIGJyb2tlbiBmaWxlLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgKiBlcnJvci5maWxlICAgICAgIC8vPT4gJ2Euc2FzcydcbiAgICAgICAgICAgICAqIGVycm9yLmlucHV0LmZpbGUgLy89PiAnYS5jc3MnXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuZmlsZSA9IGZpbGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBzb3VyY2UgKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBTb3VyY2UgY29kZSBvZiB0aGUgYnJva2VuIGZpbGUuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIGVycm9yLnNvdXJjZSAgICAgICAvLz0+ICdhIHsgYiB7fSB9J1xuICAgICAgICAgICAgICogZXJyb3IuaW5wdXQuY29sdW1uIC8vPT4gJ2EgYiB7IH0nXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICggcGx1Z2luICkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gUGx1Z2luIG5hbWUsIGlmIGVycm9yIGNhbWUgZnJvbSBwbHVnaW4uXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIGVycm9yLnBsdWdpbiAvLz0+ICdwb3N0Y3NzLXZhcnMnXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgICAgICB9XG4gICAgICAgIGlmICggdHlwZW9mIGxpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjb2x1bW4gIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IC0gU291cmNlIGxpbmUgb2YgdGhlIGVycm9yLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgKiBlcnJvci5saW5lICAgICAgIC8vPT4gMlxuICAgICAgICAgICAgICogZXJyb3IuaW5wdXQubGluZSAvLz0+IDRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5saW5lICAgPSBsaW5lO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IC0gU291cmNlIGNvbHVtbiBvZiB0aGUgZXJyb3IuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIGVycm9yLmNvbHVtbiAgICAgICAvLz0+IDFcbiAgICAgICAgICAgICAqIGVycm9yLmlucHV0LmNvbHVtbiAvLz0+IDRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldE1lc3NhZ2UoKTtcblxuICAgICAgICBpZiAoIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlICkge1xuICAgICAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgQ3NzU3ludGF4RXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TWVzc2FnZSgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBGdWxsIGVycm9yIHRleHQgaW4gdGhlIEdOVSBlcnJvciBmb3JtYXRcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIHdpdGggcGx1Z2luLCBmaWxlLCBsaW5lIGFuZCBjb2x1bW4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGVycm9yLm1lc3NhZ2UgLy89PiAnYS5jc3M6MToxOiBVbmNsb3NlZCBibG9jaydcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubWVzc2FnZSAgPSB0aGlzLnBsdWdpbiA/IHRoaXMucGx1Z2luICsgJzogJyA6ICcnO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgKz0gdGhpcy5maWxlID8gdGhpcy5maWxlIDogJzxjc3MgaW5wdXQ+JztcbiAgICAgICAgaWYgKCB0eXBlb2YgdGhpcy5saW5lICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSArPSAnOicgKyB0aGlzLmxpbmUgKyAnOicgKyB0aGlzLmNvbHVtbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1lc3NhZ2UgKz0gJzogJyArIHRoaXMucmVhc29uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmZXcgbGluZXMgb2YgQ1NTIHNvdXJjZSB0aGF0IGNhdXNlZCB0aGUgZXJyb3IuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgQ1NTIGhhcyBhbiBpbnB1dCBzb3VyY2UgbWFwIHdpdGhvdXQgYHNvdXJjZUNvbnRlbnRgLFxuICAgICAqIHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NvbG9yXSB3aGV0aGVyIGFycm93IHdpbGwgYmUgY29sb3JlZCByZWQgYnkgdGVybWluYWxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgY29kZXMuIEJ5IGRlZmF1bHQsIFBvc3RDU1Mgd2lsbCBkZXRlY3RcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3Igc3VwcG9ydCBieSBgcHJvY2Vzcy5zdGRvdXQuaXNUVFlgXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBgcHJvY2Vzcy5lbnYuTk9ERV9ESVNBQkxFX0NPTE9SU2AuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGVycm9yLnNob3dTb3VyY2VDb2RlKCkgLy89PiBcImEge1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICBiYWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgXlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgfVwiXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGZldyBsaW5lcyBvZiBDU1Mgc291cmNlIHRoYXQgY2F1c2VkIHRoZSBlcnJvclxuICAgICAqL1xuICAgIHNob3dTb3VyY2VDb2RlKGNvbG9yKSB7XG4gICAgICAgIGlmICggIXRoaXMuc291cmNlICkgcmV0dXJuICcnO1xuXG4gICAgICAgIGxldCBudW0gICA9IHRoaXMubGluZSAtIDE7XG4gICAgICAgIGxldCBsaW5lcyA9IHRoaXMuc291cmNlLnNwbGl0KCdcXG4nKTtcblxuICAgICAgICBsZXQgcHJldiAgID0gbnVtID4gMCA/IGxpbmVzW251bSAtIDFdICsgJ1xcbicgOiAnJztcbiAgICAgICAgbGV0IGJyb2tlbiA9IGxpbmVzW251bV07XG4gICAgICAgIGxldCBuZXh0ICAgPSBudW0gPCBsaW5lcy5sZW5ndGggLSAxID8gJ1xcbicgKyBsaW5lc1tudW0gKyAxXSA6ICcnO1xuXG4gICAgICAgIGxldCBtYXJrID0gJ1xcbic7XG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMuY29sdW1uIC0gMTsgaSsrICkge1xuICAgICAgICAgICAgbWFyayArPSAnICc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHR5cGVvZiBjb2xvciA9PT0gJ3VuZGVmaW5lZCcgKSBjb2xvciA9IHN1cHBvcnRzQ29sb3I7XG4gICAgICAgIGlmICggY29sb3IgKSB7XG4gICAgICAgICAgICBtYXJrICs9ICdcXHgxQlsxOzMxbV5cXHgxQlswbSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXJrICs9ICdeJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnXFxuJyArIHByZXYgKyBicm9rZW4gKyBtYXJrICsgbmV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGVycm9yIHBvc2l0aW9uLCBtZXNzYWdlIGFuZCBzb3VyY2UgY29kZSBvZiB0aGUgYnJva2VuIHBhcnQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGVycm9yLnRvU3RyaW5nKCkgLy89PiBcIkNzc1N5bnRheEVycm9yOiBhcHAuY3NzOjE6MTogVW5jbG9zZWQgYmxvY2tcbiAgICAgKiAgICAgICAgICAgICAgICAgIC8vICAgIGEge1xuICAgICAqICAgICAgICAgICAgICAgICAgLy8gICAgXlwiXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGVycm9yIHBvc2l0aW9uLCBtZXNzYWdlIGFuZCBzb3VyY2UgY29kZVxuICAgICAqL1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lICsgJzogJyArIHRoaXMubWVzc2FnZSArIHRoaXMuc2hvd1NvdXJjZUNvZGUoKTtcbiAgICB9XG5cbiAgICBnZXQgZ2VuZXJhdGVkKCkge1xuICAgICAgICB3YXJuT25jZSgnQ3NzU3ludGF4RXJyb3IjZ2VuZXJhdGVkIGlzIGRlcHJlYWN0ZWQuIFVzZSBpbnB1dCBpbnN0ZWFkLicpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgQ3NzU3ludGF4RXJyb3IjXG4gICAgICogQG1lbWJlciB7SW5wdXR9IGlucHV0IC0gSW5wdXQgb2JqZWN0IHdpdGggUG9zdENTUyBpbnRlcm5hbCBpbmZvcm1hdGlvblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIGFib3V0IGlucHV0IGZpbGUuIElmIGlucHV0IGhhcyBzb3VyY2UgbWFwXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBwcmV2aW91cyB0b29sLCBQb3N0Q1NTIHdpbGwgdXNlIG9yaWdpblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIChmb3IgZXhhbXBsZSwgU2Fzcykgc291cmNlLiBZb3UgY2FuIHVzZSB0aGlzXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0IHRvIGdldCBQb3N0Q1NTIGlucHV0IHNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogZXJyb3IuaW5wdXQuZmlsZSAvLz0+ICdhLmNzcydcbiAgICAgKiBlcnJvci5maWxlICAgICAgIC8vPT4gJ2Euc2FzcydcbiAgICAgKi9cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDc3NTeW50YXhFcnJvcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
