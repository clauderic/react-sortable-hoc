import React, { Component, PropTypes } from 'react';
import CollectionView from './CollectionView';
import _calculateSizeAndPositionData from './utils/calculateSizeAndPositionData';
import getUpdatedOffsetForIndex from '../utils/getUpdatedOffsetForIndex';
import shallowCompare from 'react-addons-shallow-compare';


/**
 * Renders scattered or non-linear data.
 * Unlike Grid, which renders checkerboard data, Collection can render arbitrarily positioned- even overlapping- data.
 */

var Collection = function (_Component) {
  babelHelpers.inherits(Collection, _Component);

  function Collection(props, context) {
    babelHelpers.classCallCheck(this, Collection);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Collection).call(this, props, context));

    _this._cellMetadata = [];
    _this._lastRenderedCellIndices = [];
    return _this;
  }

  /** See Collection#recomputeCellSizesAndPositions */


  babelHelpers.createClass(Collection, [{
    key: 'recomputeCellSizesAndPositions',
    value: function recomputeCellSizesAndPositions() {
      this._collectionView.recomputeCellSizesAndPositions();
    }

    /** React lifecycle methods */

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = babelHelpers.objectWithoutProperties(this.props, []);


      return React.createElement(CollectionView, babelHelpers.extends({
        cellLayoutManager: this,
        ref: function ref(_ref) {
          _this2._collectionView = _ref;
        }
      }, props));
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState);
    }

    /** CellLayoutManager interface */

  }, {
    key: 'calculateSizeAndPositionData',
    value: function calculateSizeAndPositionData() {
      var _props = this.props;
      var cellCount = _props.cellCount;
      var cellSizeAndPositionGetter = _props.cellSizeAndPositionGetter;
      var sectionSize = _props.sectionSize;


      var data = _calculateSizeAndPositionData({
        cellCount: cellCount,
        cellSizeAndPositionGetter: cellSizeAndPositionGetter,
        sectionSize: sectionSize
      });

      this._cellMetadata = data.cellMetadata;
      this._sectionManager = data.sectionManager;
      this._height = data.height;
      this._width = data.width;
    }

    /**
     * Returns the most recently rendered set of cell indices.
     */

  }, {
    key: 'getLastRenderedIndices',
    value: function getLastRenderedIndices() {
      return this._lastRenderedCellIndices;
    }

    /**
     * Calculates the minimum amount of change from the current scroll position to ensure the specified cell is (fully) visible.
     */

  }, {
    key: 'getScrollPositionForCell',
    value: function getScrollPositionForCell(_ref2) {
      var align = _ref2.align;
      var cellIndex = _ref2.cellIndex;
      var height = _ref2.height;
      var scrollLeft = _ref2.scrollLeft;
      var scrollTop = _ref2.scrollTop;
      var width = _ref2.width;
      var cellCount = this.props.cellCount;


      if (cellIndex >= 0 && cellIndex < cellCount) {
        var cellMetadata = this._cellMetadata[cellIndex];

        scrollLeft = getUpdatedOffsetForIndex({
          align: align,
          cellOffset: cellMetadata.x,
          cellSize: cellMetadata.width,
          containerSize: width,
          currentOffset: scrollLeft,
          targetIndex: cellIndex
        });

        scrollTop = getUpdatedOffsetForIndex({
          align: align,
          cellOffset: cellMetadata.y,
          cellSize: cellMetadata.height,
          containerSize: height,
          currentOffset: scrollTop,
          targetIndex: cellIndex
        });
      }

      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }
  }, {
    key: 'getTotalSize',
    value: function getTotalSize() {
      return {
        height: this._height,
        width: this._width
      };
    }
  }, {
    key: 'cellRenderers',
    value: function cellRenderers(_ref3) {
      var _this3 = this;

      var height = _ref3.height;
      var isScrolling = _ref3.isScrolling;
      var width = _ref3.width;
      var x = _ref3.x;
      var y = _ref3.y;
      var _props2 = this.props;
      var cellGroupRenderer = _props2.cellGroupRenderer;
      var cellRenderer = _props2.cellRenderer;

      // Store for later calls to getLastRenderedIndices()

      this._lastRenderedCellIndices = this._sectionManager.getCellIndices({
        height: height,
        width: width,
        x: x,
        y: y
      });

      return cellGroupRenderer({
        cellRenderer: cellRenderer,
        cellSizeAndPositionGetter: function cellSizeAndPositionGetter(_ref4) {
          var index = _ref4.index;
          return _this3._sectionManager.getCellMetadata({ index: index });
        },
        indices: this._lastRenderedCellIndices,
        isScrolling: isScrolling
      });
    }
  }]);
  return Collection;
}(Component);

Collection.propTypes = {
  'aria-label': PropTypes.string,

  /**
   * Number of cells in Collection.
   */
  cellCount: PropTypes.number.isRequired,

  /**
   * Responsible for rendering a group of cells given their indices.
   * Should implement the following interface: ({
   *   cellSizeAndPositionGetter:Function,
   *   indices: Array<number>,
   *   cellRenderer: Function
   * }): Array<PropTypes.node>
   */
  cellGroupRenderer: PropTypes.func.isRequired,

  /**
   * Responsible for rendering a cell given an row and column index.
   * Should implement the following interface: ({ index: number }): PropTypes.element
   */
  cellRenderer: PropTypes.func.isRequired,

  /**
   * Callback responsible for returning size and offset/position information for a given cell (index).
   * ({ index: number }): { height: number, width: number, x: number, y: number }
   */
  cellSizeAndPositionGetter: PropTypes.func.isRequired,

  /**
   * Optionally override the size of the sections a Collection's cells are split into.
   */
  sectionSize: PropTypes.number
};
Collection.defaultProps = {
  'aria-label': 'grid',
  cellGroupRenderer: defaultCellGroupRenderer
};
export default Collection;


function defaultCellGroupRenderer(_ref5) {
  var cellRenderer = _ref5.cellRenderer;
  var cellSizeAndPositionGetter = _ref5.cellSizeAndPositionGetter;
  var indices = _ref5.indices;
  var isScrolling = _ref5.isScrolling;

  return indices.map(function (index) {
    var cellMetadata = cellSizeAndPositionGetter({ index: index });
    var renderedCell = cellRenderer({
      index: index,
      isScrolling: isScrolling
    });

    if (renderedCell == null || renderedCell === false) {
      return null;
    }

    return React.createElement(
      'div',
      {
        className: 'Collection__cell',
        key: index,
        style: {
          height: cellMetadata.height,
          left: cellMetadata.x,
          top: cellMetadata.y,
          width: cellMetadata.width
        }
      },
      renderedCell
    );
  }).filter(function (renderedCell) {
    return !!renderedCell;
  });
}