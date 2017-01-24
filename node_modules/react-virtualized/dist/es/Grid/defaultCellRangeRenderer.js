
import React from 'react';
import cn from 'classnames';

/**
 * Default implementation of cellRangeRenderer used by Grid.
 * This renderer supports cell-caching while the user is scrolling.
 */
export default function defaultCellRangeRenderer(_ref) {
  var cellCache = _ref.cellCache;
  var cellClassName = _ref.cellClassName;
  var cellRenderer = _ref.cellRenderer;
  var cellStyle = _ref.cellStyle;
  var columnSizeAndPositionManager = _ref.columnSizeAndPositionManager;
  var columnStartIndex = _ref.columnStartIndex;
  var columnStopIndex = _ref.columnStopIndex;
  var horizontalOffsetAdjustment = _ref.horizontalOffsetAdjustment;
  var isScrolling = _ref.isScrolling;
  var rowSizeAndPositionManager = _ref.rowSizeAndPositionManager;
  var rowStartIndex = _ref.rowStartIndex;
  var rowStopIndex = _ref.rowStopIndex;
  var scrollLeft = _ref.scrollLeft;
  var scrollTop = _ref.scrollTop;
  var verticalOffsetAdjustment = _ref.verticalOffsetAdjustment;

  var renderedCells = [];

  for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    var rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

    for (var columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      var columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);
      var key = rowIndex + '-' + columnIndex;
      var cellStyleObject = cellStyle({ rowIndex: rowIndex, columnIndex: columnIndex });
      var renderedCell = void 0;

      // Avoid re-creating cells while scrolling.
      // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
      // If a scroll is in progress- cache and reuse cells.
      // This cache will be thrown away once scrolling complets.
      if (isScrolling) {
        if (!cellCache[key]) {
          cellCache[key] = cellRenderer({
            columnIndex: columnIndex,
            isScrolling: isScrolling,
            rowIndex: rowIndex
          });
        }
        renderedCell = cellCache[key];
        // If the user is no longer scrolling, don't cache cells.
        // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
      } else {
          renderedCell = cellRenderer({
            columnIndex: columnIndex,
            isScrolling: isScrolling,
            rowIndex: rowIndex
          });
        }

      if (renderedCell == null || renderedCell === false) {
        continue;
      }

      var className = cellClassName({ columnIndex: columnIndex, rowIndex: rowIndex });

      var child = React.createElement(
        'div',
        {
          key: key,
          className: cn('Grid__cell', className),
          style: babelHelpers.extends({
            height: rowDatum.size,
            left: columnDatum.offset + horizontalOffsetAdjustment,
            top: rowDatum.offset + verticalOffsetAdjustment,
            width: columnDatum.size
          }, cellStyleObject)
        },
        renderedCell
      );

      renderedCells.push(child);
    }
  }

  return renderedCells;
}