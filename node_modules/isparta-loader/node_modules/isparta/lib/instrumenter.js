'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Instrumenter = undefined;

var _istanbul = require('istanbul');

var _istanbul2 = _interopRequireDefault(_istanbul);

var _babelCore = require('babel-core');

var _esprima = require('esprima');

var _esprima2 = _interopRequireDefault(_esprima);

var _escodegen = require('escodegen');

var _escodegen2 = _interopRequireDefault(_escodegen);

var _sourceMap = require('source-map');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //

var POSITIONS = ['start', 'end'];

var Instrumenter = exports.Instrumenter = (function (_istanbul$Instrumente) {
  _inherits(Instrumenter, _istanbul$Instrumente);

  function Instrumenter() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Instrumenter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Instrumenter).call(this));

    _istanbul2.default.Instrumenter.call(_this, options);

    _this.babelOptions = _extends({
      sourceMap: true
    }, options && options.babel || {});
    return _this;
  }

  _createClass(Instrumenter, [{
    key: 'instrumentSync',
    value: function instrumentSync(code, fileName) {

      var result = this._r = (0, _babelCore.transform)(code, _extends({}, this.babelOptions, { filename: fileName }));
      this._babelMap = new _sourceMap.SourceMapConsumer(result.map);

      // PARSE
      var program = _esprima2.default.parse(result.code, {
        loc: true,
        range: true,
        tokens: this.opts.preserveComments,
        comment: true
      });

      if (this.opts.preserveComments) {
        program = _escodegen2.default.attachComments(program, program.comments, program.tokens);
      }

      return this.instrumentASTSync(program, fileName, code);
    }
  }, {
    key: 'getPreamble',
    value: function getPreamble(sourceCode, emitUseStrict) {
      var _this2 = this;

      [['s', 'statementMap'], ['f', 'fnMap'], ['b', 'branchMap']].forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var metricName = _ref2[0];
        var metricMapName = _ref2[1];
        var metrics = _this2.coverState[metricName];
        var metricMap = _this2.coverState[metricMapName];

        var transformFctName = '_' + metricMapName + 'Transformer';
        var transformedMetricMap = _this2[transformFctName](metricMap, metrics);
        _this2.coverState[metricMapName] = transformedMetricMap;
      });

      return _get(Object.getPrototypeOf(Instrumenter.prototype), 'getPreamble', this).call(this, sourceCode, emitUseStrict);
    }

    ////

  }, {
    key: '_statementMapTransformer',
    value: function _statementMapTransformer(metrics) {
      var _this3 = this;

      return Object.keys(metrics).map(function (index) {
        return metrics[index];
      }).map(function (statementMeta) {
        var _getMetricOriginalLoc = _this3._getMetricOriginalLocations([statementMeta]);

        var _getMetricOriginalLoc2 = _slicedToArray(_getMetricOriginalLoc, 1);

        var location = _getMetricOriginalLoc2[0];

        return location;
      }).reduce(this._arrayToArrayLikeObject, {});
    }
  }, {
    key: '_fnMapTransformer',
    value: function _fnMapTransformer(metrics) {
      var _this4 = this;

      return Object.keys(metrics).map(function (index) {
        return metrics[index];
      }).map(function (fnMeta) {
        var _getMetricOriginalLoc3 = _this4._getMetricOriginalLocations([fnMeta.loc]);

        var _getMetricOriginalLoc4 = _slicedToArray(_getMetricOriginalLoc3, 1);

        var loc = _getMetricOriginalLoc4[0];

        // Force remove the last skip key

        if (fnMeta.skip === undefined) {
          delete fnMeta.skip;
          if (loc.skip !== undefined) {
            fnMeta.skip = loc.skip;
          }
        }

        return _extends({}, fnMeta, { loc: loc });
      }).reduce(this._arrayToArrayLikeObject, {});
    }
  }, {
    key: '_branchMapTransformer',
    value: function _branchMapTransformer(metrics) {
      var _this5 = this;

      return Object.keys(metrics).map(function (index) {
        return metrics[index];
      }).map(function (branchMeta) {
        return _extends({}, branchMeta, {
          locations: _this5._getMetricOriginalLocations(branchMeta.locations)
        });
      }).reduce(this._arrayToArrayLikeObject, {});
    }

    ////

  }, {
    key: '_getMetricOriginalLocations',
    value: function _getMetricOriginalLocations() {
      var _this6 = this;

      var metricLocations = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var o = { line: 0, column: 0 };

      return metricLocations.map(function (generatedPositions) {
        return [_this6._getOriginalPositionsFor(generatedPositions), generatedPositions];
      }).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2);

        var _ref4$ = _ref4[0];
        var start = _ref4$.start;
        var end = _ref4$.end;
        var generatedPosition = _ref4[1];

        var postitions = [start.line, start.column, end.line, end.column];
        var isValid = postitions.every(function (n) {
          return n !== null;
        });

        // Matches behavior in _fnMapTransformer above.
        if (generatedPosition.skip === undefined) {
          delete generatedPosition.skip;
        }

        return isValid ? _extends({}, generatedPosition, { start: start, end: end }) : { start: o, end: o, skip: true };
      });
    }
  }, {
    key: '_getOriginalPositionsFor',
    value: function _getOriginalPositionsFor() {
      var _this7 = this;

      var generatedPositions = arguments.length <= 0 || arguments[0] === undefined ? { start: {}, end: {} } : arguments[0];

      return POSITIONS.map(function (position) {
        return [generatedPositions[position], position];
      }).reduce(function (originalPositions, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 2);

        var generatedPosition = _ref6[0];
        var position = _ref6[1];

        var originalPosition = _this7._babelMap.originalPositionFor(generatedPosition);
        // remove extra keys
        delete originalPosition.name;
        delete originalPosition.source;
        originalPositions[position] = originalPosition;
        return originalPositions;
      }, {});
    }
  }, {
    key: '_arrayToArrayLikeObject',
    value: function _arrayToArrayLikeObject(arrayLikeObject, item, index) {
      arrayLikeObject[index + 1] = item;
      return arrayLikeObject;
    }
  }]);

  return Instrumenter;
})(_istanbul2.default.Instrumenter);