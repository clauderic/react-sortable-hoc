'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _mapGenerator = require('./map-generator');

var _mapGenerator2 = _interopRequireDefault(_mapGenerator);

var _stringify2 = require('./stringify');

var _stringify3 = _interopRequireDefault(_stringify2);

var _warnOnce = require('./warn-once');

var _warnOnce2 = _interopRequireDefault(_warnOnce);

var _result = require('./result');

var _result2 = _interopRequireDefault(_result);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isPromise(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj.then === 'function';
}

/**
 * @callback onFulfilled
 * @param {Result} result
 */

/**
 * @callback onRejected
 * @param {Error} error
 */

/**
 * A Promise proxy for the result of PostCSS transformations.
 *
 * A `LazyResult` instance is returned by {@link Processor#process}.
 *
 * @example
 * const lazy = postcss([cssnext]).process(css);
 */

var LazyResult = function () {
    function LazyResult(processor, css, opts) {
        _classCallCheck(this, LazyResult);

        this.stringified = false;
        this.processed = false;

        var root = void 0;
        if ((typeof css === 'undefined' ? 'undefined' : _typeof(css)) === 'object' && css.type === 'root') {
            root = css;
        } else if (css instanceof LazyResult || css instanceof _result2.default) {
            root = css.root;
            if (css.map) {
                if (typeof opts.map === 'undefined') opts.map = {};
                if (!opts.map.inline) opts.map.inline = false;
                opts.map.prev = css.map;
            }
        } else {
            var parser = _parse2.default;
            if (opts.syntax) parser = opts.syntax.parse;
            if (opts.parser) parser = opts.parser;
            if (parser.parse) parser = parser.parse;

            try {
                root = parser(css, opts);
            } catch (error) {
                this.error = error;
            }
        }

        this.result = new _result2.default(processor, root, opts);
    }

    /**
     * Returns a {@link Processor} instance, which will be used
     * for CSS transformations.
     * @type {Processor}
     */


    /**
     * Processes input CSS through synchronous plugins
     * and calls {@link Result#warnings()}.
     *
     * @return {Warning[]} warnings from plugins
     */
    LazyResult.prototype.warnings = function warnings() {
        return this.sync().warnings();
    };

    /**
     * Alias for the {@link LazyResult#css} property.
     *
     * @example
     * lazy + '' === lazy.css;
     *
     * @return {string} output CSS
     */


    LazyResult.prototype.toString = function toString() {
        return this.css;
    };

    /**
     * Processes input CSS through synchronous and asynchronous plugins
     * and calls `onFulfilled` with a Result instance. If a plugin throws
     * an error, the `onRejected` callback will be executed.
     *
     * It implements standard Promise API.
     *
     * @param {onFulfilled} onFulfilled - callback will be executed
     *                                    when all plugins will finish work
     * @param {onRejected}  onRejected  - callback will be execited on any error
     *
     * @return {Promise} Promise API to make queue
     *
     * @example
     * postcss([cssnext]).process(css).then(result => {
     *   console.log(result.css);
     * });
     */


    LazyResult.prototype.then = function then(onFulfilled, onRejected) {
        return this.async().then(onFulfilled, onRejected);
    };

    /**
     * Processes input CSS through synchronous and asynchronous plugins
     * and calls onRejected for each error thrown in any plugin.
     *
     * It implements standard Promise API.
     *
     * @param {onRejected} onRejected - callback will be execited on any error
     *
     * @return {Promise} Promise API to make queue
     *
     * @example
     * postcss([cssnext]).process(css).then(result => {
     *   console.log(result.css);
     * }).catch(error => {
     *   console.error(error);
     * });
     */


    LazyResult.prototype.catch = function _catch(onRejected) {
        return this.async().catch(onRejected);
    };

    LazyResult.prototype.handleError = function handleError(error, plugin) {
        try {
            this.error = error;
            if (error.name === 'CssSyntaxError' && !error.plugin) {
                error.plugin = plugin.postcssPlugin;
                error.setMessage();
            } else if (plugin.postcssVersion) {
                var pluginName = plugin.postcssPlugin;
                var pluginVer = plugin.postcssVersion;
                var runtimeVer = this.result.processor.version;
                var a = pluginVer.split('.');
                var b = runtimeVer.split('.');

                if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
                    (0, _warnOnce2.default)('Your current PostCSS version ' + 'is ' + runtimeVer + ', but ' + pluginName + ' ' + 'uses ' + pluginVer + '. Perhaps this is ' + 'the source of the error below.');
                }
            }
        } catch (err) {
            if (console && console.error) console.error(err);
        }
    };

    LazyResult.prototype.asyncTick = function asyncTick(resolve, reject) {
        var _this = this;

        if (this.plugin >= this.processor.plugins.length) {
            this.processed = true;
            return resolve();
        }

        try {
            (function () {
                var plugin = _this.processor.plugins[_this.plugin];
                var promise = _this.run(plugin);
                _this.plugin += 1;

                if (isPromise(promise)) {
                    promise.then(function () {
                        _this.asyncTick(resolve, reject);
                    }).catch(function (error) {
                        _this.handleError(error, plugin);
                        _this.processed = true;
                        reject(error);
                    });
                } else {
                    _this.asyncTick(resolve, reject);
                }
            })();
        } catch (error) {
            this.processed = true;
            reject(error);
        }
    };

    LazyResult.prototype.async = function async() {
        var _this2 = this;

        if (this.processed) {
            return new Promise(function (resolve, reject) {
                if (_this2.error) {
                    reject(_this2.error);
                } else {
                    resolve(_this2.stringify());
                }
            });
        }
        if (this.processing) {
            return this.processing;
        }

        this.processing = new Promise(function (resolve, reject) {
            if (_this2.error) return reject(_this2.error);
            _this2.plugin = 0;
            _this2.asyncTick(resolve, reject);
        }).then(function () {
            _this2.processed = true;
            return _this2.stringify();
        });

        return this.processing;
    };

    LazyResult.prototype.sync = function sync() {
        if (this.processed) return this.result;
        this.processed = true;

        if (this.processing) {
            throw new Error('Use process(css).then(cb) to work with async plugins');
        }

        if (this.error) throw this.error;

        for (var _iterator = this.result.processor.plugins, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var plugin = _ref;

            var promise = this.run(plugin);
            if (isPromise(promise)) {
                throw new Error('Use process(css).then(cb) to work with async plugins');
            }
        }

        return this.result;
    };

    LazyResult.prototype.run = function run(plugin) {
        this.result.lastPlugin = plugin;

        try {
            return plugin(this.result.root, this.result);
        } catch (error) {
            this.handleError(error, plugin);
            throw error;
        }
    };

    LazyResult.prototype.stringify = function stringify() {
        if (this.stringified) return this.result;
        this.stringified = true;

        this.sync();

        var opts = this.result.opts;
        var str = _stringify3.default;
        if (opts.syntax) str = opts.syntax.stringify;
        if (opts.stringifier) str = opts.stringifier;
        if (str.stringify) str = str.stringify;

        var map = new _mapGenerator2.default(str, this.result.root, this.result.opts);
        var data = map.generate();
        this.result.css = data[0];
        this.result.map = data[1];

        return this.result;
    };

    _createClass(LazyResult, [{
        key: 'processor',
        get: function get() {
            return this.result.processor;
        }

        /**
         * Options from the {@link Processor#process} call.
         * @type {processOptions}
         */

    }, {
        key: 'opts',
        get: function get() {
            return this.result.opts;
        }

        /**
         * Processes input CSS through synchronous plugins, converts `Root`
         * to a CSS string and returns {@link Result#css}.
         *
         * This property will only work with synchronous plugins.
         * If the processor contains any asynchronous plugins
         * it will throw an error. This is why this method is only
         * for debug purpose, you should always use {@link LazyResult#then}.
         *
         * @type {string}
         * @see Result#css
         */

    }, {
        key: 'css',
        get: function get() {
            return this.stringify().css;
        }

        /**
         * An alias for the `css` property. Use it with syntaxes
         * that generate non-CSS output.
         *
         * This property will only work with synchronous plugins.
         * If the processor contains any asynchronous plugins
         * it will throw an error. This is why this method is only
         * for debug purpose, you should always use {@link LazyResult#then}.
         *
         * @type {string}
         * @see Result#content
         */

    }, {
        key: 'content',
        get: function get() {
            return this.stringify().content;
        }

        /**
         * Processes input CSS through synchronous plugins
         * and returns {@link Result#map}.
         *
         * This property will only work with synchronous plugins.
         * If the processor contains any asynchronous plugins
         * it will throw an error. This is why this method is only
         * for debug purpose, you should always use {@link LazyResult#then}.
         *
         * @type {SourceMapGenerator}
         * @see Result#map
         */

    }, {
        key: 'map',
        get: function get() {
            return this.stringify().map;
        }

        /**
         * Processes input CSS through synchronous plugins
         * and returns {@link Result#root}.
         *
         * This property will only work with synchronous plugins. If the processor
         * contains any asynchronous plugins it will throw an error.
         *
         * This is why this method is only for debug purpose,
         * you should always use {@link LazyResult#then}.
         *
         * @type {Root}
         * @see Result#root
         */

    }, {
        key: 'root',
        get: function get() {
            return this.sync().root;
        }

        /**
         * Processes input CSS through synchronous plugins
         * and returns {@link Result#messages}.
         *
         * This property will only work with synchronous plugins. If the processor
         * contains any asynchronous plugins it will throw an error.
         *
         * This is why this method is only for debug purpose,
         * you should always use {@link LazyResult#then}.
         *
         * @type {Message[]}
         * @see Result#messages
         */

    }, {
        key: 'messages',
        get: function get() {
            return this.sync().messages;
        }
    }]);

    return LazyResult;
}();

exports.default = LazyResult;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUssTUFBTCxDQUFZLElBQXBELENBQVg7QUFDQSxZQUFJLE9BQU8sSUFBSSxRQUFKLEVBQVg7QUFDQSxhQUFLLE1BQUwsQ0FBWSxHQUFaLEdBQWtCLEtBQUssQ0FBTCxDQUFsQjtBQUNBLGFBQUssTUFBTCxDQUFZLEdBQVosR0FBa0IsS0FBSyxDQUFMLENBQWxCOztBQUVBLGVBQU8sS0FBSyxNQUFaO0FBQ0gsSzs7Ozs0QkFsU2U7QUFDWixtQkFBTyxLQUFLLE1BQUwsQ0FBWSxTQUFuQjtBQUNIOztBQUVEOzs7Ozs7OzRCQUlXO0FBQ1AsbUJBQU8sS0FBSyxNQUFMLENBQVksSUFBbkI7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OzRCQVlVO0FBQ04sbUJBQU8sS0FBSyxTQUFMLEdBQWlCLEdBQXhCO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs0QkFZYztBQUNWLG1CQUFPLEtBQUssU0FBTCxHQUFpQixPQUF4QjtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7NEJBWVU7QUFDTixtQkFBTyxLQUFLLFNBQUwsR0FBaUIsR0FBeEI7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFhVztBQUNQLG1CQUFPLEtBQUssSUFBTCxHQUFZLElBQW5CO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBYWU7QUFDWCxtQkFBTyxLQUFLLElBQUwsR0FBWSxRQUFuQjtBQUNIOzs7Ozs7a0JBME1VLFUiLCJmaWxlIjoibGF6eS1yZXN1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWFwR2VuZXJhdG9yIGZyb20gJy4vbWFwLWdlbmVyYXRvcic7XG5pbXBvcnQgc3RyaW5naWZ5ICAgIGZyb20gJy4vc3RyaW5naWZ5JztcbmltcG9ydCB3YXJuT25jZSAgICAgZnJvbSAnLi93YXJuLW9uY2UnO1xuaW1wb3J0IFJlc3VsdCAgICAgICBmcm9tICcuL3Jlc3VsdCc7XG5pbXBvcnQgcGFyc2UgICAgICAgIGZyb20gJy4vcGFyc2UnO1xuXG5mdW5jdGlvbiBpc1Byb21pc2Uob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIHR5cGVvZiBvYmoudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLyoqXG4gKiBAY2FsbGJhY2sgb25GdWxmaWxsZWRcbiAqIEBwYXJhbSB7UmVzdWx0fSByZXN1bHRcbiAqL1xuXG4vKipcbiAqIEBjYWxsYmFjayBvblJlamVjdGVkXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvclxuICovXG5cbi8qKlxuICogQSBQcm9taXNlIHByb3h5IGZvciB0aGUgcmVzdWx0IG9mIFBvc3RDU1MgdHJhbnNmb3JtYXRpb25zLlxuICpcbiAqIEEgYExhenlSZXN1bHRgIGluc3RhbmNlIGlzIHJldHVybmVkIGJ5IHtAbGluayBQcm9jZXNzb3IjcHJvY2Vzc30uXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGxhenkgPSBwb3N0Y3NzKFtjc3NuZXh0XSkucHJvY2Vzcyhjc3MpO1xuICovXG5jbGFzcyBMYXp5UmVzdWx0IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb2Nlc3NvciwgY3NzLCBvcHRzKSB7XG4gICAgICAgIHRoaXMuc3RyaW5naWZpZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wcm9jZXNzZWQgICA9IGZhbHNlO1xuXG4gICAgICAgIGxldCByb290O1xuICAgICAgICBpZiAoIHR5cGVvZiBjc3MgPT09ICdvYmplY3QnICYmIGNzcy50eXBlID09PSAncm9vdCcgKSB7XG4gICAgICAgICAgICByb290ID0gY3NzO1xuICAgICAgICB9IGVsc2UgaWYgKCBjc3MgaW5zdGFuY2VvZiBMYXp5UmVzdWx0IHx8IGNzcyBpbnN0YW5jZW9mIFJlc3VsdCApIHtcbiAgICAgICAgICAgIHJvb3QgPSBjc3Mucm9vdDtcbiAgICAgICAgICAgIGlmICggY3NzLm1hcCApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBvcHRzLm1hcCA9PT0gJ3VuZGVmaW5lZCcgKSBvcHRzLm1hcCA9IHsgfTtcbiAgICAgICAgICAgICAgICBpZiAoICFvcHRzLm1hcC5pbmxpbmUgKSBvcHRzLm1hcC5pbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBvcHRzLm1hcC5wcmV2ID0gY3NzLm1hcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBwYXJzZXIgPSBwYXJzZTtcbiAgICAgICAgICAgIGlmICggb3B0cy5zeW50YXggKSAgcGFyc2VyID0gb3B0cy5zeW50YXgucGFyc2U7XG4gICAgICAgICAgICBpZiAoIG9wdHMucGFyc2VyICkgIHBhcnNlciA9IG9wdHMucGFyc2VyO1xuICAgICAgICAgICAgaWYgKCBwYXJzZXIucGFyc2UgKSBwYXJzZXIgPSBwYXJzZXIucGFyc2U7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcm9vdCA9IHBhcnNlcihjc3MsIG9wdHMpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc3VsdCA9IG5ldyBSZXN1bHQocHJvY2Vzc29yLCByb290LCBvcHRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEge0BsaW5rIFByb2Nlc3Nvcn0gaW5zdGFuY2UsIHdoaWNoIHdpbGwgYmUgdXNlZFxuICAgICAqIGZvciBDU1MgdHJhbnNmb3JtYXRpb25zLlxuICAgICAqIEB0eXBlIHtQcm9jZXNzb3J9XG4gICAgICovXG4gICAgZ2V0IHByb2Nlc3NvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0LnByb2Nlc3NvcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIGZyb20gdGhlIHtAbGluayBQcm9jZXNzb3IjcHJvY2Vzc30gY2FsbC5cbiAgICAgKiBAdHlwZSB7cHJvY2Vzc09wdGlvbnN9XG4gICAgICovXG4gICAgZ2V0IG9wdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdC5vcHRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3NlcyBpbnB1dCBDU1MgdGhyb3VnaCBzeW5jaHJvbm91cyBwbHVnaW5zLCBjb252ZXJ0cyBgUm9vdGBcbiAgICAgKiB0byBhIENTUyBzdHJpbmcgYW5kIHJldHVybnMge0BsaW5rIFJlc3VsdCNjc3N9LlxuICAgICAqXG4gICAgICogVGhpcyBwcm9wZXJ0eSB3aWxsIG9ubHkgd29yayB3aXRoIHN5bmNocm9ub3VzIHBsdWdpbnMuXG4gICAgICogSWYgdGhlIHByb2Nlc3NvciBjb250YWlucyBhbnkgYXN5bmNocm9ub3VzIHBsdWdpbnNcbiAgICAgKiBpdCB3aWxsIHRocm93IGFuIGVycm9yLiBUaGlzIGlzIHdoeSB0aGlzIG1ldGhvZCBpcyBvbmx5XG4gICAgICogZm9yIGRlYnVnIHB1cnBvc2UsIHlvdSBzaG91bGQgYWx3YXlzIHVzZSB7QGxpbmsgTGF6eVJlc3VsdCN0aGVufS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHNlZSBSZXN1bHQjY3NzXG4gICAgICovXG4gICAgZ2V0IGNzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5KCkuY3NzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIGFsaWFzIGZvciB0aGUgYGNzc2AgcHJvcGVydHkuIFVzZSBpdCB3aXRoIHN5bnRheGVzXG4gICAgICogdGhhdCBnZW5lcmF0ZSBub24tQ1NTIG91dHB1dC5cbiAgICAgKlxuICAgICAqIFRoaXMgcHJvcGVydHkgd2lsbCBvbmx5IHdvcmsgd2l0aCBzeW5jaHJvbm91cyBwbHVnaW5zLlxuICAgICAqIElmIHRoZSBwcm9jZXNzb3IgY29udGFpbnMgYW55IGFzeW5jaHJvbm91cyBwbHVnaW5zXG4gICAgICogaXQgd2lsbCB0aHJvdyBhbiBlcnJvci4gVGhpcyBpcyB3aHkgdGhpcyBtZXRob2QgaXMgb25seVxuICAgICAqIGZvciBkZWJ1ZyBwdXJwb3NlLCB5b3Ugc2hvdWxkIGFsd2F5cyB1c2Uge0BsaW5rIExhenlSZXN1bHQjdGhlbn0uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBzZWUgUmVzdWx0I2NvbnRlbnRcbiAgICAgKi9cbiAgICBnZXQgY29udGVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5KCkuY29udGVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzZXMgaW5wdXQgQ1NTIHRocm91Z2ggc3luY2hyb25vdXMgcGx1Z2luc1xuICAgICAqIGFuZCByZXR1cm5zIHtAbGluayBSZXN1bHQjbWFwfS5cbiAgICAgKlxuICAgICAqIFRoaXMgcHJvcGVydHkgd2lsbCBvbmx5IHdvcmsgd2l0aCBzeW5jaHJvbm91cyBwbHVnaW5zLlxuICAgICAqIElmIHRoZSBwcm9jZXNzb3IgY29udGFpbnMgYW55IGFzeW5jaHJvbm91cyBwbHVnaW5zXG4gICAgICogaXQgd2lsbCB0aHJvdyBhbiBlcnJvci4gVGhpcyBpcyB3aHkgdGhpcyBtZXRob2QgaXMgb25seVxuICAgICAqIGZvciBkZWJ1ZyBwdXJwb3NlLCB5b3Ugc2hvdWxkIGFsd2F5cyB1c2Uge0BsaW5rIExhenlSZXN1bHQjdGhlbn0uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7U291cmNlTWFwR2VuZXJhdG9yfVxuICAgICAqIEBzZWUgUmVzdWx0I21hcFxuICAgICAqL1xuICAgIGdldCBtYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeSgpLm1hcDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzZXMgaW5wdXQgQ1NTIHRocm91Z2ggc3luY2hyb25vdXMgcGx1Z2luc1xuICAgICAqIGFuZCByZXR1cm5zIHtAbGluayBSZXN1bHQjcm9vdH0uXG4gICAgICpcbiAgICAgKiBUaGlzIHByb3BlcnR5IHdpbGwgb25seSB3b3JrIHdpdGggc3luY2hyb25vdXMgcGx1Z2lucy4gSWYgdGhlIHByb2Nlc3NvclxuICAgICAqIGNvbnRhaW5zIGFueSBhc3luY2hyb25vdXMgcGx1Z2lucyBpdCB3aWxsIHRocm93IGFuIGVycm9yLlxuICAgICAqXG4gICAgICogVGhpcyBpcyB3aHkgdGhpcyBtZXRob2QgaXMgb25seSBmb3IgZGVidWcgcHVycG9zZSxcbiAgICAgKiB5b3Ugc2hvdWxkIGFsd2F5cyB1c2Uge0BsaW5rIExhenlSZXN1bHQjdGhlbn0uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Um9vdH1cbiAgICAgKiBAc2VlIFJlc3VsdCNyb290XG4gICAgICovXG4gICAgZ2V0IHJvb3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMoKS5yb290O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3NlcyBpbnB1dCBDU1MgdGhyb3VnaCBzeW5jaHJvbm91cyBwbHVnaW5zXG4gICAgICogYW5kIHJldHVybnMge0BsaW5rIFJlc3VsdCNtZXNzYWdlc30uXG4gICAgICpcbiAgICAgKiBUaGlzIHByb3BlcnR5IHdpbGwgb25seSB3b3JrIHdpdGggc3luY2hyb25vdXMgcGx1Z2lucy4gSWYgdGhlIHByb2Nlc3NvclxuICAgICAqIGNvbnRhaW5zIGFueSBhc3luY2hyb25vdXMgcGx1Z2lucyBpdCB3aWxsIHRocm93IGFuIGVycm9yLlxuICAgICAqXG4gICAgICogVGhpcyBpcyB3aHkgdGhpcyBtZXRob2QgaXMgb25seSBmb3IgZGVidWcgcHVycG9zZSxcbiAgICAgKiB5b3Ugc2hvdWxkIGFsd2F5cyB1c2Uge0BsaW5rIExhenlSZXN1bHQjdGhlbn0uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TWVzc2FnZVtdfVxuICAgICAqIEBzZWUgUmVzdWx0I21lc3NhZ2VzXG4gICAgICovXG4gICAgZ2V0IG1lc3NhZ2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jKCkubWVzc2FnZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvY2Vzc2VzIGlucHV0IENTUyB0aHJvdWdoIHN5bmNocm9ub3VzIHBsdWdpbnNcbiAgICAgKiBhbmQgY2FsbHMge0BsaW5rIFJlc3VsdCN3YXJuaW5ncygpfS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1dhcm5pbmdbXX0gd2FybmluZ3MgZnJvbSBwbHVnaW5zXG4gICAgICovXG4gICAgd2FybmluZ3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMoKS53YXJuaW5ncygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsaWFzIGZvciB0aGUge0BsaW5rIExhenlSZXN1bHQjY3NzfSBwcm9wZXJ0eS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGF6eSArICcnID09PSBsYXp5LmNzcztcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gb3V0cHV0IENTU1xuICAgICAqL1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jc3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvY2Vzc2VzIGlucHV0IENTUyB0aHJvdWdoIHN5bmNocm9ub3VzIGFuZCBhc3luY2hyb25vdXMgcGx1Z2luc1xuICAgICAqIGFuZCBjYWxscyBgb25GdWxmaWxsZWRgIHdpdGggYSBSZXN1bHQgaW5zdGFuY2UuIElmIGEgcGx1Z2luIHRocm93c1xuICAgICAqIGFuIGVycm9yLCB0aGUgYG9uUmVqZWN0ZWRgIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQuXG4gICAgICpcbiAgICAgKiBJdCBpbXBsZW1lbnRzIHN0YW5kYXJkIFByb21pc2UgQVBJLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvbkZ1bGZpbGxlZH0gb25GdWxmaWxsZWQgLSBjYWxsYmFjayB3aWxsIGJlIGV4ZWN1dGVkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIGFsbCBwbHVnaW5zIHdpbGwgZmluaXNoIHdvcmtcbiAgICAgKiBAcGFyYW0ge29uUmVqZWN0ZWR9ICBvblJlamVjdGVkICAtIGNhbGxiYWNrIHdpbGwgYmUgZXhlY2l0ZWQgb24gYW55IGVycm9yXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIEFQSSB0byBtYWtlIHF1ZXVlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHBvc3Rjc3MoW2Nzc25leHRdKS5wcm9jZXNzKGNzcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAqICAgY29uc29sZS5sb2cocmVzdWx0LmNzcyk7XG4gICAgICogfSk7XG4gICAgICovXG4gICAgdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hc3luYygpLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3NlcyBpbnB1dCBDU1MgdGhyb3VnaCBzeW5jaHJvbm91cyBhbmQgYXN5bmNocm9ub3VzIHBsdWdpbnNcbiAgICAgKiBhbmQgY2FsbHMgb25SZWplY3RlZCBmb3IgZWFjaCBlcnJvciB0aHJvd24gaW4gYW55IHBsdWdpbi5cbiAgICAgKlxuICAgICAqIEl0IGltcGxlbWVudHMgc3RhbmRhcmQgUHJvbWlzZSBBUEkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29uUmVqZWN0ZWR9IG9uUmVqZWN0ZWQgLSBjYWxsYmFjayB3aWxsIGJlIGV4ZWNpdGVkIG9uIGFueSBlcnJvclxuICAgICAqXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSBBUEkgdG8gbWFrZSBxdWV1ZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBwb3N0Y3NzKFtjc3NuZXh0XSkucHJvY2Vzcyhjc3MpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgKiAgIGNvbnNvbGUubG9nKHJlc3VsdC5jc3MpO1xuICAgICAqIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgKiAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAqIH0pO1xuICAgICAqL1xuICAgIGNhdGNoKG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXN5bmMoKS5jYXRjaChvblJlamVjdGVkKTtcbiAgICB9XG5cbiAgICBoYW5kbGVFcnJvcihlcnJvciwgcGx1Z2luKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICBpZiAoIGVycm9yLm5hbWUgPT09ICdDc3NTeW50YXhFcnJvcicgJiYgIWVycm9yLnBsdWdpbiApIHtcbiAgICAgICAgICAgICAgICBlcnJvci5wbHVnaW4gPSBwbHVnaW4ucG9zdGNzc1BsdWdpbjtcbiAgICAgICAgICAgICAgICBlcnJvci5zZXRNZXNzYWdlKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBwbHVnaW4ucG9zdGNzc1ZlcnNpb24gKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBsdWdpbk5hbWUgPSBwbHVnaW4ucG9zdGNzc1BsdWdpbjtcbiAgICAgICAgICAgICAgICBsZXQgcGx1Z2luVmVyICA9IHBsdWdpbi5wb3N0Y3NzVmVyc2lvbjtcbiAgICAgICAgICAgICAgICBsZXQgcnVudGltZVZlciA9IHRoaXMucmVzdWx0LnByb2Nlc3Nvci52ZXJzaW9uO1xuICAgICAgICAgICAgICAgIGxldCBhID0gcGx1Z2luVmVyLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgbGV0IGIgPSBydW50aW1lVmVyLnNwbGl0KCcuJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGFbMF0gIT09IGJbMF0gfHwgcGFyc2VJbnQoYVsxXSkgPiBwYXJzZUludChiWzFdKSApIHtcbiAgICAgICAgICAgICAgICAgICAgd2Fybk9uY2UoJ1lvdXIgY3VycmVudCBQb3N0Q1NTIHZlcnNpb24gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpcyAnICsgcnVudGltZVZlciArICcsIGJ1dCAnICsgcGx1Z2luTmFtZSArICcgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1c2VzICcgKyBwbHVnaW5WZXIgKyAnLiBQZXJoYXBzIHRoaXMgaXMgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0aGUgc291cmNlIG9mIHRoZSBlcnJvciBiZWxvdy4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKCBjb25zb2xlICYmIGNvbnNvbGUuZXJyb3IgKSBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luY1RpY2socmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGlmICggdGhpcy5wbHVnaW4gPj0gdGhpcy5wcm9jZXNzb3IucGx1Z2lucy5sZW5ndGggKSB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBwbHVnaW4gID0gdGhpcy5wcm9jZXNzb3IucGx1Z2luc1t0aGlzLnBsdWdpbl07XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMucnVuKHBsdWdpbik7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbiArPSAxO1xuXG4gICAgICAgICAgICBpZiAoIGlzUHJvbWlzZShwcm9taXNlKSApIHtcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hc3luY1RpY2socmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCggZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKGVycm9yLCBwbHVnaW4pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYXN5bmNUaWNrKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYygpIHtcbiAgICAgICAgaWYgKCB0aGlzLnByb2Nlc3NlZCApIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggdGhpcy5lcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRoaXMuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5zdHJpbmdpZnkoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0aGlzLnByb2Nlc3NpbmcgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nID0gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmICggdGhpcy5lcnJvciApIHJldHVybiByZWplY3QodGhpcy5lcnJvcik7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbiA9IDA7XG4gICAgICAgICAgICB0aGlzLmFzeW5jVGljayhyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KS50aGVuKCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc2luZztcbiAgICB9XG5cbiAgICBzeW5jKCkge1xuICAgICAgICBpZiAoIHRoaXMucHJvY2Vzc2VkICkgcmV0dXJuIHRoaXMucmVzdWx0O1xuICAgICAgICB0aGlzLnByb2Nlc3NlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKCB0aGlzLnByb2Nlc3NpbmcgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgJ1VzZSBwcm9jZXNzKGNzcykudGhlbihjYikgdG8gd29yayB3aXRoIGFzeW5jIHBsdWdpbnMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggdGhpcy5lcnJvciApIHRocm93IHRoaXMuZXJyb3I7XG5cbiAgICAgICAgZm9yICggbGV0IHBsdWdpbiBvZiB0aGlzLnJlc3VsdC5wcm9jZXNzb3IucGx1Z2lucyApIHtcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5ydW4ocGx1Z2luKTtcbiAgICAgICAgICAgIGlmICggaXNQcm9taXNlKHByb21pc2UpICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBwcm9jZXNzKGNzcykudGhlbihjYikgdG8gd29yayB3aXRoIGFzeW5jIHBsdWdpbnMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdDtcbiAgICB9XG5cbiAgICBydW4ocGx1Z2luKSB7XG4gICAgICAgIHRoaXMucmVzdWx0Lmxhc3RQbHVnaW4gPSBwbHVnaW47XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW4odGhpcy5yZXN1bHQucm9vdCwgdGhpcy5yZXN1bHQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVFcnJvcihlcnJvciwgcGx1Z2luKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RyaW5naWZ5KCkge1xuICAgICAgICBpZiAoIHRoaXMuc3RyaW5naWZpZWQgKSByZXR1cm4gdGhpcy5yZXN1bHQ7XG4gICAgICAgIHRoaXMuc3RyaW5naWZpZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc3luYygpO1xuXG4gICAgICAgIGxldCBvcHRzID0gdGhpcy5yZXN1bHQub3B0cztcbiAgICAgICAgbGV0IHN0ciAgPSBzdHJpbmdpZnk7XG4gICAgICAgIGlmICggb3B0cy5zeW50YXggKSAgICAgIHN0ciA9IG9wdHMuc3ludGF4LnN0cmluZ2lmeTtcbiAgICAgICAgaWYgKCBvcHRzLnN0cmluZ2lmaWVyICkgc3RyID0gb3B0cy5zdHJpbmdpZmllcjtcbiAgICAgICAgaWYgKCBzdHIuc3RyaW5naWZ5ICkgICAgc3RyID0gc3RyLnN0cmluZ2lmeTtcblxuICAgICAgICBsZXQgbWFwICA9IG5ldyBNYXBHZW5lcmF0b3Ioc3RyLCB0aGlzLnJlc3VsdC5yb290LCB0aGlzLnJlc3VsdC5vcHRzKTtcbiAgICAgICAgbGV0IGRhdGEgPSBtYXAuZ2VuZXJhdGUoKTtcbiAgICAgICAgdGhpcy5yZXN1bHQuY3NzID0gZGF0YVswXTtcbiAgICAgICAgdGhpcy5yZXN1bHQubWFwID0gZGF0YVsxXTtcblxuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHQ7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IExhenlSZXN1bHQ7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
