'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _lazyResult = require('./lazy-result');

var _lazyResult2 = _interopRequireDefault(_lazyResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @callback builder
 * @param {string} part          - part of generated CSS connected to this node
 * @param {Node}   node          - AST node
 * @param {"start"|"end"} [type] - node’s part type
 */

/**
 * @callback parser
 *
 * @param {string|toString} css   - string with input CSS or any object
 *                                  with toString() method, like a Buffer
 * @param {processOptions} [opts] - options with only `from` and `map` keys
 *
 * @return {Root} PostCSS AST
 */

/**
 * @callback stringifier
 *
 * @param {Node} node       - start node for stringifing. Usually {@link Root}.
 * @param {builder} builder - function to concatenate CSS from node’s parts
 *                            or generate string and source map
 *
 * @return {void}
 */

/**
 * @typedef {object} syntax
 * @property {parser} parse          - function to generate AST by string
 * @property {stringifier} stringify - function to generate string by AST
 */

/**
 * @typedef {object} toString
 * @property {function} toString
 */

/**
 * @callback pluginFunction
 * @param {Root} root     - parsed input CSS
 * @param {Result} result - result to set warnings or check other plugins
 */

/**
 * @typedef {object} Plugin
 * @property {function} postcss - PostCSS plugin function
 */

/**
 * @typedef {object} processOptions
 * @property {string} from             - the path of the CSS source file.
 *                                       You should always set `from`,
 *                                       because it is used in source map
 *                                       generation and syntax error messages.
 * @property {string} to               - the path where you’ll put the output
 *                                       CSS file. You should always set `to`
 *                                       to generate correct source maps.
 * @property {parser} parser           - function to generate AST by string
 * @property {stringifier} stringifier - class to generate string by AST
 * @property {syntax} syntax           - object with `parse` and `stringify`
 * @property {object} map              - source map options
 * @property {boolean} map.inline                    - does source map should
 *                                                     be embedded in the output
 *                                                     CSS as a base64-encoded
 *                                                     comment
 * @property {string|object|false|function} map.prev - source map content
 *                                                     from a previous
 *                                                     processing step
 *                                                     (for example, Sass).
 *                                                     PostCSS will try to find
 *                                                     previous map
 *                                                     automatically, so you
 *                                                     could disable it by
 *                                                     `false` value.
 * @property {boolean} map.sourcesContent            - does PostCSS should set
 *                                                     the origin content to map
 * @property {string|false} map.annotation           - does PostCSS should set
 *                                                     annotation comment to map
 * @property {string} map.from                       - override `from` in map’s
 *                                                     `sources`
 */

/**
 * Contains plugins to process CSS. Create one `Processor` instance,
 * initialize its plugins, and then use that instance on numerous CSS files.
 *
 * @example
 * const processor = postcss([autoprefixer, precss]);
 * processor.process(css1).then(result => console.log(result.css));
 * processor.process(css2).then(result => console.log(result.css));
 */
var Processor = function () {

  /**
   * @param {Array.<Plugin|pluginFunction>|Processor} plugins - PostCSS
   *        plugins. See {@link Processor#use} for plugin format.
   */
  function Processor() {
    var plugins = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, Processor);

    /**
     * @member {string} - Current PostCSS version.
     *
     * @example
     * if ( result.processor.version.split('.')[0] !== '5' ) {
     *   throw new Error('This plugin works only with PostCSS 5');
     * }
     */
    this.version = '5.1.1';
    /**
     * @member {pluginFunction[]} - Plugins added to this processor.
     *
     * @example
     * const processor = postcss([autoprefixer, precss]);
     * processor.plugins.length //=> 2
     */
    this.plugins = this.normalize(plugins);
  }

  /**
   * Adds a plugin to be used as a CSS processor.
   *
   * PostCSS plugin can be in 4 formats:
   * * A plugin created by {@link postcss.plugin} method.
   * * A function. PostCSS will pass the function a @{link Root}
   *   as the first argument and current {@link Result} instance
   *   as the second.
   * * An object with a `postcss` method. PostCSS will use that method
   *   as described in #2.
   * * Another {@link Processor} instance. PostCSS will copy plugins
   *   from that instance into this one.
   *
   * Plugins can also be added by passing them as arguments when creating
   * a `postcss` instance (see [`postcss(plugins)`]).
   *
   * Asynchronous plugins should return a `Promise` instance.
   *
   * @param {Plugin|pluginFunction|Processor} plugin - PostCSS plugin
   *                                                   or {@link Processor}
   *                                                   with plugins
   *
   * @example
   * const processor = postcss()
   *   .use(autoprefixer)
   *   .use(precss);
   *
   * @return {Processes} current processor to make methods chain
   */


  Processor.prototype.use = function use(plugin) {
    this.plugins = this.plugins.concat(this.normalize([plugin]));
    return this;
  };

  /**
   * Parses source CSS and returns a {@link LazyResult} Promise proxy.
   * Because some plugins can be asynchronous it doesn’t make
   * any transformations. Transformations will be applied
   * in the {@link LazyResult} methods.
   *
   * @param {string|toString|Result} css - String with input CSS or
   *                                       any object with a `toString()`
   *                                       method, like a Buffer.
   *                                       Optionally, send a {@link Result}
   *                                       instance and the processor will
   *                                       take the {@link Root} from it.
   * @param {processOptions} [opts]      - options
   *
   * @return {LazyResult} Promise proxy
   *
   * @example
   * processor.process(css, { from: 'a.css', to: 'a.out.css' })
   *   .then(result => {
   *      console.log(result.css);
   *   });
   */


  Processor.prototype.process = function process(css) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return new _lazyResult2.default(this, css, opts);
  };

  Processor.prototype.normalize = function normalize(plugins) {
    var normalized = [];
    for (var _iterator = plugins, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var i = _ref;

      if (i.postcss) i = i.postcss;

      if ((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins);
      } else if (typeof i === 'function') {
        normalized.push(i);
      } else {
        throw new Error(i + ' is not a PostCSS plugin');
      }
    }
    return normalized;
  };

  return Processor;
}();

exports.default = Processor;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2Nlc3Nvci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUE7Ozs7Ozs7QUFPQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7O0FBVUE7Ozs7OztBQU1BOzs7OztBQUtBOzs7Ozs7QUFNQTs7Ozs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtDQTs7Ozs7Ozs7O0lBU00sUzs7QUFFRjs7OztBQUlBLHVCQUEwQjtBQUFBLFFBQWQsT0FBYyx5REFBSixFQUFJOztBQUFBOztBQUN0Qjs7Ozs7Ozs7QUFRQSxTQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0E7Ozs7Ozs7QUFPQSxTQUFLLE9BQUwsR0FBZSxLQUFLLFNBQUwsQ0FBZSxPQUFmLENBQWY7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkE2QkEsRyxnQkFBSSxNLEVBQVE7QUFDUixTQUFLLE9BQUwsR0FBZSxLQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLEtBQUssU0FBTCxDQUFlLENBQUMsTUFBRCxDQUFmLENBQXBCLENBQWY7QUFDQSxXQUFPLElBQVA7QUFDSCxHOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBc0JBLE8sb0JBQVEsRyxFQUFpQjtBQUFBLFFBQVosSUFBWSx5REFBTCxFQUFLOztBQUNyQixXQUFPLHlCQUFlLElBQWYsRUFBcUIsR0FBckIsRUFBMEIsSUFBMUIsQ0FBUDtBQUNILEc7O3NCQUVELFMsc0JBQVUsTyxFQUFTO0FBQ2YsUUFBSSxhQUFhLEVBQWpCO0FBQ0EseUJBQWUsT0FBZixrSEFBeUI7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLFVBQWYsQ0FBZTs7QUFDckIsVUFBSyxFQUFFLE9BQVAsRUFBaUIsSUFBSSxFQUFFLE9BQU47O0FBRWpCLFVBQUssUUFBTyxDQUFQLHlDQUFPLENBQVAsT0FBYSxRQUFiLElBQXlCLE1BQU0sT0FBTixDQUFjLEVBQUUsT0FBaEIsQ0FBOUIsRUFBeUQ7QUFDckQscUJBQWEsV0FBVyxNQUFYLENBQWtCLEVBQUUsT0FBcEIsQ0FBYjtBQUNILE9BRkQsTUFFTyxJQUFLLE9BQU8sQ0FBUCxLQUFhLFVBQWxCLEVBQStCO0FBQ2xDLG1CQUFXLElBQVgsQ0FBZ0IsQ0FBaEI7QUFDSCxPQUZNLE1BRUE7QUFDSCxjQUFNLElBQUksS0FBSixDQUFVLElBQUksMEJBQWQsQ0FBTjtBQUNIO0FBQ0o7QUFDRCxXQUFPLFVBQVA7QUFDSCxHOzs7OztrQkFJVSxTIiwiZmlsZSI6InByb2Nlc3Nvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXp5UmVzdWx0ICBmcm9tICcuL2xhenktcmVzdWx0JztcblxuLyoqXG4gKiBAY2FsbGJhY2sgYnVpbGRlclxuICogQHBhcmFtIHtzdHJpbmd9IHBhcnQgICAgICAgICAgLSBwYXJ0IG9mIGdlbmVyYXRlZCBDU1MgY29ubmVjdGVkIHRvIHRoaXMgbm9kZVxuICogQHBhcmFtIHtOb2RlfSAgIG5vZGUgICAgICAgICAgLSBBU1Qgbm9kZVxuICogQHBhcmFtIHtcInN0YXJ0XCJ8XCJlbmRcIn0gW3R5cGVdIC0gbm9kZeKAmXMgcGFydCB0eXBlXG4gKi9cblxuLyoqXG4gKiBAY2FsbGJhY2sgcGFyc2VyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8dG9TdHJpbmd9IGNzcyAgIC0gc3RyaW5nIHdpdGggaW5wdXQgQ1NTIG9yIGFueSBvYmplY3RcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggdG9TdHJpbmcoKSBtZXRob2QsIGxpa2UgYSBCdWZmZXJcbiAqIEBwYXJhbSB7cHJvY2Vzc09wdGlvbnN9IFtvcHRzXSAtIG9wdGlvbnMgd2l0aCBvbmx5IGBmcm9tYCBhbmQgYG1hcGAga2V5c1xuICpcbiAqIEByZXR1cm4ge1Jvb3R9IFBvc3RDU1MgQVNUXG4gKi9cblxuLyoqXG4gKiBAY2FsbGJhY2sgc3RyaW5naWZpZXJcbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgICAgICAgLSBzdGFydCBub2RlIGZvciBzdHJpbmdpZmluZy4gVXN1YWxseSB7QGxpbmsgUm9vdH0uXG4gKiBAcGFyYW0ge2J1aWxkZXJ9IGJ1aWxkZXIgLSBmdW5jdGlvbiB0byBjb25jYXRlbmF0ZSBDU1MgZnJvbSBub2Rl4oCZcyBwYXJ0c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgb3IgZ2VuZXJhdGUgc3RyaW5nIGFuZCBzb3VyY2UgbWFwXG4gKlxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IHN5bnRheFxuICogQHByb3BlcnR5IHtwYXJzZXJ9IHBhcnNlICAgICAgICAgIC0gZnVuY3Rpb24gdG8gZ2VuZXJhdGUgQVNUIGJ5IHN0cmluZ1xuICogQHByb3BlcnR5IHtzdHJpbmdpZmllcn0gc3RyaW5naWZ5IC0gZnVuY3Rpb24gdG8gZ2VuZXJhdGUgc3RyaW5nIGJ5IEFTVFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gdG9TdHJpbmdcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IHRvU3RyaW5nXG4gKi9cblxuLyoqXG4gKiBAY2FsbGJhY2sgcGx1Z2luRnVuY3Rpb25cbiAqIEBwYXJhbSB7Um9vdH0gcm9vdCAgICAgLSBwYXJzZWQgaW5wdXQgQ1NTXG4gKiBAcGFyYW0ge1Jlc3VsdH0gcmVzdWx0IC0gcmVzdWx0IHRvIHNldCB3YXJuaW5ncyBvciBjaGVjayBvdGhlciBwbHVnaW5zXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQbHVnaW5cbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IHBvc3Rjc3MgLSBQb3N0Q1NTIHBsdWdpbiBmdW5jdGlvblxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gcHJvY2Vzc09wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBmcm9tICAgICAgICAgICAgIC0gdGhlIHBhdGggb2YgdGhlIENTUyBzb3VyY2UgZmlsZS5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWW91IHNob3VsZCBhbHdheXMgc2V0IGBmcm9tYCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVjYXVzZSBpdCBpcyB1c2VkIGluIHNvdXJjZSBtYXBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGlvbiBhbmQgc3ludGF4IGVycm9yIG1lc3NhZ2VzLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRvICAgICAgICAgICAgICAgLSB0aGUgcGF0aCB3aGVyZSB5b3XigJlsbCBwdXQgdGhlIG91dHB1dFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU1MgZmlsZS4gWW91IHNob3VsZCBhbHdheXMgc2V0IGB0b2BcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gZ2VuZXJhdGUgY29ycmVjdCBzb3VyY2UgbWFwcy5cbiAqIEBwcm9wZXJ0eSB7cGFyc2VyfSBwYXJzZXIgICAgICAgICAgIC0gZnVuY3Rpb24gdG8gZ2VuZXJhdGUgQVNUIGJ5IHN0cmluZ1xuICogQHByb3BlcnR5IHtzdHJpbmdpZmllcn0gc3RyaW5naWZpZXIgLSBjbGFzcyB0byBnZW5lcmF0ZSBzdHJpbmcgYnkgQVNUXG4gKiBAcHJvcGVydHkge3N5bnRheH0gc3ludGF4ICAgICAgICAgICAtIG9iamVjdCB3aXRoIGBwYXJzZWAgYW5kIGBzdHJpbmdpZnlgXG4gKiBAcHJvcGVydHkge29iamVjdH0gbWFwICAgICAgICAgICAgICAtIHNvdXJjZSBtYXAgb3B0aW9uc1xuICogQHByb3BlcnR5IHtib29sZWFufSBtYXAuaW5saW5lICAgICAgICAgICAgICAgICAgICAtIGRvZXMgc291cmNlIG1hcCBzaG91bGRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZSBlbWJlZGRlZCBpbiB0aGUgb3V0cHV0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTIGFzIGEgYmFzZTY0LWVuY29kZWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50XG4gKiBAcHJvcGVydHkge3N0cmluZ3xvYmplY3R8ZmFsc2V8ZnVuY3Rpb259IG1hcC5wcmV2IC0gc291cmNlIG1hcCBjb250ZW50XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBhIHByZXZpb3VzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc2luZyBzdGVwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZvciBleGFtcGxlLCBTYXNzKS5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQb3N0Q1NTIHdpbGwgdHJ5IHRvIGZpbmRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91cyBtYXBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRvbWF0aWNhbGx5LCBzbyB5b3VcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VsZCBkaXNhYmxlIGl0IGJ5XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGZhbHNlYCB2YWx1ZS5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gbWFwLnNvdXJjZXNDb250ZW50ICAgICAgICAgICAgLSBkb2VzIFBvc3RDU1Mgc2hvdWxkIHNldFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBvcmlnaW4gY29udGVudCB0byBtYXBcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfGZhbHNlfSBtYXAuYW5ub3RhdGlvbiAgICAgICAgICAgLSBkb2VzIFBvc3RDU1Mgc2hvdWxkIHNldFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFubm90YXRpb24gY29tbWVudCB0byBtYXBcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtYXAuZnJvbSAgICAgICAgICAgICAgICAgICAgICAgLSBvdmVycmlkZSBgZnJvbWAgaW4gbWFw4oCZc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBzb3VyY2VzYFxuICovXG5cbi8qKlxuICogQ29udGFpbnMgcGx1Z2lucyB0byBwcm9jZXNzIENTUy4gQ3JlYXRlIG9uZSBgUHJvY2Vzc29yYCBpbnN0YW5jZSxcbiAqIGluaXRpYWxpemUgaXRzIHBsdWdpbnMsIGFuZCB0aGVuIHVzZSB0aGF0IGluc3RhbmNlIG9uIG51bWVyb3VzIENTUyBmaWxlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcHJvY2Vzc29yID0gcG9zdGNzcyhbYXV0b3ByZWZpeGVyLCBwcmVjc3NdKTtcbiAqIHByb2Nlc3Nvci5wcm9jZXNzKGNzczEpLnRoZW4ocmVzdWx0ID0+IGNvbnNvbGUubG9nKHJlc3VsdC5jc3MpKTtcbiAqIHByb2Nlc3Nvci5wcm9jZXNzKGNzczIpLnRoZW4ocmVzdWx0ID0+IGNvbnNvbGUubG9nKHJlc3VsdC5jc3MpKTtcbiAqL1xuY2xhc3MgUHJvY2Vzc29yIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXJyYXkuPFBsdWdpbnxwbHVnaW5GdW5jdGlvbj58UHJvY2Vzc29yfSBwbHVnaW5zIC0gUG9zdENTU1xuICAgICAqICAgICAgICBwbHVnaW5zLiBTZWUge0BsaW5rIFByb2Nlc3NvciN1c2V9IGZvciBwbHVnaW4gZm9ybWF0LlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBsdWdpbnMgPSBbXSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIEN1cnJlbnQgUG9zdENTUyB2ZXJzaW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBpZiAoIHJlc3VsdC5wcm9jZXNzb3IudmVyc2lvbi5zcGxpdCgnLicpWzBdICE9PSAnNScgKSB7XG4gICAgICAgICAqICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIHBsdWdpbiB3b3JrcyBvbmx5IHdpdGggUG9zdENTUyA1Jyk7XG4gICAgICAgICAqIH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudmVyc2lvbiA9ICc1LjEuMSc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtwbHVnaW5GdW5jdGlvbltdfSAtIFBsdWdpbnMgYWRkZWQgdG8gdGhpcyBwcm9jZXNzb3IuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGNvbnN0IHByb2Nlc3NvciA9IHBvc3Rjc3MoW2F1dG9wcmVmaXhlciwgcHJlY3NzXSk7XG4gICAgICAgICAqIHByb2Nlc3Nvci5wbHVnaW5zLmxlbmd0aCAvLz0+IDJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGx1Z2lucyA9IHRoaXMubm9ybWFsaXplKHBsdWdpbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBwbHVnaW4gdG8gYmUgdXNlZCBhcyBhIENTUyBwcm9jZXNzb3IuXG4gICAgICpcbiAgICAgKiBQb3N0Q1NTIHBsdWdpbiBjYW4gYmUgaW4gNCBmb3JtYXRzOlxuICAgICAqICogQSBwbHVnaW4gY3JlYXRlZCBieSB7QGxpbmsgcG9zdGNzcy5wbHVnaW59IG1ldGhvZC5cbiAgICAgKiAqIEEgZnVuY3Rpb24uIFBvc3RDU1Mgd2lsbCBwYXNzIHRoZSBmdW5jdGlvbiBhIEB7bGluayBSb290fVxuICAgICAqICAgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IGFuZCBjdXJyZW50IHtAbGluayBSZXN1bHR9IGluc3RhbmNlXG4gICAgICogICBhcyB0aGUgc2Vjb25kLlxuICAgICAqICogQW4gb2JqZWN0IHdpdGggYSBgcG9zdGNzc2AgbWV0aG9kLiBQb3N0Q1NTIHdpbGwgdXNlIHRoYXQgbWV0aG9kXG4gICAgICogICBhcyBkZXNjcmliZWQgaW4gIzIuXG4gICAgICogKiBBbm90aGVyIHtAbGluayBQcm9jZXNzb3J9IGluc3RhbmNlLiBQb3N0Q1NTIHdpbGwgY29weSBwbHVnaW5zXG4gICAgICogICBmcm9tIHRoYXQgaW5zdGFuY2UgaW50byB0aGlzIG9uZS5cbiAgICAgKlxuICAgICAqIFBsdWdpbnMgY2FuIGFsc28gYmUgYWRkZWQgYnkgcGFzc2luZyB0aGVtIGFzIGFyZ3VtZW50cyB3aGVuIGNyZWF0aW5nXG4gICAgICogYSBgcG9zdGNzc2AgaW5zdGFuY2UgKHNlZSBbYHBvc3Rjc3MocGx1Z2lucylgXSkuXG4gICAgICpcbiAgICAgKiBBc3luY2hyb25vdXMgcGx1Z2lucyBzaG91bGQgcmV0dXJuIGEgYFByb21pc2VgIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQbHVnaW58cGx1Z2luRnVuY3Rpb258UHJvY2Vzc29yfSBwbHVnaW4gLSBQb3N0Q1NTIHBsdWdpblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3Ige0BsaW5rIFByb2Nlc3Nvcn1cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggcGx1Z2luc1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCBwcm9jZXNzb3IgPSBwb3N0Y3NzKClcbiAgICAgKiAgIC51c2UoYXV0b3ByZWZpeGVyKVxuICAgICAqICAgLnVzZShwcmVjc3MpO1xuICAgICAqXG4gICAgICogQHJldHVybiB7UHJvY2Vzc2VzfSBjdXJyZW50IHByb2Nlc3NvciB0byBtYWtlIG1ldGhvZHMgY2hhaW5cbiAgICAgKi9cbiAgICB1c2UocGx1Z2luKSB7XG4gICAgICAgIHRoaXMucGx1Z2lucyA9IHRoaXMucGx1Z2lucy5jb25jYXQodGhpcy5ub3JtYWxpemUoW3BsdWdpbl0pKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2VzIHNvdXJjZSBDU1MgYW5kIHJldHVybnMgYSB7QGxpbmsgTGF6eVJlc3VsdH0gUHJvbWlzZSBwcm94eS5cbiAgICAgKiBCZWNhdXNlIHNvbWUgcGx1Z2lucyBjYW4gYmUgYXN5bmNocm9ub3VzIGl0IGRvZXNu4oCZdCBtYWtlXG4gICAgICogYW55IHRyYW5zZm9ybWF0aW9ucy4gVHJhbnNmb3JtYXRpb25zIHdpbGwgYmUgYXBwbGllZFxuICAgICAqIGluIHRoZSB7QGxpbmsgTGF6eVJlc3VsdH0gbWV0aG9kcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfHRvU3RyaW5nfFJlc3VsdH0gY3NzIC0gU3RyaW5nIHdpdGggaW5wdXQgQ1NTIG9yXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnkgb2JqZWN0IHdpdGggYSBgdG9TdHJpbmcoKWBcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZCwgbGlrZSBhIEJ1ZmZlci5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9wdGlvbmFsbHksIHNlbmQgYSB7QGxpbmsgUmVzdWx0fVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgYW5kIHRoZSBwcm9jZXNzb3Igd2lsbFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFrZSB0aGUge0BsaW5rIFJvb3R9IGZyb20gaXQuXG4gICAgICogQHBhcmFtIHtwcm9jZXNzT3B0aW9uc30gW29wdHNdICAgICAgLSBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtMYXp5UmVzdWx0fSBQcm9taXNlIHByb3h5XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHByb2Nlc3Nvci5wcm9jZXNzKGNzcywgeyBmcm9tOiAnYS5jc3MnLCB0bzogJ2Eub3V0LmNzcycgfSlcbiAgICAgKiAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICogICAgICBjb25zb2xlLmxvZyhyZXN1bHQuY3NzKTtcbiAgICAgKiAgIH0pO1xuICAgICAqL1xuICAgIHByb2Nlc3MoY3NzLCBvcHRzID0geyB9KSB7XG4gICAgICAgIHJldHVybiBuZXcgTGF6eVJlc3VsdCh0aGlzLCBjc3MsIG9wdHMpO1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZShwbHVnaW5zKSB7XG4gICAgICAgIGxldCBub3JtYWxpemVkID0gW107XG4gICAgICAgIGZvciAoIGxldCBpIG9mIHBsdWdpbnMgKSB7XG4gICAgICAgICAgICBpZiAoIGkucG9zdGNzcyApIGkgPSBpLnBvc3Rjc3M7XG5cbiAgICAgICAgICAgIGlmICggdHlwZW9mIGkgPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkoaS5wbHVnaW5zKSApIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkID0gbm9ybWFsaXplZC5jb25jYXQoaS5wbHVnaW5zKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBpID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWQucHVzaChpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGkgKyAnIGlzIG5vdCBhIFBvc3RDU1MgcGx1Z2luJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb2Nlc3NvcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
