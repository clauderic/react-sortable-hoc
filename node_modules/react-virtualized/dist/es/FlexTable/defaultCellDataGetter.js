

/**
 * Default accessor for returning a cell value for a given attribute.
 * This function expects to operate on either a vanilla Object or an Immutable Map.
 * You should override the column's cellDataGetter if your data is some other type of object.
 */
export default function defaultCellDataGetter(_ref) {
  var columnData = _ref.columnData;
  var dataKey = _ref.dataKey;
  var rowData = _ref.rowData;

  if (rowData.get instanceof Function) {
    return rowData.get(dataKey);
  } else {
    return rowData[dataKey];
  }
}