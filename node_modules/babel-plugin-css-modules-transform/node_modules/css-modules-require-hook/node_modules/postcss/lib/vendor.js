'use strict';

exports.__esModule = true;
/**
 * Contains helpers for working with vendor prefixes.
 *
 * @example
 * const vendor = postcss.vendor;
 *
 * @namespace vendor
 */
var vendor = {

    /**
     * Returns the vendor prefix extracted from an input string.
     *
     * @param {string} prop - string with or without vendor prefix
     *
     * @return {string} vendor prefix or empty string
     *
     * @example
     * postcss.vendor.prefix('-moz-tab-size') //=> '-moz-'
     * postcss.vendor.prefix('tab-size')      //=> ''
     */
    prefix: function prefix(prop) {
        if (prop[0] === '-') {
            var sep = prop.indexOf('-', 1);
            return prop.substr(0, sep + 1);
        } else {
            return '';
        }
    },


    /**
     * Returns the input string stripped of its vendor prefix.
     *
     * @param {string} prop - string with or without vendor prefix
     *
     * @return {string} string name without vendor prefixes
     *
     * @example
     * postcss.vendor.unprefixed('-moz-tab-size') //=> 'tab-size'
     */
    unprefixed: function unprefixed(prop) {
        if (prop[0] === '-') {
            var sep = prop.indexOf('-', 1);
            return prop.substr(sep + 1);
        } else {
            return prop;
        }
    }
};

exports.default = vendor;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlbmRvci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7Ozs7O0FBUUEsSUFBSSxTQUFTOztBQUVUOzs7Ozs7Ozs7OztBQVdBLFVBYlMsa0JBYUYsSUFiRSxFQWFJO0FBQ1QsWUFBSyxLQUFLLENBQUwsTUFBWSxHQUFqQixFQUF1QjtBQUNuQixnQkFBSSxNQUFNLEtBQUssT0FBTCxDQUFhLEdBQWIsRUFBa0IsQ0FBbEIsQ0FBVjtBQUNBLG1CQUFPLEtBQUssTUFBTCxDQUFZLENBQVosRUFBZSxNQUFNLENBQXJCLENBQVA7QUFDSCxTQUhELE1BR087QUFDSCxtQkFBTyxFQUFQO0FBQ0g7QUFDSixLQXBCUTs7O0FBc0JUOzs7Ozs7Ozs7O0FBVUEsY0FoQ1Msc0JBZ0NFLElBaENGLEVBZ0NRO0FBQ2IsWUFBSyxLQUFLLENBQUwsTUFBWSxHQUFqQixFQUF1QjtBQUNuQixnQkFBSSxNQUFNLEtBQUssT0FBTCxDQUFhLEdBQWIsRUFBa0IsQ0FBbEIsQ0FBVjtBQUNBLG1CQUFPLEtBQUssTUFBTCxDQUFZLE1BQU0sQ0FBbEIsQ0FBUDtBQUNILFNBSEQsTUFHTztBQUNILG1CQUFPLElBQVA7QUFDSDtBQUNKO0FBdkNRLENBQWI7O2tCQTJDZSxNIiwiZmlsZSI6InZlbmRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29udGFpbnMgaGVscGVycyBmb3Igd29ya2luZyB3aXRoIHZlbmRvciBwcmVmaXhlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgdmVuZG9yID0gcG9zdGNzcy52ZW5kb3I7XG4gKlxuICogQG5hbWVzcGFjZSB2ZW5kb3JcbiAqL1xubGV0IHZlbmRvciA9IHtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHZlbmRvciBwcmVmaXggZXh0cmFjdGVkIGZyb20gYW4gaW5wdXQgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3AgLSBzdHJpbmcgd2l0aCBvciB3aXRob3V0IHZlbmRvciBwcmVmaXhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gdmVuZG9yIHByZWZpeCBvciBlbXB0eSBzdHJpbmdcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcG9zdGNzcy52ZW5kb3IucHJlZml4KCctbW96LXRhYi1zaXplJykgLy89PiAnLW1vei0nXG4gICAgICogcG9zdGNzcy52ZW5kb3IucHJlZml4KCd0YWItc2l6ZScpICAgICAgLy89PiAnJ1xuICAgICAqL1xuICAgIHByZWZpeChwcm9wKSB7XG4gICAgICAgIGlmICggcHJvcFswXSA9PT0gJy0nICkge1xuICAgICAgICAgICAgbGV0IHNlcCA9IHByb3AuaW5kZXhPZignLScsIDEpO1xuICAgICAgICAgICAgcmV0dXJuIHByb3Auc3Vic3RyKDAsIHNlcCArIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGlucHV0IHN0cmluZyBzdHJpcHBlZCBvZiBpdHMgdmVuZG9yIHByZWZpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wIC0gc3RyaW5nIHdpdGggb3Igd2l0aG91dCB2ZW5kb3IgcHJlZml4XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IHN0cmluZyBuYW1lIHdpdGhvdXQgdmVuZG9yIHByZWZpeGVzXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHBvc3Rjc3MudmVuZG9yLnVucHJlZml4ZWQoJy1tb3otdGFiLXNpemUnKSAvLz0+ICd0YWItc2l6ZSdcbiAgICAgKi9cbiAgICB1bnByZWZpeGVkKHByb3ApIHtcbiAgICAgICAgaWYgKCBwcm9wWzBdID09PSAnLScgKSB7XG4gICAgICAgICAgICBsZXQgc2VwID0gcHJvcC5pbmRleE9mKCctJywgMSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvcC5zdWJzdHIoc2VwICsgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcDtcbiAgICAgICAgfVxuICAgIH1cblxufTtcblxuZXhwb3J0IGRlZmF1bHQgdmVuZG9yO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
