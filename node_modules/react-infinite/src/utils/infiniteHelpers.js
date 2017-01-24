/* @flow */

var ConstantInfiniteComputer = require('../computers/constantInfiniteComputer.js');
var ArrayInfiniteComputer = require('../computers/arrayInfiniteComputer.js');
var React = global.React || require('react');

function createInfiniteComputer(data: ElementHeight,
                                children: any): InfiniteComputer {
  var computer;
  var numberOfChildren = React.Children.count(children);

  // This should be guaranteed by checkProps
  if (Array.isArray(data)) {
    computer = new ArrayInfiniteComputer(data, numberOfChildren);
  } else {
    computer = new ConstantInfiniteComputer(data, numberOfChildren);
  }
  return computer;
}

// Given the scrollTop of the container, computes the state the
// component should be in. The goal is to abstract all of this
// from any actual representation in the DOM.
// The window is the block with any preloadAdditionalHeight
// added to it.
function recomputeApertureStateFromOptionsAndScrollTop({
  preloadBatchSize,
  preloadAdditionalHeight,
  infiniteComputer
  }: {
    preloadBatchSize: number;
    preloadAdditionalHeight: number;
    infiniteComputer: InfiniteComputer;
  }, scrollTop: number): {
    displayIndexStart: number;
    displayIndexEnd: number;
  } {
  var blockNumber = preloadBatchSize === 0 ? 0 : Math.floor(scrollTop / preloadBatchSize),
      blockStart = preloadBatchSize * blockNumber,
      blockEnd = blockStart + preloadBatchSize,
      apertureTop = Math.max(0, blockStart - preloadAdditionalHeight),
      apertureBottom = Math.min(infiniteComputer.getTotalScrollableHeight(),
        blockEnd + preloadAdditionalHeight);

  return {
    displayIndexStart: infiniteComputer.getDisplayIndexStart(apertureTop),
    displayIndexEnd: infiniteComputer.getDisplayIndexEnd(apertureBottom)
  };
}

module.exports = {
  createInfiniteComputer,
  recomputeApertureStateFromOptionsAndScrollTop
};
