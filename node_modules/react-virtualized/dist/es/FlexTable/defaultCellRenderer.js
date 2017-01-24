

/**
 * Default cell renderer that displays an attribute as a simple string
 * You should override the column's cellRenderer if your data is some other type of object.
 */
export default function defaultCellRenderer(_ref) {
  var cellData = _ref.cellData;
  var cellDataKey = _ref.cellDataKey;
  var columnData = _ref.columnData;
  var rowData = _ref.rowData;
  var rowIndex = _ref.rowIndex;

  if (cellData == null) {
    return '';
  } else {
    return String(cellData);
  }
}