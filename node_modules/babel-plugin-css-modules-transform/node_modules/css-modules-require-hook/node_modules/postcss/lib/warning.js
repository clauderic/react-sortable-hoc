'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents a plugin’s warning. It can be created using {@link Node#warn}.
 *
 * @example
 * if ( decl.important ) {
 *     decl.warn(result, 'Avoid !important', { word: '!important' });
 * }
 */
var Warning = function () {

  /**
   * @param {string} text        - warning message
   * @param {Object} [opts]      - warning options
   * @param {Node}   opts.node   - CSS node that caused the warning
   * @param {string} opts.word   - word in CSS source that caused the warning
   * @param {number} opts.index  - index in CSS node string that caused
   *                               the warning
   * @param {string} opts.plugin - name of the plugin that created
   *                               this warning. {@link Result#warn} fills
   *                               this property automatically.
   */
  function Warning(text) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Warning);

    /**
     * @member {string} - Type to filter warnings from
     *                    {@link Result#messages}. Always equal
     *                    to `"warning"`.
     *
     * @example
     * const nonWarning = result.messages.filter(i => i.type !== 'warning')
     */
    this.type = 'warning';
    /**
     * @member {string} - The warning message.
     *
     * @example
     * warning.text //=> 'Try to avoid !important'
     */
    this.text = text;

    if (opts.node && opts.node.source) {
      var pos = opts.node.positionBy(opts);
      /**
       * @member {number} - Line in the input file
       *                    with this warning’s source
       *
       * @example
       * warning.line //=> 5
       */
      this.line = pos.line;
      /**
       * @member {number} - Column in the input file
       *                    with this warning’s source.
       *
       * @example
       * warning.column //=> 6
       */
      this.column = pos.column;
    }

    for (var opt in opts) {
      this[opt] = opts[opt];
    }
  }

  /**
   * Returns a warning position and message.
   *
   * @example
   * warning.toString() //=> 'postcss-lint:a.css:10:14: Avoid !important'
   *
   * @return {string} warning position and message
   */


  Warning.prototype.toString = function toString() {
    if (this.node) {
      return this.node.error(this.text, {
        plugin: this.plugin,
        index: this.index,
        word: this.word
      }).message;
    } else if (this.plugin) {
      return this.plugin + ': ' + this.text;
    } else {
      return this.text;
    }
  };

  /**
   * @memberof Warning#
   * @member {string} plugin - The name of the plugin that created
   *                           it will fill this property automatically.
   *                           this warning. When you call {@link Node#warn}
   *
   * @example
   * warning.plugin //=> 'postcss-important'
   */

  /**
   * @memberof Warning#
   * @member {Node} node - Contains the CSS node that caused the warning.
   *
   * @example
   * warning.node.toString() //=> 'color: white !important'
   */

  return Warning;
}();

exports.default = Warning;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhcm5pbmcuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7OztJQVFNLE87O0FBRUY7Ozs7Ozs7Ozs7O0FBV0EsbUJBQVksSUFBWixFQUE4QjtBQUFBLFFBQVosSUFBWSx5REFBTCxFQUFLOztBQUFBOztBQUMxQjs7Ozs7Ozs7QUFRQSxTQUFLLElBQUwsR0FBWSxTQUFaO0FBQ0E7Ozs7OztBQU1BLFNBQUssSUFBTCxHQUFZLElBQVo7O0FBRUEsUUFBSyxLQUFLLElBQUwsSUFBYSxLQUFLLElBQUwsQ0FBVSxNQUE1QixFQUFxQztBQUNqQyxVQUFJLE1BQVUsS0FBSyxJQUFMLENBQVUsVUFBVixDQUFxQixJQUFyQixDQUFkO0FBQ0E7Ozs7Ozs7QUFPQSxXQUFLLElBQUwsR0FBYyxJQUFJLElBQWxCO0FBQ0E7Ozs7Ozs7QUFPQSxXQUFLLE1BQUwsR0FBYyxJQUFJLE1BQWxCO0FBQ0g7O0FBRUQsU0FBTSxJQUFJLEdBQVYsSUFBaUIsSUFBakI7QUFBd0IsV0FBSyxHQUFMLElBQVksS0FBSyxHQUFMLENBQVo7QUFBeEI7QUFDSDs7QUFFRDs7Ozs7Ozs7OztvQkFRQSxRLHVCQUFXO0FBQ1AsUUFBSyxLQUFLLElBQVYsRUFBaUI7QUFDYixhQUFPLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsS0FBSyxJQUFyQixFQUEyQjtBQUM5QixnQkFBUSxLQUFLLE1BRGlCO0FBRTlCLGVBQVEsS0FBSyxLQUZpQjtBQUc5QixjQUFRLEtBQUs7QUFIaUIsT0FBM0IsRUFJSixPQUpIO0FBS0gsS0FORCxNQU1PLElBQUssS0FBSyxNQUFWLEVBQW1CO0FBQ3RCLGFBQU8sS0FBSyxNQUFMLEdBQWMsSUFBZCxHQUFxQixLQUFLLElBQWpDO0FBQ0gsS0FGTSxNQUVBO0FBQ0gsYUFBTyxLQUFLLElBQVo7QUFDSDtBQUNKLEc7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7a0JBVVcsTyIsImZpbGUiOiJ3YXJuaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZXByZXNlbnRzIGEgcGx1Z2lu4oCZcyB3YXJuaW5nLiBJdCBjYW4gYmUgY3JlYXRlZCB1c2luZyB7QGxpbmsgTm9kZSN3YXJufS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaWYgKCBkZWNsLmltcG9ydGFudCApIHtcbiAqICAgICBkZWNsLndhcm4ocmVzdWx0LCAnQXZvaWQgIWltcG9ydGFudCcsIHsgd29yZDogJyFpbXBvcnRhbnQnIH0pO1xuICogfVxuICovXG5jbGFzcyBXYXJuaW5nIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0ICAgICAgICAtIHdhcm5pbmcgbWVzc2FnZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0c10gICAgICAtIHdhcm5pbmcgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7Tm9kZX0gICBvcHRzLm5vZGUgICAtIENTUyBub2RlIHRoYXQgY2F1c2VkIHRoZSB3YXJuaW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdHMud29yZCAgIC0gd29yZCBpbiBDU1Mgc291cmNlIHRoYXQgY2F1c2VkIHRoZSB3YXJuaW5nXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG9wdHMuaW5kZXggIC0gaW5kZXggaW4gQ1NTIG5vZGUgc3RyaW5nIHRoYXQgY2F1c2VkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHdhcm5pbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5wbHVnaW4gLSBuYW1lIG9mIHRoZSBwbHVnaW4gdGhhdCBjcmVhdGVkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyB3YXJuaW5nLiB7QGxpbmsgUmVzdWx0I3dhcm59IGZpbGxzXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyBwcm9wZXJ0eSBhdXRvbWF0aWNhbGx5LlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRleHQsIG9wdHMgPSB7IH0pIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBUeXBlIHRvIGZpbHRlciB3YXJuaW5ncyBmcm9tXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICB7QGxpbmsgUmVzdWx0I21lc3NhZ2VzfS4gQWx3YXlzIGVxdWFsXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICB0byBgXCJ3YXJuaW5nXCJgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBjb25zdCBub25XYXJuaW5nID0gcmVzdWx0Lm1lc3NhZ2VzLmZpbHRlcihpID0+IGkudHlwZSAhPT0gJ3dhcm5pbmcnKVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50eXBlID0gJ3dhcm5pbmcnO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIFRoZSB3YXJuaW5nIG1lc3NhZ2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHdhcm5pbmcudGV4dCAvLz0+ICdUcnkgdG8gYXZvaWQgIWltcG9ydGFudCdcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG5cbiAgICAgICAgaWYgKCBvcHRzLm5vZGUgJiYgb3B0cy5ub2RlLnNvdXJjZSApIHtcbiAgICAgICAgICAgIGxldCBwb3MgICAgID0gb3B0cy5ub2RlLnBvc2l0aW9uQnkob3B0cyk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gLSBMaW5lIGluIHRoZSBpbnB1dCBmaWxlXG4gICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgd2l0aCB0aGlzIHdhcm5pbmfigJlzIHNvdXJjZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgKiB3YXJuaW5nLmxpbmUgLy89PiA1XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMubGluZSAgID0gcG9zLmxpbmU7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gLSBDb2x1bW4gaW4gdGhlIGlucHV0IGZpbGVcbiAgICAgICAgICAgICAqICAgICAgICAgICAgICAgICAgICB3aXRoIHRoaXMgd2FybmluZ+KAmXMgc291cmNlLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgKiB3YXJuaW5nLmNvbHVtbiAvLz0+IDZcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5jb2x1bW4gPSBwb3MuY29sdW1uO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICggbGV0IG9wdCBpbiBvcHRzICkgdGhpc1tvcHRdID0gb3B0c1tvcHRdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSB3YXJuaW5nIHBvc2l0aW9uIGFuZCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB3YXJuaW5nLnRvU3RyaW5nKCkgLy89PiAncG9zdGNzcy1saW50OmEuY3NzOjEwOjE0OiBBdm9pZCAhaW1wb3J0YW50J1xuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSB3YXJuaW5nIHBvc2l0aW9uIGFuZCBtZXNzYWdlXG4gICAgICovXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGlmICggdGhpcy5ub2RlICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5lcnJvcih0aGlzLnRleHQsIHtcbiAgICAgICAgICAgICAgICBwbHVnaW46IHRoaXMucGx1Z2luLFxuICAgICAgICAgICAgICAgIGluZGV4OiAgdGhpcy5pbmRleCxcbiAgICAgICAgICAgICAgICB3b3JkOiAgIHRoaXMud29yZFxuICAgICAgICAgICAgfSkubWVzc2FnZTtcbiAgICAgICAgfSBlbHNlIGlmICggdGhpcy5wbHVnaW4gKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wbHVnaW4gKyAnOiAnICsgdGhpcy50ZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBXYXJuaW5nI1xuICAgICAqIEBtZW1iZXIge3N0cmluZ30gcGx1Z2luIC0gVGhlIG5hbWUgb2YgdGhlIHBsdWdpbiB0aGF0IGNyZWF0ZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0IHdpbGwgZmlsbCB0aGlzIHByb3BlcnR5IGF1dG9tYXRpY2FsbHkuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIHdhcm5pbmcuIFdoZW4geW91IGNhbGwge0BsaW5rIE5vZGUjd2Fybn1cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogd2FybmluZy5wbHVnaW4gLy89PiAncG9zdGNzcy1pbXBvcnRhbnQnXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgV2FybmluZyNcbiAgICAgKiBAbWVtYmVyIHtOb2RlfSBub2RlIC0gQ29udGFpbnMgdGhlIENTUyBub2RlIHRoYXQgY2F1c2VkIHRoZSB3YXJuaW5nLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB3YXJuaW5nLm5vZGUudG9TdHJpbmcoKSAvLz0+ICdjb2xvcjogd2hpdGUgIWltcG9ydGFudCdcbiAgICAgKi9cblxufVxuXG5leHBvcnQgZGVmYXVsdCBXYXJuaW5nO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
