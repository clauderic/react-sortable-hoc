'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _pageBus = require('page-bus');

var _pageBus2 = _interopRequireDefault(_pageBus);

var _actions = require('./actions');

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PageBus = function () {
  function PageBus(dataId, reduxStore) {
    (0, _classCallCheck3.default)(this, PageBus);

    this._reduxStore = reduxStore;
    this._dataId = dataId;
    this._pageBus = (0, _pageBus2.default)();
  }

  (0, _createClass3.default)(PageBus, [{
    key: '_ensureDataId',
    value: function _ensureDataId() {
      if (!this._dataId) {
        throw new Error('dataId is not supplied via queryString');
      }
    }
  }, {
    key: '_on',
    value: function _on(key, cb) {
      return this._pageBus.on(this._dataId + '.' + key, cb);
    }
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      this._ensureDataId();
      this._on('setCurrentStory', function (payloadString) {
        var _JSON$parse = JSON.parse(payloadString);

        var kind = _JSON$parse.kind;
        var story = _JSON$parse.story;

        _this._reduxStore.dispatch((0, _actions.selectStory)(kind, story));
      });
    }
  }, {
    key: 'emit',
    value: function emit(key, payload) {
      this._ensureDataId();
      var payloadString = (0, _jsonStringifySafe2.default)(payload);
      return this._pageBus.emit(this._dataId + '.' + key, payloadString);
    }
  }]);
  return PageBus;
}();

exports.default = PageBus;