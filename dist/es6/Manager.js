'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _sortBy = require('lodash/sortBy');

var _sortBy2 = _interopRequireDefault(_sortBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Manager = function () {
  function Manager() {
    (0, _classCallCheck3.default)(this, Manager);
    this.refs = {};
  }

  (0, _createClass3.default)(Manager, [{
    key: 'add',
    value: function add(collection, ref) {
      if (!this.refs[collection]) {
        this.refs[collection] = [];
      }

      this.refs[collection].push(ref);
    }
  }, {
    key: 'remove',
    value: function remove(collection, ref) {
      var index = this.getIndex(collection, ref);

      if (index !== -1) {
        this.refs[collection].splice(index, 1);
      }
    }
  }, {
    key: 'isActive',
    value: function isActive() {
      return this.active;
    }
  }, {
    key: 'getActive',
    value: function getActive() {
      var _this = this;

      return (0, _find2.default)(this.refs[this.active.collection],
      // eslint-disable-next-line eqeqeq
      function (_ref) {
        var node = _ref.node;
        return node.sortableInfo.index == _this.active.index;
      });
    }
  }, {
    key: 'getIndex',
    value: function getIndex(collection, ref) {
      return this.refs[collection].indexOf(ref);
    }
  }, {
    key: 'getOrderedRefs',
    value: function getOrderedRefs() {
      var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.active.collection;

      return (0, _sortBy2.default)(this.refs[collection], function (_ref2) {
        var node = _ref2.node;
        return node.sortableInfo.index;
      });
    }
  }]);
  return Manager;
}();

exports.default = Manager;