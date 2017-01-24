'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _pathUtils = require('./pathUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = _pathUtils.DEFAULT_ROOT_PATH;

describe('PathUtils', function () {
  beforeEach(function () {});

  it('wildcardPathsFromLevel works', function () {
    (0, _expect2.default)((0, _pathUtils.wildcardPathsFromLevel)(-1)).toEqual([]);
    (0, _expect2.default)((0, _pathUtils.wildcardPathsFromLevel)(0)).toEqual([]);
    (0, _expect2.default)((0, _pathUtils.wildcardPathsFromLevel)(1)).toEqual([root]);
    (0, _expect2.default)((0, _pathUtils.wildcardPathsFromLevel)(2)).toEqual([root, root + '.*']);
    (0, _expect2.default)((0, _pathUtils.wildcardPathsFromLevel)(3)).toEqual([root, root + '.*', root + '.*.*']);
    (0, _expect2.default)((0, _pathUtils.wildcardPathsFromLevel)(4)).toEqual([root, root + '.*', root + '.*.*', root + '.*.*.*']);
  });

  // it('getExpandedPaths works', () => {
  // })
});