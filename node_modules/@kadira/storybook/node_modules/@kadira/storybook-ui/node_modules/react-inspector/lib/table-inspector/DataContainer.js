'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createStyles = require('../styles/createStyles');

var _createStyles2 = _interopRequireDefault(_createStyles);

var _ObjectValue = require('../object/ObjectValue');

var _ObjectValue2 = _interopRequireDefault(_ObjectValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataContainer = function DataContainer(_ref, _ref2) {
  var rows = _ref.rows;
  var columns = _ref.columns;
  var rowsData = _ref.rowsData;
  var theme = _ref2.theme;

  var styles = (0, _createStyles2.default)('TableInspectorDataContainer', theme);
  var borderStyles = (0, _createStyles2.default)('TableInspectorLeftBorder', theme);

  return _react2.default.createElement(
    'div',
    { style: styles.div },
    _react2.default.createElement(
      'table',
      { style: styles.table },
      _react2.default.createElement('colgroup', null),
      _react2.default.createElement(
        'tbody',
        null,
        rows.map(function (row, i) {
          return _react2.default.createElement(
            'tr',
            { key: row, style: styles.tr },
            _react2.default.createElement(
              'td',
              { style: (0, _extends3.default)({}, styles.td, borderStyles.none) },
              row
            ),
            columns.map(function (column) {
              var rowData = rowsData[i];
              // rowData could be
              //  object -> index by key
              //    array -> index by array index
              //    null -> pass
              //  boolean -> pass
              //  string -> pass (hasOwnProperty returns true for [0..len-1])
              //  number -> pass
              //  function -> pass
              //  symbol
              //  undefined -> pass
              if ((typeof rowData === 'undefined' ? 'undefined' : (0, _typeof3.default)(rowData)) === 'object' && rowData !== null && rowData.hasOwnProperty(column)) {
                return _react2.default.createElement(
                  'td',
                  { key: column, style: (0, _extends3.default)({}, styles.td, borderStyles.solid) },
                  _react2.default.createElement(_ObjectValue2.default, { object: rowData[column] })
                );
              } else {
                return _react2.default.createElement('td', { key: column, style: (0, _extends3.default)({}, styles.td, borderStyles.solid) });
              }
            })
          );
        })
      )
    )
  );
};

DataContainer.contextTypes = {
  theme: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]).isRequired
};

exports.default = DataContainer;