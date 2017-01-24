/* @flow */

var InfiniteComputer = require('./infiniteComputer.js');

class ConstantInfiniteComputer extends InfiniteComputer {
  getTotalScrollableHeight(): number {
    return this.heightData * this.numberOfChildren;
  }

  getDisplayIndexStart(windowTop: number): number {
    return Math.floor(windowTop / this.heightData);
  }

  getDisplayIndexEnd(windowBottom: number): number {
    var nonZeroIndex = Math.ceil(windowBottom / this.heightData);
    if (nonZeroIndex > 0) {
      return nonZeroIndex - 1;
    }
    return nonZeroIndex;
  }

  getTopSpacerHeight(displayIndexStart: number): number {
    return displayIndexStart * this.heightData;
  }

  getBottomSpacerHeight(displayIndexEnd: number): number {
    var nonZeroIndex = displayIndexEnd + 1;
    return Math.max(0, (this.numberOfChildren - nonZeroIndex) * this.heightData);
  }
}

module.exports = ConstantInfiniteComputer;
