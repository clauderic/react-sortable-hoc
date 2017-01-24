'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createStyles = require('../styles/createStyles');

var _createStyles2 = _interopRequireDefault(_createStyles);

var _TH = require('./TH');

var _TH2 = _interopRequireDefault(_TH);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HeaderContainer = function HeaderContainer(_ref, _ref2) {
  var indexColumnText = _ref.indexColumnText;
  var columns = _ref.columns;
  var sorted = _ref.sorted;
  var sortIndexColumn = _ref.sortIndexColumn;
  var sortColumn = _ref.sortColumn;
  var sortAscending = _ref.sortAscending;
  var onTHClick = _ref.onTHClick;
  var onIndexTHClick = _ref.onIndexTHClick;
  var theme = _ref2.theme;

  var styles = (0, _createStyles2.default)('TableInspectorHeaderContainer', theme);
  var borderStyles = (0, _createStyles2.default)('TableInspectorLeftBorder', theme);
  return _react2.default.createElement(
    'div',
    { style: styles.base },
    _react2.default.createElement(
      'table',
      { style: styles.table },
      _react2.default.createElement(
        'tbody',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            _TH2.default,
            { borderStyle: borderStyles.none,
              sorted: sorted && sortIndexColumn,
              sortAscending: sortAscending,
              onClick: onIndexTHClick },
            indexColumnText
          ),
          columns.map(function (column) {
            return _react2.default.createElement(
              _TH2.default,
              { borderStyle: borderStyles.solid,
                key: column,
                sorted: sorted && sortColumn === column,
                sortAscending: sortAscending,
                onClick: onTHClick.bind(undefined, column) },
              column
            );
          })
        )
      )
    )
  );
};

HeaderContainer.defaultProps = {
  indexColumnText: '(index)',
  columns: []
};

HeaderContainer.contextTypes = {
  theme: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]).isRequired
};

exports.default = HeaderContainer;