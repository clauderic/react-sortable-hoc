'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _jsBase = require('js-base64');

var _sourceMap = require('source-map');

var _sourceMap2 = _interopRequireDefault(_sourceMap);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Source map information from input CSS.
 * For example, source map after Sass compiler.
 *
 * This class will automatically find source map in input CSS or in file system
 * near input file (according `from` option).
 *
 * @example
 * const root = postcss.parse(css, { from: 'a.sass.css' });
 * root.input.map //=> PreviousMap
 */
var PreviousMap = function () {

    /**
     * @param {string}         css    - input CSS source
     * @param {processOptions} [opts] - {@link Processor#process} options
     */
    function PreviousMap(css, opts) {
        _classCallCheck(this, PreviousMap);

        this.loadAnnotation(css);
        /**
         * @member {boolean} - Was source map inlined by data-uri to input CSS.
         */
        this.inline = this.startWith(this.annotation, 'data:');

        var prev = opts.map ? opts.map.prev : undefined;
        var text = this.loadMap(opts.from, prev);
        if (text) this.text = text;
    }

    /**
     * Create a instance of `SourceMapGenerator` class
     * from the `source-map` library to work with source map information.
     *
     * It is lazy method, so it will create object only on first call
     * and then it will use cache.
     *
     * @return {SourceMapGenerator} object woth source map information
     */


    PreviousMap.prototype.consumer = function consumer() {
        if (!this.consumerCache) {
            this.consumerCache = new _sourceMap2.default.SourceMapConsumer(this.text);
        }
        return this.consumerCache;
    };

    /**
     * Does source map contains `sourcesContent` with input source text.
     *
     * @return {boolean} Is `sourcesContent` present
     */


    PreviousMap.prototype.withContent = function withContent() {
        return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
    };

    PreviousMap.prototype.startWith = function startWith(string, start) {
        if (!string) return false;
        return string.substr(0, start.length) === start;
    };

    PreviousMap.prototype.loadAnnotation = function loadAnnotation(css) {
        var match = css.match(/\/\*\s*# sourceMappingURL=(.*)\s*\*\//);
        if (match) this.annotation = match[1].trim();
    };

    PreviousMap.prototype.decodeInline = function decodeInline(text) {
        var utfd64 = 'data:application/json;charset=utf-8;base64,';
        var utf64 = 'data:application/json;charset=utf8;base64,';
        var b64 = 'data:application/json;base64,';
        var uri = 'data:application/json,';

        if (this.startWith(text, uri)) {
            return decodeURIComponent(text.substr(uri.length));
        } else if (this.startWith(text, b64)) {
            return _jsBase.Base64.decode(text.substr(b64.length));
        } else if (this.startWith(text, utf64)) {
            return _jsBase.Base64.decode(text.substr(utf64.length));
        } else if (this.startWith(text, utfd64)) {
            return _jsBase.Base64.decode(text.substr(utfd64.length));
        } else {
            var encoding = text.match(/data:application\/json;([^,]+),/)[1];
            throw new Error('Unsupported source map encoding ' + encoding);
        }
    };

    PreviousMap.prototype.loadMap = function loadMap(file, prev) {
        if (prev === false) return false;

        if (prev) {
            if (typeof prev === 'string') {
                return prev;
            } else if (typeof prev === 'function') {
                var prevPath = prev(file);
                if (prevPath && _fs2.default.existsSync && _fs2.default.existsSync(prevPath)) {
                    return _fs2.default.readFileSync(prevPath, 'utf-8').toString().trim();
                } else {
                    throw new Error('Unable to load previous source map: ' + prevPath.toString());
                }
            } else if (prev instanceof _sourceMap2.default.SourceMapConsumer) {
                return _sourceMap2.default.SourceMapGenerator.fromSourceMap(prev).toString();
            } else if (prev instanceof _sourceMap2.default.SourceMapGenerator) {
                return prev.toString();
            } else if (this.isMap(prev)) {
                return JSON.stringify(prev);
            } else {
                throw new Error('Unsupported previous source map format: ' + prev.toString());
            }
        } else if (this.inline) {
            return this.decodeInline(this.annotation);
        } else if (this.annotation) {
            var map = this.annotation;
            if (file) map = _path2.default.join(_path2.default.dirname(file), map);

            this.root = _path2.default.dirname(map);
            if (_fs2.default.existsSync && _fs2.default.existsSync(map)) {
                return _fs2.default.readFileSync(map, 'utf-8').toString().trim();
            } else {
                return false;
            }
        }
    };

    PreviousMap.prototype.isMap = function isMap(map) {
        if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') return false;
        return typeof map.mappings === 'string' || typeof map._mappings === 'string';
    };

    return PreviousMap;
}();

exports.default = PreviousMap;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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VixFQUE4QixHQUE5QixDQUFOOztBQUVaLGlCQUFLLElBQUwsR0FBWSxlQUFLLE9BQUwsQ0FBYSxHQUFiLENBQVo7QUFDQSxnQkFBSyxhQUFHLFVBQUgsSUFBaUIsYUFBRyxVQUFILENBQWMsR0FBZCxDQUF0QixFQUEyQztBQUN2Qyx1QkFBTyxhQUFHLFlBQUgsQ0FBZ0IsR0FBaEIsRUFBcUIsT0FBckIsRUFBOEIsUUFBOUIsR0FBeUMsSUFBekMsRUFBUDtBQUNILGFBRkQsTUFFTztBQUNILHVCQUFPLEtBQVA7QUFDSDtBQUNKO0FBQ0osSzs7MEJBRUQsSyxrQkFBTSxHLEVBQUs7QUFDUCxZQUFLLFFBQU8sR0FBUCx5Q0FBTyxHQUFQLE9BQWUsUUFBcEIsRUFBK0IsT0FBTyxLQUFQO0FBQy9CLGVBQU8sT0FBTyxJQUFJLFFBQVgsS0FBd0IsUUFBeEIsSUFDQSxPQUFPLElBQUksU0FBWCxLQUF5QixRQURoQztBQUVILEs7Ozs7O2tCQUdVLFciLCJmaWxlIjoicHJldmlvdXMtbWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZTY0IH0gZnJvbSAnanMtYmFzZTY0JztcbmltcG9ydCAgIG1vemlsbGEgIGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0ICAgcGF0aCAgICAgZnJvbSAncGF0aCc7XG5pbXBvcnQgICBmcyAgICAgICBmcm9tICdmcyc7XG5cbi8qKlxuICogU291cmNlIG1hcCBpbmZvcm1hdGlvbiBmcm9tIGlucHV0IENTUy5cbiAqIEZvciBleGFtcGxlLCBzb3VyY2UgbWFwIGFmdGVyIFNhc3MgY29tcGlsZXIuXG4gKlxuICogVGhpcyBjbGFzcyB3aWxsIGF1dG9tYXRpY2FsbHkgZmluZCBzb3VyY2UgbWFwIGluIGlucHV0IENTUyBvciBpbiBmaWxlIHN5c3RlbVxuICogbmVhciBpbnB1dCBmaWxlIChhY2NvcmRpbmcgYGZyb21gIG9wdGlvbikuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHJvb3QgPSBwb3N0Y3NzLnBhcnNlKGNzcywgeyBmcm9tOiAnYS5zYXNzLmNzcycgfSk7XG4gKiByb290LmlucHV0Lm1hcCAvLz0+IFByZXZpb3VzTWFwXG4gKi9cbmNsYXNzIFByZXZpb3VzTWFwIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIGNzcyAgICAtIGlucHV0IENTUyBzb3VyY2VcbiAgICAgKiBAcGFyYW0ge3Byb2Nlc3NPcHRpb25zfSBbb3B0c10gLSB7QGxpbmsgUHJvY2Vzc29yI3Byb2Nlc3N9IG9wdGlvbnNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjc3MsIG9wdHMpIHtcbiAgICAgICAgdGhpcy5sb2FkQW5ub3RhdGlvbihjc3MpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7Ym9vbGVhbn0gLSBXYXMgc291cmNlIG1hcCBpbmxpbmVkIGJ5IGRhdGEtdXJpIHRvIGlucHV0IENTUy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaW5saW5lID0gdGhpcy5zdGFydFdpdGgodGhpcy5hbm5vdGF0aW9uLCAnZGF0YTonKTtcblxuICAgICAgICBsZXQgcHJldiA9IG9wdHMubWFwID8gb3B0cy5tYXAucHJldiA6IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IHRleHQgPSB0aGlzLmxvYWRNYXAob3B0cy5mcm9tLCBwcmV2KTtcbiAgICAgICAgaWYgKCB0ZXh0ICkgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBpbnN0YW5jZSBvZiBgU291cmNlTWFwR2VuZXJhdG9yYCBjbGFzc1xuICAgICAqIGZyb20gdGhlIGBzb3VyY2UtbWFwYCBsaWJyYXJ5IHRvIHdvcmsgd2l0aCBzb3VyY2UgbWFwIGluZm9ybWF0aW9uLlxuICAgICAqXG4gICAgICogSXQgaXMgbGF6eSBtZXRob2QsIHNvIGl0IHdpbGwgY3JlYXRlIG9iamVjdCBvbmx5IG9uIGZpcnN0IGNhbGxcbiAgICAgKiBhbmQgdGhlbiBpdCB3aWxsIHVzZSBjYWNoZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NvdXJjZU1hcEdlbmVyYXRvcn0gb2JqZWN0IHdvdGggc291cmNlIG1hcCBpbmZvcm1hdGlvblxuICAgICAqL1xuICAgIGNvbnN1bWVyKCkge1xuICAgICAgICBpZiAoICF0aGlzLmNvbnN1bWVyQ2FjaGUgKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnN1bWVyQ2FjaGUgPSBuZXcgbW96aWxsYS5Tb3VyY2VNYXBDb25zdW1lcih0aGlzLnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVyQ2FjaGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG9lcyBzb3VyY2UgbWFwIGNvbnRhaW5zIGBzb3VyY2VzQ29udGVudGAgd2l0aCBpbnB1dCBzb3VyY2UgdGV4dC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElzIGBzb3VyY2VzQ29udGVudGAgcHJlc2VudFxuICAgICAqL1xuICAgIHdpdGhDb250ZW50KCkge1xuICAgICAgICByZXR1cm4gISEodGhpcy5jb25zdW1lcigpLnNvdXJjZXNDb250ZW50ICYmXG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbnN1bWVyKCkuc291cmNlc0NvbnRlbnQubGVuZ3RoID4gMCk7XG4gICAgfVxuXG4gICAgc3RhcnRXaXRoKHN0cmluZywgc3RhcnQpIHtcbiAgICAgICAgaWYgKCAhc3RyaW5nICkgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gc3RyaW5nLnN1YnN0cigwLCBzdGFydC5sZW5ndGgpID09PSBzdGFydDtcbiAgICB9XG5cbiAgICBsb2FkQW5ub3RhdGlvbihjc3MpIHtcbiAgICAgICAgbGV0IG1hdGNoID0gY3NzLm1hdGNoKC9cXC9cXCpcXHMqIyBzb3VyY2VNYXBwaW5nVVJMPSguKilcXHMqXFwqXFwvLyk7XG4gICAgICAgIGlmICggbWF0Y2ggKSB0aGlzLmFubm90YXRpb24gPSBtYXRjaFsxXS50cmltKCk7XG4gICAgfVxuXG4gICAgZGVjb2RlSW5saW5lKHRleHQpIHtcbiAgICAgICAgbGV0IHV0ZmQ2NCA9ICdkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJztcbiAgICAgICAgbGV0IHV0ZjY0ICA9ICdkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGY4O2Jhc2U2NCwnO1xuICAgICAgICBsZXQgYjY0ICAgID0gJ2RhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsJztcbiAgICAgICAgbGV0IHVyaSAgICA9ICdkYXRhOmFwcGxpY2F0aW9uL2pzb24sJztcblxuICAgICAgICBpZiAoIHRoaXMuc3RhcnRXaXRoKHRleHQsIHVyaSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KCB0ZXh0LnN1YnN0cih1cmkubGVuZ3RoKSApO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuc3RhcnRXaXRoKHRleHQsIGI2NCkgKSB7XG4gICAgICAgICAgICByZXR1cm4gQmFzZTY0LmRlY29kZSggdGV4dC5zdWJzdHIoYjY0Lmxlbmd0aCkgKTtcblxuICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnN0YXJ0V2l0aCh0ZXh0LCB1dGY2NCkgKSB7XG4gICAgICAgICAgICByZXR1cm4gQmFzZTY0LmRlY29kZSggdGV4dC5zdWJzdHIodXRmNjQubGVuZ3RoKSApO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuc3RhcnRXaXRoKHRleHQsIHV0ZmQ2NCkgKSB7XG4gICAgICAgICAgICByZXR1cm4gQmFzZTY0LmRlY29kZSggdGV4dC5zdWJzdHIodXRmZDY0Lmxlbmd0aCkgKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGVuY29kaW5nID0gdGV4dC5tYXRjaCgvZGF0YTphcHBsaWNhdGlvblxcL2pzb247KFteLF0rKSwvKVsxXTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgc291cmNlIG1hcCBlbmNvZGluZyAnICsgZW5jb2RpbmcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZE1hcChmaWxlLCBwcmV2KSB7XG4gICAgICAgIGlmICggcHJldiA9PT0gZmFsc2UgKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYgKCBwcmV2ICkge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2YgcHJldiA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgcHJldiA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJldlBhdGggPSBwcmV2KGZpbGUpO1xuICAgICAgICAgICAgICAgIGlmICggcHJldlBhdGggJiYgZnMuZXhpc3RzU3luYyAmJiBmcy5leGlzdHNTeW5jKHByZXZQYXRoKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhwcmV2UGF0aCwgJ3V0Zi04JykudG9TdHJpbmcoKS50cmltKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gbG9hZCBwcmV2aW91cyBzb3VyY2UgbWFwOiAnICtcbiAgICAgICAgICAgICAgICAgICAgcHJldlBhdGgudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICggcHJldiBpbnN0YW5jZW9mIG1vemlsbGEuU291cmNlTWFwQ29uc3VtZXIgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vemlsbGEuU291cmNlTWFwR2VuZXJhdG9yXG4gICAgICAgICAgICAgICAgICAgIC5mcm9tU291cmNlTWFwKHByZXYpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBwcmV2IGluc3RhbmNlb2YgbW96aWxsYS5Tb3VyY2VNYXBHZW5lcmF0b3IgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXYudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuaXNNYXAocHJldikgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHByZXYpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHByZXZpb3VzIHNvdXJjZSBtYXAgZm9ybWF0OiAnICtcbiAgICAgICAgICAgICAgICAgICAgcHJldi50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLmlubGluZSApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlY29kZUlubGluZSh0aGlzLmFubm90YXRpb24pO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuYW5ub3RhdGlvbiApIHtcbiAgICAgICAgICAgIGxldCBtYXAgPSB0aGlzLmFubm90YXRpb247XG4gICAgICAgICAgICBpZiAoIGZpbGUgKSBtYXAgPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKGZpbGUpLCBtYXApO1xuXG4gICAgICAgICAgICB0aGlzLnJvb3QgPSBwYXRoLmRpcm5hbWUobWFwKTtcbiAgICAgICAgICAgIGlmICggZnMuZXhpc3RzU3luYyAmJiBmcy5leGlzdHNTeW5jKG1hcCkgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhtYXAsICd1dGYtOCcpLnRvU3RyaW5nKCkudHJpbSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc01hcChtYXApIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgbWFwICE9PSAnb2JqZWN0JyApIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBtYXAubWFwcGluZ3MgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICAgICB0eXBlb2YgbWFwLl9tYXBwaW5ncyA9PT0gJ3N0cmluZyc7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcmV2aW91c01hcDtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
