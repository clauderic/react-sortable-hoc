/* eslint-env jest */

jest.dontMock('../src/computers/constantInfiniteComputer.js');
jest.dontMock('../src/computers/infiniteComputer.js');

var ConstantInfiniteComputer = require('../src/computers/constantInfiniteComputer.js');

describe('Constant Infinite Computer', () => {

  describe('getTotalScrollableHeight()', () => {
    it('provides the correct sum of its children', () => {
      var cic = new ConstantInfiniteComputer(26, 92);
      expect(cic.getTotalScrollableHeight()).toEqual(2392);
    });
  });

  describe('getDisplayIndexStart()', () => {
    var cic;
    beforeEach(() => {
      cic = new ConstantInfiniteComputer(33, 50);
    });

    it('computes the correct display index when precisely at element border', () => {
      expect(cic.getDisplayIndexStart(66)).toEqual(2);
    });

    it('computes the correct display index when before element border', () => {
      expect(cic.getDisplayIndexStart(47)).toEqual(1);
    });

    it('computes a zero display index correctly', () => {
      expect(cic.getDisplayIndexStart(0)).toEqual(0);
    });
  });

  describe('getDisplayIndexEnd()', () => {
    var cic;
    beforeEach(() => {
      cic = new ConstantInfiniteComputer(47, 22);
    });

    it('computes the correct display index when precisely at element border', () => {
      expect(cic.getDisplayIndexEnd(94)).toEqual(1);
      expect(cic.getDisplayIndexEnd(611)).toEqual(12);
    });

    it('computes the correct display index when below element border', () => {
      expect(cic.getDisplayIndexEnd(417)).toEqual(8);
    });

    it('computes a zero display index correctly', () => {
      expect(cic.getDisplayIndexEnd(0)).toEqual(0);
    });
  });

  describe('getTopSpacerHeight()', () => {
    it('correctly computes a zero top spacer height', () => {

    });

    it('correctly computes a regular top spacer height', () => {

    });
  });

  describe('getBottomSpacerHeight()', () => {
    it('correctly computes a zero bottom spacer height', () => {

    });

    it('correctly computes a regular bottom spacer height', () => {

    });
  });

});
