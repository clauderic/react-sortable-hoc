'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _warning = require('./warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef  {object} Message
 * @property {string} type   - message type
 * @property {string} plugin - source PostCSS plugin name
 */

/**
 * Provides the result of the PostCSS transformations.
 *
 * A Result instance is returned by {@link LazyResult#then}
 * or {@link Root#toResult} methods.
 *
 * @example
 * postcss([cssnext]).process(css).then(function (result) {
 *    console.log(result.css);
 * });
 *
 * @example
 * var result2 = postcss.parse(css).toResult();
 */
var Result = function () {

  /**
   * @param {Processor} processor - processor used for this transformation.
   * @param {Root}      root      - Root node after all transformations.
   * @param {processOptions} opts - options from the {@link Processor#process}
   *                                or {@link Root#toResult}
   */
  function Result(processor, root, opts) {
    _classCallCheck(this, Result);

    /**
     * @member {Processor} - The Processor instance used
     *                       for this transformation.
     *
     * @example
     * for ( let plugin of result.processor.plugins) {
     *   if ( plugin.postcssPlugin === 'postcss-bad' ) {
     *     throw 'postcss-good is incompatible with postcss-bad';
     *   }
     * });
     */
    this.processor = processor;
    /**
     * @member {Message[]} - Contains messages from plugins
     *                       (e.g., warnings or custom messages).
     *                       Each message should have type
     *                       and plugin properties.
     *
     * @example
     * postcss.plugin('postcss-min-browser', () => {
     *   return (css, result) => {
     *     var browsers = detectMinBrowsersByCanIUse(css);
     *     result.messages.push({
     *       type:    'min-browser',
     *       plugin:  'postcss-min-browser',
     *       browsers: browsers
     *     });
     *   };
     * });
     */
    this.messages = [];
    /**
     * @member {Root} - Root node after all transformations.
     *
     * @example
     * root.toResult().root == root;
     */
    this.root = root;
    /**
     * @member {processOptions} - Options from the {@link Processor#process}
     *                            or {@link Root#toResult} call
     *                            that produced this Result instance.
     *
     * @example
     * root.toResult(opts).opts == opts;
     */
    this.opts = opts;
    /**
     * @member {string} - A CSS string representing of {@link Result#root}.
     *
     * @example
     * postcss.parse('a{}').toResult().css //=> "a{}"
     */
    this.css = undefined;
    /**
     * @member {SourceMapGenerator} - An instance of `SourceMapGenerator`
     *                                class from the `source-map` library,
     *                                representing changes
     *                                to the {@link Result#root} instance.
     *
     * @example
     * result.map.toJSON() //=> { version: 3, file: 'a.css', … }
     *
     * @example
     * if ( result.map ) {
     *   fs.writeFileSync(result.opts.to + '.map', result.map.toString());
     * }
     */
    this.map = undefined;
  }

  /**
   * Returns for @{link Result#css} content.
   *
   * @example
   * result + '' === result.css
   *
   * @return {string} string representing of {@link Result#root}
   */


  Result.prototype.toString = function toString() {
    return this.css;
  };

  /**
   * Creates an instance of {@link Warning} and adds it
   * to {@link Result#messages}.
   *
   * @param {string} text        - warning message
   * @param {Object} [opts]      - warning options
   * @param {Node}   opts.node   - CSS node that caused the warning
   * @param {string} opts.word   - word in CSS source that caused the warning
   * @param {number} opts.index  - index in CSS node string that caused
   *                               the warning
   * @param {string} opts.plugin - name of the plugin that created
   *                               this warning. {@link Result#warn} fills
   *                               this property automatically.
   *
   * @return {Warning} created warning
   */


  Result.prototype.warn = function warn(text) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin;
      }
    }

    var warning = new _warning2.default(text, opts);
    this.messages.push(warning);

    return warning;
  };

  /**
   * Returns warnings from plugins. Filters {@link Warning} instances
   * from {@link Result#messages}.
   *
   * @example
   * result.warnings().forEach(warn => {
   *   console.warn(warn.toString());
   * });
   *
   * @return {Warning[]} warnings from plugins
   */


  Result.prototype.warnings = function warnings() {
    return this.messages.filter(function (i) {
      return i.type === 'warning';
    });
  };

  /**
   * An alias for the {@link Result#css} property.
   * Use it with syntaxes that generate non-CSS output.
   * @type {string}
   *
   * @example
   * result.css === result.content;
   */


  _createClass(Result, [{
    key: 'content',
    get: function get() {
      return this.css;
    }
  }]);

  return Result;
}();

exports.default = Result;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3VsdC5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUE7Ozs7OztBQU1BOzs7Ozs7Ozs7Ozs7OztJQWNNLE07O0FBRUY7Ozs7OztBQU1BLGtCQUFZLFNBQVosRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0IsRUFBbUM7QUFBQTs7QUFDL0I7Ozs7Ozs7Ozs7O0FBV0EsU0FBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxTQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQTs7Ozs7O0FBTUEsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBOzs7Ozs7OztBQVFBLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDQTs7Ozs7O0FBTUEsU0FBSyxHQUFMLEdBQVcsU0FBWDtBQUNBOzs7Ozs7Ozs7Ozs7OztBQWNBLFNBQUssR0FBTCxHQUFXLFNBQVg7QUFDSDs7QUFFRDs7Ozs7Ozs7OzttQkFRQSxRLHVCQUFXO0FBQ1AsV0FBTyxLQUFLLEdBQVo7QUFDSCxHOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7bUJBZ0JBLEksaUJBQUssSSxFQUFrQjtBQUFBLFFBQVosSUFBWSx5REFBTCxFQUFLOztBQUNuQixRQUFLLENBQUMsS0FBSyxNQUFYLEVBQW9CO0FBQ2hCLFVBQUssS0FBSyxVQUFMLElBQW1CLEtBQUssVUFBTCxDQUFnQixhQUF4QyxFQUF3RDtBQUNwRCxhQUFLLE1BQUwsR0FBYyxLQUFLLFVBQUwsQ0FBZ0IsYUFBOUI7QUFDSDtBQUNKOztBQUVELFFBQUksVUFBVSxzQkFBWSxJQUFaLEVBQWtCLElBQWxCLENBQWQ7QUFDQSxTQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLE9BQW5COztBQUVBLFdBQU8sT0FBUDtBQUNILEc7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7bUJBV0EsUSx1QkFBVztBQUNQLFdBQU8sS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFzQjtBQUFBLGFBQUssRUFBRSxJQUFGLEtBQVcsU0FBaEI7QUFBQSxLQUF0QixDQUFQO0FBQ0gsRzs7QUFFRDs7Ozs7Ozs7Ozs7O3dCQVFjO0FBQ1YsYUFBTyxLQUFLLEdBQVo7QUFDSDs7Ozs7O2tCQUlVLE0iLCJmaWxlIjoicmVzdWx0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFdhcm5pbmcgZnJvbSAnLi93YXJuaW5nJztcblxuLyoqXG4gKiBAdHlwZWRlZiAge29iamVjdH0gTWVzc2FnZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgICAtIG1lc3NhZ2UgdHlwZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHBsdWdpbiAtIHNvdXJjZSBQb3N0Q1NTIHBsdWdpbiBuYW1lXG4gKi9cblxuLyoqXG4gKiBQcm92aWRlcyB0aGUgcmVzdWx0IG9mIHRoZSBQb3N0Q1NTIHRyYW5zZm9ybWF0aW9ucy5cbiAqXG4gKiBBIFJlc3VsdCBpbnN0YW5jZSBpcyByZXR1cm5lZCBieSB7QGxpbmsgTGF6eVJlc3VsdCN0aGVufVxuICogb3Ige0BsaW5rIFJvb3QjdG9SZXN1bHR9IG1ldGhvZHMuXG4gKlxuICogQGV4YW1wbGVcbiAqIHBvc3Rjc3MoW2Nzc25leHRdKS5wcm9jZXNzKGNzcykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gKiAgICBjb25zb2xlLmxvZyhyZXN1bHQuY3NzKTtcbiAqIH0pO1xuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgcmVzdWx0MiA9IHBvc3Rjc3MucGFyc2UoY3NzKS50b1Jlc3VsdCgpO1xuICovXG5jbGFzcyBSZXN1bHQge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtQcm9jZXNzb3J9IHByb2Nlc3NvciAtIHByb2Nlc3NvciB1c2VkIGZvciB0aGlzIHRyYW5zZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um9vdH0gICAgICByb290ICAgICAgLSBSb290IG5vZGUgYWZ0ZXIgYWxsIHRyYW5zZm9ybWF0aW9ucy5cbiAgICAgKiBAcGFyYW0ge3Byb2Nlc3NPcHRpb25zfSBvcHRzIC0gb3B0aW9ucyBmcm9tIHRoZSB7QGxpbmsgUHJvY2Vzc29yI3Byb2Nlc3N9XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIHtAbGluayBSb290I3RvUmVzdWx0fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByb2Nlc3Nvciwgcm9vdCwgb3B0cykge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UHJvY2Vzc29yfSAtIFRoZSBQcm9jZXNzb3IgaW5zdGFuY2UgdXNlZFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgZm9yIHRoaXMgdHJhbnNmb3JtYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGZvciAoIGxldCBwbHVnaW4gb2YgcmVzdWx0LnByb2Nlc3Nvci5wbHVnaW5zKSB7XG4gICAgICAgICAqICAgaWYgKCBwbHVnaW4ucG9zdGNzc1BsdWdpbiA9PT0gJ3Bvc3Rjc3MtYmFkJyApIHtcbiAgICAgICAgICogICAgIHRocm93ICdwb3N0Y3NzLWdvb2QgaXMgaW5jb21wYXRpYmxlIHdpdGggcG9zdGNzcy1iYWQnO1xuICAgICAgICAgKiAgIH1cbiAgICAgICAgICogfSk7XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnByb2Nlc3NvciA9IHByb2Nlc3NvcjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge01lc3NhZ2VbXX0gLSBDb250YWlucyBtZXNzYWdlcyBmcm9tIHBsdWdpbnNcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgIChlLmcuLCB3YXJuaW5ncyBvciBjdXN0b20gbWVzc2FnZXMpLlxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgRWFjaCBtZXNzYWdlIHNob3VsZCBoYXZlIHR5cGVcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgIGFuZCBwbHVnaW4gcHJvcGVydGllcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogcG9zdGNzcy5wbHVnaW4oJ3Bvc3Rjc3MtbWluLWJyb3dzZXInLCAoKSA9PiB7XG4gICAgICAgICAqICAgcmV0dXJuIChjc3MsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgKiAgICAgdmFyIGJyb3dzZXJzID0gZGV0ZWN0TWluQnJvd3NlcnNCeUNhbklVc2UoY3NzKTtcbiAgICAgICAgICogICAgIHJlc3VsdC5tZXNzYWdlcy5wdXNoKHtcbiAgICAgICAgICogICAgICAgdHlwZTogICAgJ21pbi1icm93c2VyJyxcbiAgICAgICAgICogICAgICAgcGx1Z2luOiAgJ3Bvc3Rjc3MtbWluLWJyb3dzZXInLFxuICAgICAgICAgKiAgICAgICBicm93c2VyczogYnJvd3NlcnNcbiAgICAgICAgICogICAgIH0pO1xuICAgICAgICAgKiAgIH07XG4gICAgICAgICAqIH0pO1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5tZXNzYWdlcyA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7Um9vdH0gLSBSb290IG5vZGUgYWZ0ZXIgYWxsIHRyYW5zZm9ybWF0aW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogcm9vdC50b1Jlc3VsdCgpLnJvb3QgPT0gcm9vdDtcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucm9vdCA9IHJvb3Q7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtwcm9jZXNzT3B0aW9uc30gLSBPcHRpb25zIGZyb20gdGhlIHtAbGluayBQcm9jZXNzb3IjcHJvY2Vzc31cbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgb3Ige0BsaW5rIFJvb3QjdG9SZXN1bHR9IGNhbGxcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCBwcm9kdWNlZCB0aGlzIFJlc3VsdCBpbnN0YW5jZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogcm9vdC50b1Jlc3VsdChvcHRzKS5vcHRzID09IG9wdHM7XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm9wdHMgPSBvcHRzO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIEEgQ1NTIHN0cmluZyByZXByZXNlbnRpbmcgb2Yge0BsaW5rIFJlc3VsdCNyb290fS5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogcG9zdGNzcy5wYXJzZSgnYXt9JykudG9SZXN1bHQoKS5jc3MgLy89PiBcImF7fVwiXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNzcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1NvdXJjZU1hcEdlbmVyYXRvcn0gLSBBbiBpbnN0YW5jZSBvZiBgU291cmNlTWFwR2VuZXJhdG9yYFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3MgZnJvbSB0aGUgYHNvdXJjZS1tYXBgIGxpYnJhcnksXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXByZXNlbnRpbmcgY2hhbmdlc1xuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gdGhlIHtAbGluayBSZXN1bHQjcm9vdH0gaW5zdGFuY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHJlc3VsdC5tYXAudG9KU09OKCkgLy89PiB7IHZlcnNpb246IDMsIGZpbGU6ICdhLmNzcycsIOKApiB9XG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGlmICggcmVzdWx0Lm1hcCApIHtcbiAgICAgICAgICogICBmcy53cml0ZUZpbGVTeW5jKHJlc3VsdC5vcHRzLnRvICsgJy5tYXAnLCByZXN1bHQubWFwLnRvU3RyaW5nKCkpO1xuICAgICAgICAgKiB9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm1hcCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGZvciBAe2xpbmsgUmVzdWx0I2Nzc30gY29udGVudC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcmVzdWx0ICsgJycgPT09IHJlc3VsdC5jc3NcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGluZyBvZiB7QGxpbmsgUmVzdWx0I3Jvb3R9XG4gICAgICovXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNzcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHtAbGluayBXYXJuaW5nfSBhbmQgYWRkcyBpdFxuICAgICAqIHRvIHtAbGluayBSZXN1bHQjbWVzc2FnZXN9LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgICAgICAgIC0gd2FybmluZyBtZXNzYWdlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXSAgICAgIC0gd2FybmluZyBvcHRpb25zXG4gICAgICogQHBhcmFtIHtOb2RlfSAgIG9wdHMubm9kZSAgIC0gQ1NTIG5vZGUgdGhhdCBjYXVzZWQgdGhlIHdhcm5pbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0cy53b3JkICAgLSB3b3JkIGluIENTUyBzb3VyY2UgdGhhdCBjYXVzZWQgdGhlIHdhcm5pbmdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3B0cy5pbmRleCAgLSBpbmRleCBpbiBDU1Mgbm9kZSBzdHJpbmcgdGhhdCBjYXVzZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgd2FybmluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLnBsdWdpbiAtIG5hbWUgb2YgdGhlIHBsdWdpbiB0aGF0IGNyZWF0ZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIHdhcm5pbmcuIHtAbGluayBSZXN1bHQjd2Fybn0gZmlsbHNcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIHByb3BlcnR5IGF1dG9tYXRpY2FsbHkuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtXYXJuaW5nfSBjcmVhdGVkIHdhcm5pbmdcbiAgICAgKi9cbiAgICB3YXJuKHRleHQsIG9wdHMgPSB7IH0pIHtcbiAgICAgICAgaWYgKCAhb3B0cy5wbHVnaW4gKSB7XG4gICAgICAgICAgICBpZiAoIHRoaXMubGFzdFBsdWdpbiAmJiB0aGlzLmxhc3RQbHVnaW4ucG9zdGNzc1BsdWdpbiApIHtcbiAgICAgICAgICAgICAgICBvcHRzLnBsdWdpbiA9IHRoaXMubGFzdFBsdWdpbi5wb3N0Y3NzUGx1Z2luO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHdhcm5pbmcgPSBuZXcgV2FybmluZyh0ZXh0LCBvcHRzKTtcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKHdhcm5pbmcpO1xuXG4gICAgICAgIHJldHVybiB3YXJuaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2FybmluZ3MgZnJvbSBwbHVnaW5zLiBGaWx0ZXJzIHtAbGluayBXYXJuaW5nfSBpbnN0YW5jZXNcbiAgICAgKiBmcm9tIHtAbGluayBSZXN1bHQjbWVzc2FnZXN9LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByZXN1bHQud2FybmluZ3MoKS5mb3JFYWNoKHdhcm4gPT4ge1xuICAgICAqICAgY29uc29sZS53YXJuKHdhcm4udG9TdHJpbmcoKSk7XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtXYXJuaW5nW119IHdhcm5pbmdzIGZyb20gcGx1Z2luc1xuICAgICAqL1xuICAgIHdhcm5pbmdzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlcy5maWx0ZXIoIGkgPT4gaS50eXBlID09PSAnd2FybmluZycgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBhbGlhcyBmb3IgdGhlIHtAbGluayBSZXN1bHQjY3NzfSBwcm9wZXJ0eS5cbiAgICAgKiBVc2UgaXQgd2l0aCBzeW50YXhlcyB0aGF0IGdlbmVyYXRlIG5vbi1DU1Mgb3V0cHV0LlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJlc3VsdC5jc3MgPT09IHJlc3VsdC5jb250ZW50O1xuICAgICAqL1xuICAgIGdldCBjb250ZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jc3M7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3VsdDtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
