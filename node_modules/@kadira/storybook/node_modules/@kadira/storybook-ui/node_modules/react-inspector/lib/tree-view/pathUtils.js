'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasChildNodes = hasChildNodes;
var DEFAULT_ROOT_PATH = exports.DEFAULT_ROOT_PATH = '$';

var WILDCARD = '*';

function hasChildNodes(data, dataIterator) {
  return !dataIterator(data).next().done;
}

var wildcardPathsFromLevel = exports.wildcardPathsFromLevel = function wildcardPathsFromLevel(level) {
  // i is depth
  return Array.from({ length: level }, function (_, i) {
    return [DEFAULT_ROOT_PATH].concat(Array.from({ length: i }, function (_, j) {
      return '*';
    })).join('.');
  });
};

var getExpandedPaths = exports.getExpandedPaths = function getExpandedPaths(data, dataIterator, expandPaths, expandLevel) {
  var initialState = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];


  var wildcardPaths = [].concat(wildcardPathsFromLevel(expandLevel)).concat(expandPaths).filter(function (path) {
    return typeof path === 'string';
  }); // could be undefined

  var expandedPaths = [];
  wildcardPaths.forEach(function (wildcardPath) {
    var keyPaths = wildcardPath.split('.');
    var populatePaths = function populatePaths(curData, curPath, depth) {
      if (depth === keyPaths.length) {
        expandedPaths.push(curPath);
        return;
      }
      var key = keyPaths[depth];
      if (depth === 0) {
        if (hasChildNodes(curData, dataIterator) && (key === DEFAULT_ROOT_PATH || key === WILDCARD)) {
          populatePaths(curData, DEFAULT_ROOT_PATH, depth + 1);
        }
      } else {
        if (key === WILDCARD) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = dataIterator(curData)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _step$value = _step.value;
              var name = _step$value.name;
              var _data = _step$value.data;

              if (hasChildNodes(_data, dataIterator)) {
                populatePaths(_data, curPath + '.' + name, depth + 1);
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else {
          var value = curData[key];
          if (hasChildNodes(value, dataIterator)) {
            populatePaths(value, curPath + '.' + key, depth + 1);
          }
        }
      }
    };

    populatePaths(data, '', 0);
  });

  return expandedPaths.reduce(function (obj, path) {
    obj[path] = true;
    return obj;
  }, initialState);
};