
import React from 'react';
import SortIndicator from './SortIndicator';


/**
 * Default table header renderer.
 */
export default function defaultHeaderRenderer(_ref) {
  var columnData = _ref.columnData;
  var dataKey = _ref.dataKey;
  var disableSort = _ref.disableSort;
  var label = _ref.label;
  var sortBy = _ref.sortBy;
  var sortDirection = _ref.sortDirection;

  var showSortIndicator = sortBy === dataKey;
  var children = [React.createElement(
    'span',
    {
      className: 'FlexTable__headerTruncatedText',
      key: 'label',
      title: label
    },
    label
  )];

  if (showSortIndicator) {
    children.push(React.createElement(SortIndicator, {
      key: 'SortIndicator',
      sortDirection: sortDirection
    }));
  }

  return children;
}