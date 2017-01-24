// An infinite computer must be able to do the following things:
//  1. getTotalScrollableHeight()
//  2. getDisplayIndexStart()
//  3. getDisplayIndexEnd()

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var InfiniteComputer = (function () {
  function InfiniteComputer(heightData, numberOfChildren) {
    _classCallCheck(this, InfiniteComputer);

    this.heightData = heightData;
    this.numberOfChildren = numberOfChildren;
  }

  _createClass(InfiniteComputer, [{
    key: 'getTotalScrollableHeight',
    value: function getTotalScrollableHeight() {
      if (process.env.NODE_ENV === 'development') {
        throw new Error('getTotalScrollableHeight not implemented.');
      }
    }

    /* eslint-disable no-unused-vars */
  }, {
    key: 'getDisplayIndexStart',
    value: function getDisplayIndexStart(windowTop) {
      /* eslint-enable no-unused-vars */
      if (process.env.NODE_ENV === 'development') {
        throw new Error('getDisplayIndexStart not implemented.');
      }
    }

    /* eslint-disable no-unused-vars */
  }, {
    key: 'getDisplayIndexEnd',
    value: function getDisplayIndexEnd(windowBottom) {
      /* eslint-enable no-unused-vars */
      if (process.env.NODE_ENV === 'development') {
        throw new Error('getDisplayIndexEnd not implemented.');
      }
    }

    // These are helper methods, and can be calculated from
    // the above details.
    /* eslint-disable no-unused-vars */
  }, {
    key: 'getTopSpacerHeight',
    value: function getTopSpacerHeight(displayIndexStart) {
      /* eslint-enable no-unused-vars */
      if (process.env.NODE_ENV === 'development') {
        throw new Error('getTopSpacerHeight not implemented.');
      }
    }

    /* eslint-disable no-unused-vars */
  }, {
    key: 'getBottomSpacerHeight',
    value: function getBottomSpacerHeight(displayIndexEnd) {
      /* eslint-enable no-unused-vars */
      if (process.env.NODE_ENV === 'development') {
        throw new Error('getBottomSpacerHeight not implemented.');
      }
    }
  }]);

  return InfiniteComputer;
})();

module.exports = InfiniteComputer;