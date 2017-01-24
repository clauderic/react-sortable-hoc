'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ThemeProvider = require('../styles/ThemeProvider');

var _ThemeProvider2 = _interopRequireDefault(_ThemeProvider);

var _createStyles = require('../styles/createStyles');

var _createStyles2 = _interopRequireDefault(_createStyles);

var _getHeaders2 = require('./getHeaders');

var _getHeaders3 = _interopRequireDefault(_getHeaders2);

var _DataContainer = require('./DataContainer');

var _DataContainer2 = _interopRequireDefault(_DataContainer);

var _HeaderContainer = require('./HeaderContainer');

var _HeaderContainer2 = _interopRequireDefault(_HeaderContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Specs:
 * https://developer.chrome.com/devtools/docs/commandline-api#tabledata-columns
 * https://developer.mozilla.org/en-US/docs/Web/API/Console/table
 */

var TableInspector = function (_Component) {
  (0, _inherits3.default)(TableInspector, _Component);

  function TableInspector(props) {
    (0, _classCallCheck3.default)(this, TableInspector);

    var _this = (0, _possibleConstructorReturn3.default)(this, Object.getPrototypeOf(TableInspector).call(this, props));

    _this.state = {
      sorted: false, // has user ever clicked the <th> tag to sort?
      sortIndexColumn: false, // is index column sorted?
      sortColumn: undefined, // which column is sorted?
      sortAscending: false // is sorting ascending or descending?
    };
    return _this;
  }

  (0, _createClass3.default)(TableInspector, [{
    key: 'handleIndexTHClick',
    value: function handleIndexTHClick() {
      this.setState({
        sorted: true,
        sortIndexColumn: true,
        sortColumn: undefined,
        // when changed to a new column, default to asending
        sortAscending: this.state.sortIndexColumn ? !this.state.sortAscending : true
      });
    }
  }, {
    key: 'handleTHClick',
    value: function handleTHClick(col) {
      this.setState({
        sorted: true,
        sortIndexColumn: false,
        sortColumn: col,
        sortAscending: col === this.state.sortColumn ? !this.state.sortAscending : true
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var data = this.props.data;
      var columns = this.props.columns;

      var theme = this.props.theme;

      var styles = (0, _createStyles2.default)('TableInspector', theme);

      if ((typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data)) !== 'object' || data === null) {
        return _react2.default.createElement('div', null);
      }

      var _getHeaders = (0, _getHeaders3.default)(data);

      var rowHeaders = _getHeaders.rowHeaders;
      var colHeaders = _getHeaders.colHeaders;

      // columns to be displayed are specified
      // NOTE: there's some space for optimization here

      if (columns !== undefined) {
        colHeaders = columns;
      }

      var rowsData = rowHeaders.map(function (rowHeader) {
        return data[rowHeader];
      });

      var sorted = this.state.sorted,
          sortIndexColumn = this.state.sortIndexColumn,
          sortColumn = this.state.sortColumn,
          sortAscending = this.state.sortAscending;

      var columnDataWithRowIndexes = void 0; /* row indexes are [0..nRows-1] */
      // TODO: refactor
      if (sortColumn !== undefined) {
        // the column to be sorted (rowsData, column) => [[columnData, rowIndex]]
        columnDataWithRowIndexes = rowsData.map(function (rowData, index) {
          // normalize rowData
          if ((typeof rowData === 'undefined' ? 'undefined' : (0, _typeof3.default)(rowData)) === 'object' && rowData !== null /*&& rowData.hasOwnProperty(sortColumn)*/) {
              var columnData = rowData[sortColumn];
              return [columnData, index];
            }
          return [undefined, index];
        });
      } else {
        if (sortIndexColumn) {
          columnDataWithRowIndexes = rowHeaders.map(function (rowData, index) {
            var columnData = rowHeaders[index];
            return [columnData, index];
          });
        }
      }
      if (columnDataWithRowIndexes !== undefined) {
        // apply a mapper before sorting (because we need to access inside a container)
        var comparator = function comparator(mapper, ascending) {
          return function (a, b) {
            var v1 = mapper(a); // the datum
            var v2 = mapper(b);
            var type1 = typeof v1 === 'undefined' ? 'undefined' : (0, _typeof3.default)(v1);
            var type2 = typeof v2 === 'undefined' ? 'undefined' : (0, _typeof3.default)(v2);
            // use '<' operator to compare same type of values or compare type precedence order #
            var lt = function lt(v1, v2) {
              if (v1 < v2) {
                return -1;
              } else if (v1 > v2) {
                return 1;
              } else {
                return 0;
              }
            };
            var result = void 0;
            if (type1 === type2) {
              result = lt(v1, v2);
            } else {
              // order of different types
              var order = { 'string': 0, 'number': 1, 'object': 2, 'symbol': 3, 'boolean': 4, 'undefined': 5, 'function': 6 };
              result = lt(order[type1], order[type2]);
            }
            // reverse result if descending
            if (!ascending) result = -result;
            return result;
          };
        };
        var sortedRowIndexes = columnDataWithRowIndexes.sort(comparator(function (item) {
          return item[0];
        }, sortAscending)).map(function (item) {
          return item[1];
        }); // sorted row indexes
        rowHeaders = sortedRowIndexes.map(function (i) {
          return rowHeaders[i];
        });
        rowsData = sortedRowIndexes.map(function (i) {
          return rowsData[i];
        });
      }

      return _react2.default.createElement(
        _ThemeProvider2.default,
        { theme: this.props.theme },
        _react2.default.createElement(
          'div',
          { style: styles.base },
          _react2.default.createElement(_HeaderContainer2.default, { columns: colHeaders
            /* for sorting */
            , sorted: this.state.sorted,
            sortIndexColumn: this.state.sortIndexColumn,
            sortColumn: this.state.sortColumn,
            sortAscending: this.state.sortAscending,
            onTHClick: this.handleTHClick.bind(this),
            onIndexTHClick: this.handleIndexTHClick.bind(this) }),
          _react2.default.createElement(_DataContainer2.default, { rows: rowHeaders,
            columns: colHeaders,
            rowsData: rowsData })
        )
      );
    }
  }]);
  return TableInspector;
}(_react.Component);

exports.default = TableInspector;


TableInspector.propTypes = {
  /**
   * the Javascript object you would like to inspect, either an array or an object
   */
  data: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.object]),
  /**
   * An array of the names of the columns you'd like to display in the table
   */
  columns: _react2.default.PropTypes.array
};

TableInspector.defaultProps = {
  data: undefined,
  columns: undefined,
  theme: 'chromeLight'
};