'use strict';

exports.__esModule = true;
/**
 * Contains helpers for safely splitting lists of CSS values,
 * preserving parentheses and quotes.
 *
 * @example
 * const list = postcss.list;
 *
 * @namespace list
 */
var list = {
    split: function split(string, separators, last) {
        var array = [];
        var current = '';
        var split = false;

        var func = 0;
        var quote = false;
        var escape = false;

        for (var i = 0; i < string.length; i++) {
            var letter = string[i];

            if (quote) {
                if (escape) {
                    escape = false;
                } else if (letter === '\\') {
                    escape = true;
                } else if (letter === quote) {
                    quote = false;
                }
            } else if (letter === '"' || letter === '\'') {
                quote = letter;
            } else if (letter === '(') {
                func += 1;
            } else if (letter === ')') {
                if (func > 0) func -= 1;
            } else if (func === 0) {
                if (separators.indexOf(letter) !== -1) split = true;
            }

            if (split) {
                if (current !== '') array.push(current.trim());
                current = '';
                split = false;
            } else {
                current += letter;
            }
        }

        if (last || current !== '') array.push(current.trim());
        return array;
    },


    /**
     * Safely splits space-separated values (such as those for `background`,
     * `border-radius`, and other shorthand properties).
     *
     * @param {string} string - space-separated values
     *
     * @return {string[]} splitted values
     *
     * @example
     * postcss.list.space('1px calc(10% + 1px)') //=> ['1px', 'calc(10% + 1px)']
     */
    space: function space(string) {
        var spaces = [' ', '\n', '\t'];
        return list.split(string, spaces);
    },


    /**
     * Safely splits comma-separated values (such as those for `transition-*`
     * and `background` properties).
     *
     * @param {string} string - comma-separated values
     *
     * @return {string[]} splitted values
     *
     * @example
     * postcss.list.comma('black, linear-gradient(white, black)')
     * //=> ['black', 'linear-gradient(white, black)']
     */
    comma: function comma(string) {
        var comma = ',';
        return list.split(string, [comma], true);
    }
};

exports.default = list;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpc3QuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxJQUFJLE9BQU87QUFFUCxTQUZPLGlCQUVELE1BRkMsRUFFTyxVQUZQLEVBRW1CLElBRm5CLEVBRXlCO0FBQzVCLFlBQUksUUFBVSxFQUFkO0FBQ0EsWUFBSSxVQUFVLEVBQWQ7QUFDQSxZQUFJLFFBQVUsS0FBZDs7QUFFQSxZQUFJLE9BQVUsQ0FBZDtBQUNBLFlBQUksUUFBVSxLQUFkO0FBQ0EsWUFBSSxTQUFVLEtBQWQ7O0FBRUEsYUFBTSxJQUFJLElBQUksQ0FBZCxFQUFpQixJQUFJLE9BQU8sTUFBNUIsRUFBb0MsR0FBcEMsRUFBMEM7QUFDdEMsZ0JBQUksU0FBUyxPQUFPLENBQVAsQ0FBYjs7QUFFQSxnQkFBSyxLQUFMLEVBQWE7QUFDVCxvQkFBSyxNQUFMLEVBQWM7QUFDViw2QkFBUyxLQUFUO0FBQ0gsaUJBRkQsTUFFTyxJQUFLLFdBQVcsSUFBaEIsRUFBdUI7QUFDMUIsNkJBQVMsSUFBVDtBQUNILGlCQUZNLE1BRUEsSUFBSyxXQUFXLEtBQWhCLEVBQXdCO0FBQzNCLDRCQUFRLEtBQVI7QUFDSDtBQUNKLGFBUkQsTUFRTyxJQUFLLFdBQVcsR0FBWCxJQUFrQixXQUFXLElBQWxDLEVBQXlDO0FBQzVDLHdCQUFRLE1BQVI7QUFDSCxhQUZNLE1BRUEsSUFBSyxXQUFXLEdBQWhCLEVBQXNCO0FBQ3pCLHdCQUFRLENBQVI7QUFDSCxhQUZNLE1BRUEsSUFBSyxXQUFXLEdBQWhCLEVBQXNCO0FBQ3pCLG9CQUFLLE9BQU8sQ0FBWixFQUFnQixRQUFRLENBQVI7QUFDbkIsYUFGTSxNQUVBLElBQUssU0FBUyxDQUFkLEVBQWtCO0FBQ3JCLG9CQUFLLFdBQVcsT0FBWCxDQUFtQixNQUFuQixNQUErQixDQUFDLENBQXJDLEVBQXlDLFFBQVEsSUFBUjtBQUM1Qzs7QUFFRCxnQkFBSyxLQUFMLEVBQWE7QUFDVCxvQkFBSyxZQUFZLEVBQWpCLEVBQXNCLE1BQU0sSUFBTixDQUFXLFFBQVEsSUFBUixFQUFYO0FBQ3RCLDBCQUFVLEVBQVY7QUFDQSx3QkFBVSxLQUFWO0FBQ0gsYUFKRCxNQUlPO0FBQ0gsMkJBQVcsTUFBWDtBQUNIO0FBQ0o7O0FBRUQsWUFBSyxRQUFRLFlBQVksRUFBekIsRUFBOEIsTUFBTSxJQUFOLENBQVcsUUFBUSxJQUFSLEVBQVg7QUFDOUIsZUFBTyxLQUFQO0FBQ0gsS0EzQ007OztBQTZDUDs7Ozs7Ozs7Ozs7QUFXQSxTQXhETyxpQkF3REQsTUF4REMsRUF3RE87QUFDVixZQUFJLFNBQVMsQ0FBQyxHQUFELEVBQU0sSUFBTixFQUFZLElBQVosQ0FBYjtBQUNBLGVBQU8sS0FBSyxLQUFMLENBQVcsTUFBWCxFQUFtQixNQUFuQixDQUFQO0FBQ0gsS0EzRE07OztBQTZEUDs7Ozs7Ozs7Ozs7O0FBWUEsU0F6RU8saUJBeUVELE1BekVDLEVBeUVPO0FBQ1YsWUFBSSxRQUFRLEdBQVo7QUFDQSxlQUFPLEtBQUssS0FBTCxDQUFXLE1BQVgsRUFBbUIsQ0FBQyxLQUFELENBQW5CLEVBQTRCLElBQTVCLENBQVA7QUFDSDtBQTVFTSxDQUFYOztrQkFnRmUsSSIsImZpbGUiOiJsaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb250YWlucyBoZWxwZXJzIGZvciBzYWZlbHkgc3BsaXR0aW5nIGxpc3RzIG9mIENTUyB2YWx1ZXMsXG4gKiBwcmVzZXJ2aW5nIHBhcmVudGhlc2VzIGFuZCBxdW90ZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGxpc3QgPSBwb3N0Y3NzLmxpc3Q7XG4gKlxuICogQG5hbWVzcGFjZSBsaXN0XG4gKi9cbmxldCBsaXN0ID0ge1xuXG4gICAgc3BsaXQoc3RyaW5nLCBzZXBhcmF0b3JzLCBsYXN0KSB7XG4gICAgICAgIGxldCBhcnJheSAgID0gW107XG4gICAgICAgIGxldCBjdXJyZW50ID0gJyc7XG4gICAgICAgIGxldCBzcGxpdCAgID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IGZ1bmMgICAgPSAwO1xuICAgICAgICBsZXQgcXVvdGUgICA9IGZhbHNlO1xuICAgICAgICBsZXQgZXNjYXBlICA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIGxldCBsZXR0ZXIgPSBzdHJpbmdbaV07XG5cbiAgICAgICAgICAgIGlmICggcXVvdGUgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBlc2NhcGUgKSB7XG4gICAgICAgICAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxldHRlciA9PT0gJ1xcXFwnICkge1xuICAgICAgICAgICAgICAgICAgICBlc2NhcGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxldHRlciA9PT0gcXVvdGUgKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1b3RlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICggbGV0dGVyID09PSAnXCInIHx8IGxldHRlciA9PT0gJ1xcJycgKSB7XG4gICAgICAgICAgICAgICAgcXVvdGUgPSBsZXR0ZXI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBsZXR0ZXIgPT09ICcoJyApIHtcbiAgICAgICAgICAgICAgICBmdW5jICs9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBsZXR0ZXIgPT09ICcpJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIGZ1bmMgPiAwICkgZnVuYyAtPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggZnVuYyA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNlcGFyYXRvcnMuaW5kZXhPZihsZXR0ZXIpICE9PSAtMSApIHNwbGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBzcGxpdCApIHtcbiAgICAgICAgICAgICAgICBpZiAoIGN1cnJlbnQgIT09ICcnICkgYXJyYXkucHVzaChjdXJyZW50LnRyaW0oKSk7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9ICcnO1xuICAgICAgICAgICAgICAgIHNwbGl0ICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCArPSBsZXR0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGxhc3QgfHwgY3VycmVudCAhPT0gJycgKSBhcnJheS5wdXNoKGN1cnJlbnQudHJpbSgpKTtcbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTYWZlbHkgc3BsaXRzIHNwYWNlLXNlcGFyYXRlZCB2YWx1ZXMgKHN1Y2ggYXMgdGhvc2UgZm9yIGBiYWNrZ3JvdW5kYCxcbiAgICAgKiBgYm9yZGVyLXJhZGl1c2AsIGFuZCBvdGhlciBzaG9ydGhhbmQgcHJvcGVydGllcykuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gc3BhY2Utc2VwYXJhdGVkIHZhbHVlc1xuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nW119IHNwbGl0dGVkIHZhbHVlc1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBwb3N0Y3NzLmxpc3Quc3BhY2UoJzFweCBjYWxjKDEwJSArIDFweCknKSAvLz0+IFsnMXB4JywgJ2NhbGMoMTAlICsgMXB4KSddXG4gICAgICovXG4gICAgc3BhY2Uoc3RyaW5nKSB7XG4gICAgICAgIGxldCBzcGFjZXMgPSBbJyAnLCAnXFxuJywgJ1xcdCddO1xuICAgICAgICByZXR1cm4gbGlzdC5zcGxpdChzdHJpbmcsIHNwYWNlcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNhZmVseSBzcGxpdHMgY29tbWEtc2VwYXJhdGVkIHZhbHVlcyAoc3VjaCBhcyB0aG9zZSBmb3IgYHRyYW5zaXRpb24tKmBcbiAgICAgKiBhbmQgYGJhY2tncm91bmRgIHByb3BlcnRpZXMpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAtIGNvbW1hLXNlcGFyYXRlZCB2YWx1ZXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ1tdfSBzcGxpdHRlZCB2YWx1ZXNcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcG9zdGNzcy5saXN0LmNvbW1hKCdibGFjaywgbGluZWFyLWdyYWRpZW50KHdoaXRlLCBibGFjayknKVxuICAgICAqIC8vPT4gWydibGFjaycsICdsaW5lYXItZ3JhZGllbnQod2hpdGUsIGJsYWNrKSddXG4gICAgICovXG4gICAgY29tbWEoc3RyaW5nKSB7XG4gICAgICAgIGxldCBjb21tYSA9ICcsJztcbiAgICAgICAgcmV0dXJuIGxpc3Quc3BsaXQoc3RyaW5nLCBbY29tbWFdLCB0cnVlKTtcbiAgICB9XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3Q7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
