/* eslint-env jest */

jest.dontMock('../src/utils/binaryIndexSearch.js');

var bs = require('../src/utils/binaryIndexSearch.js'),
    binaryIndexSearch = bs.binaryIndexSearch;

describe('Binary Index Search', function() {

  describe('arrays of length 0', function() {
    var array;

    beforeEach(function() {
      array = [];
    });

    it('returns undefined for any argument', function() {
      expect(binaryIndexSearch(array, 0)).toBeUndefined();
      expect(binaryIndexSearch(array, 12)).toBeUndefined();
    });
  });

  describe('arrays of length 1', function() {
    var array;

    beforeEach(function() {
      array = [42];
    });

    it('is able to find the element', function() {
      expect(binaryIndexSearch(array, 42)).toEqual(0);
    });
  });

  describe('arrays of even length', function() {
    var array;

    beforeEach(function() {
      array = [4, 18];
    });

    it('is able to find each element', function() {
      expect(binaryIndexSearch(array, 4)).toEqual(0);
      expect(binaryIndexSearch(array, 18)).toEqual(1);
    });
  });

  describe('arrays of odd length', function() {
    var array;
    beforeEach(function() {
      array = [28, 48, 192];
    });

    it('is able to find each element', function() {
      expect(binaryIndexSearch(array, 28)).toEqual(0);
      expect(binaryIndexSearch(array, 48)).toEqual(1);
      expect(binaryIndexSearch(array, 192)).toEqual(2);
    });
  });

  describe('approximate searches', function() {
    var evenArray, oddArray;

    beforeEach(function() {
      evenArray = [28, 48, 192, 2048];
      oddArray = [11, 203, 482];
    });

    it('is able to find the closest lower element, or the element itself', function() {
      expect(binaryIndexSearch(evenArray, 27, bs.opts.CLOSEST_LOWER)).toBeUndefined();
      expect(binaryIndexSearch(evenArray, 47, bs.opts.CLOSEST_LOWER)).toEqual(0);
      expect(binaryIndexSearch(evenArray, 49, bs.opts.CLOSEST_LOWER)).toEqual(1);
      expect(binaryIndexSearch(evenArray, 200, bs.opts.CLOSEST_LOWER)).toEqual(2);
      expect(binaryIndexSearch(evenArray, 3049, bs.opts.CLOSEST_LOWER)).toEqual(3);

      expect(binaryIndexSearch(evenArray, 28, bs.opts.CLOSEST_LOWER)).toEqual(0);
      expect(binaryIndexSearch(evenArray, 48, bs.opts.CLOSEST_LOWER)).toEqual(1);
      expect(binaryIndexSearch(evenArray, 192, bs.opts.CLOSEST_LOWER)).toEqual(2);
      expect(binaryIndexSearch(evenArray, 2048, bs.opts.CLOSEST_LOWER)).toEqual(3);

      expect(binaryIndexSearch(oddArray, 5, bs.opts.CLOSEST_LOWER)).toBeUndefined();
      expect(binaryIndexSearch(oddArray, 200, bs.opts.CLOSEST_LOWER)).toEqual(0);
      expect(binaryIndexSearch(oddArray, 204, bs.opts.CLOSEST_LOWER)).toEqual(1);
      expect(binaryIndexSearch(oddArray, 10192, bs.opts.CLOSEST_LOWER)).toEqual(2);

      expect(binaryIndexSearch(oddArray, 11, bs.opts.CLOSEST_LOWER)).toEqual(0);
      expect(binaryIndexSearch(oddArray, 203, bs.opts.CLOSEST_LOWER)).toEqual(1);
      expect(binaryIndexSearch(oddArray, 482, bs.opts.CLOSEST_LOWER)).toEqual(2);
    });

    it('is able to find the closest higher element, or the element itself', function() {
      expect(binaryIndexSearch(evenArray, 0, bs.opts.CLOSEST_HIGHER)).toEqual(0);
      expect(binaryIndexSearch(evenArray, 40, bs.opts.CLOSEST_HIGHER)).toEqual(1);
      expect(binaryIndexSearch(evenArray, 100, bs.opts.CLOSEST_HIGHER)).toEqual(2);
      expect(binaryIndexSearch(evenArray, 2000, bs.opts.CLOSEST_HIGHER)).toEqual(3);
      expect(binaryIndexSearch(evenArray, 4823, bs.opts.CLOSEST_HIGHER)).toBeUndefined();

      expect(binaryIndexSearch(evenArray, 28, bs.opts.CLOSEST_HIGHER)).toEqual(0);
      expect(binaryIndexSearch(evenArray, 48, bs.opts.CLOSEST_HIGHER)).toEqual(1);
      expect(binaryIndexSearch(evenArray, 192, bs.opts.CLOSEST_HIGHER)).toEqual(2);
      expect(binaryIndexSearch(evenArray, 2048, bs.opts.CLOSEST_HIGHER)).toEqual(3);

      expect(binaryIndexSearch(oddArray, 2, bs.opts.CLOSEST_HIGHER)).toEqual(0);
      expect(binaryIndexSearch(oddArray, 100, bs.opts.CLOSEST_HIGHER)).toEqual(1);
      expect(binaryIndexSearch(oddArray, 300, bs.opts.CLOSEST_HIGHER)).toEqual(2);
      expect(binaryIndexSearch(oddArray, 692, bs.opts.CLOSEST_HIGHER)).toBeUndefined();

      expect(binaryIndexSearch(oddArray, 11, bs.opts.CLOSEST_HIGHER)).toEqual(0);
      expect(binaryIndexSearch(oddArray, 203, bs.opts.CLOSEST_HIGHER)).toEqual(1);
      expect(binaryIndexSearch(oddArray, 482, bs.opts.CLOSEST_HIGHER)).toEqual(2);
    });
  });
});
