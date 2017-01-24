// An infinite computer must be able to do the following things:
//  1. getTotalScrollableHeight()
//  2. getDisplayIndexStart()
//  3. getDisplayIndexEnd()

class InfiniteComputer {
  constructor(heightData, numberOfChildren) {
    this.heightData = heightData;
    this.numberOfChildren = numberOfChildren;
  }

  getTotalScrollableHeight() {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('getTotalScrollableHeight not implemented.');
    }
  }

  /* eslint-disable no-unused-vars */
  getDisplayIndexStart(windowTop) {
  /* eslint-enable no-unused-vars */
    if (process.env.NODE_ENV === 'development') {
      throw new Error('getDisplayIndexStart not implemented.');
    }
  }

  /* eslint-disable no-unused-vars */
  getDisplayIndexEnd(windowBottom) {
  /* eslint-enable no-unused-vars */
    if (process.env.NODE_ENV === 'development') {
      throw new Error('getDisplayIndexEnd not implemented.');
    }
  }

  // These are helper methods, and can be calculated from
  // the above details.
  /* eslint-disable no-unused-vars */
  getTopSpacerHeight(displayIndexStart) {
  /* eslint-enable no-unused-vars */
    if (process.env.NODE_ENV === 'development') {
      throw new Error('getTopSpacerHeight not implemented.');
    }
  }

  /* eslint-disable no-unused-vars */
  getBottomSpacerHeight(displayIndexEnd) {
  /* eslint-enable no-unused-vars */
    if (process.env.NODE_ENV === 'development') {
      throw new Error('getBottomSpacerHeight not implemented.');
    }
  }
}

module.exports = InfiniteComputer;
