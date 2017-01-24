"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cnt = 0;

var StoryStore = function () {
  function StoryStore() {
    (0, _classCallCheck3.default)(this, StoryStore);

    this._data = {};
  }

  (0, _createClass3.default)(StoryStore, [{
    key: "addStory",
    value: function addStory(kind, name, fn) {
      if (!this._data[kind]) {
        this._data[kind] = {
          kind: kind,
          index: cnt++,
          stories: {}
        };
      }

      this._data[kind].stories[name] = {
        name: name,
        index: cnt++,
        fn: fn
      };
    }
  }, {
    key: "getStoryKinds",
    value: function getStoryKinds() {
      var _this = this;

      return (0, _keys2.default)(this._data).map(function (key) {
        return _this._data[key];
      }).sort(function (info1, info2) {
        return info1.index - info2.index;
      }).map(function (info) {
        return info.kind;
      });
    }
  }, {
    key: "getStories",
    value: function getStories(kind) {
      var _this2 = this;

      if (!this._data[kind]) {
        return [];
      }

      return (0, _keys2.default)(this._data[kind].stories).map(function (name) {
        return _this2._data[kind].stories[name];
      }).sort(function (info1, info2) {
        return info1.index - info2.index;
      }).map(function (info) {
        return info.name;
      });
    }
  }, {
    key: "getStory",
    value: function getStory(kind, name) {
      var storiesKind = this._data[kind];
      if (!storiesKind) {
        return null;
      }

      var storyInfo = storiesKind.stories[name];
      if (!storyInfo) {
        return null;
      }

      return storyInfo.fn;
    }
  }, {
    key: "removeStoryKind",
    value: function removeStoryKind(kind) {
      delete this._data[kind];
    }
  }, {
    key: "hasStoryKind",
    value: function hasStoryKind(kind) {
      return Boolean(this._data[kind]);
    }
  }, {
    key: "hasStory",
    value: function hasStory(kind, name) {
      return Boolean(this.getStory(kind, name));
    }
  }, {
    key: "dumpStoryBook",
    value: function dumpStoryBook() {
      var _this3 = this;

      var data = this.getStoryKinds().map(function (kind) {
        return { kind: kind, stories: _this3.getStories(kind) };
      });

      return data;
    }
  }, {
    key: "size",
    value: function size() {
      return (0, _keys2.default)(this._data).length;
    }
  }, {
    key: "clean",
    value: function clean() {
      var _this4 = this;

      this.getStoryKinds().forEach(function (kind) {
        return delete _this4._data[kind];
      });
    }
  }]);
  return StoryStore;
}();

exports.default = StoryStore;