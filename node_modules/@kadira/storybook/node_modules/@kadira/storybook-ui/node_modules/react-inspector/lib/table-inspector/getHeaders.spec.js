'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _getHeaders = require('./getHeaders');

var _getHeaders2 = _interopRequireDefault(_getHeaders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('getHeaders for arrays', function () {
  it('should return empty headers for empty array', function () {
    var data = [];
    var result = (0, _getHeaders2.default)(data);
    (0, _expect2.default)(result).toEqual({ rowHeaders: [], colHeaders: [] });
  });

  it('should work for array of arrays', function () {
    var data = [['a', 'b'], ['c', 'd']];
    var result = (0, _getHeaders2.default)(data);
    (0, _expect2.default)(result).toEqual({ rowHeaders: [0, 1], colHeaders: ['0', '1'] });
  });

  it('should work for array of objects', function () {
    var data = [{
      "login": "rafaelsachetto",
      "id": 42780
    }, {
      "login": "tsnow",
      "id": 48890
    }];
    var result = (0, _getHeaders2.default)(data);
    (0, _expect2.default)(result).toEqual({ rowHeaders: [0, 1], colHeaders: ["login", "id"] });
  });
});

describe('getHeaders for objects', function () {
  it('should work for objects whose keys are index numbers', function () {
    var data = { 0: { firstName: "John", lastName: "Smith" }, 1: { firstName: "Martin", middleName: "Luther", lastName: "King" } };
    var result = (0, _getHeaders2.default)(data);
    (0, _expect2.default)(result).toEqual({ rowHeaders: ['0', '1'], colHeaders: ['firstName', 'lastName', 'middleName'] });
  });

  it('should work for objects whose keys are index numbers', function () {
    var data = { 0: { firstName: "John", lastName: "Smith" }, 1: { firstName: "Martin", middleName: "Luther", lastName: "King" } };
    var result = (0, _getHeaders2.default)(data);
    (0, _expect2.default)(result).toEqual({ rowHeaders: ['0', '1'], colHeaders: ['firstName', 'lastName', 'middleName'] });
  });

  // for arrays length refers to the length of the array
  // for objects lengths refers to the number of keys
  it('should work for objects whose keys are strings and values are of same lengths', function () {
    var data = { "person1": { firstName: "John", lastName: "Smith" }, "person2": { firstName: "Martin", lastName: "King" } };
    var result = (0, _getHeaders2.default)(data);
    (0, _expect2.default)(result).toEqual({ rowHeaders: ['person1', 'person2'], colHeaders: ['firstName', 'lastName'] });
  });

  it('should work for objects whose keys are strings and values have different lengths', function () {
    var data = { "person1": { firstName: "John", lastName: "Smith" }, "person2": { firstName: "Martin", middleName: "Luther", lastName: "King" } };
    var result = (0, _getHeaders2.default)(data);
    (0, _expect2.default)(result).toEqual({ rowHeaders: ['person1', 'person2'], colHeaders: ['firstName', 'lastName', 'middleName'] });
  });

  it('should work for objects whose values are mix of array and objects', function () {
    var data = { 0: { firstName: "John" }, 1: [1, 2, 3] };
    var result = (0, _getHeaders2.default)(data);
    // Chrome has funny result: { rowHeaders: ['0', '1'], colHeaders: ['firstName', '0', '1', '2', 'length'] })
    (0, _expect2.default)(result).toEqual({ rowHeaders: ['0', '1'], colHeaders: ['firstName', '0', '1', '2'] });
  });
});