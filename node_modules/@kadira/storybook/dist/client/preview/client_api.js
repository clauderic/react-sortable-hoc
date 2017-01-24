'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClientApi = function () {
  function ClientApi(_ref) {
    var pageBus = _ref.pageBus;
    var storyStore = _ref.storyStore;
    (0, _classCallCheck3.default)(this, ClientApi);

    // pageBus can be null when running in node
    // always check whether pageBus is available
    this._pageBus = pageBus;
    this._storyStore = storyStore;
    this._addons = {};
    this._globalDecorators = [];
  }

  (0, _createClass3.default)(ClientApi, [{
    key: 'setAddon',
    value: function setAddon(addon) {
      this._addons = (0, _extends3.default)({}, this._addons, addon);
    }
  }, {
    key: 'addDecorator',
    value: function addDecorator(decorator) {
      this._globalDecorators.push(decorator);
    }
  }, {
    key: 'clearDecorators',
    value: function clearDecorators() {
      this._globalDecorators = [];
    }
  }, {
    key: 'storiesOf',
    value: function storiesOf(kind, m) {
      var _this = this;

      if (m && m.hot) {
        m.hot.dispose(function () {
          _this._storyStore.removeStoryKind(kind);
        });
      }

      var localDecorators = [];
      var api = {
        kind: kind
      };

      // apply addons
      for (var name in this._addons) {
        if (this._addons.hasOwnProperty(name)) {
          (function () {
            var addon = _this._addons[name];
            api[name] = function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              addon.apply(api, args);
              return api;
            };
          })();
        }
      }

      api.add = function (storyName, getStory) {
        // Wrap the getStory function with each decorator. The first
        // decorator will wrap the story function. The second will
        // wrap the first decorator and so on.
        var decorators = [].concat(localDecorators, (0, _toConsumableArray3.default)(_this._globalDecorators));

        var fn = decorators.reduce(function (decorated, decorator) {
          return function (context) {
            return decorator(function () {
              return decorated(context);
            }, context);
          };
        }, getStory);

        // Add the fully decorated getStory function.
        _this._storyStore.addStory(kind, storyName, fn);
        return api;
      };

      api.addDecorator = function (decorator) {
        localDecorators.push(decorator);
        return api;
      };

      return api;
    }
  }, {
    key: 'action',
    value: function action(name) {
      var pageBus = this._pageBus;

      return function action() {
        for (var _len2 = arguments.length, _args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          _args[_key2] = arguments[_key2];
        }

        var args = (0, _from2.default)(_args);

        // Remove events from the args. Otherwise, it creates a huge JSON string.
        args = args.map(function (arg) {
          if (arg && typeof arg.preventDefault === 'function') {
            return '[SyntheticEvent]';
          }
          return arg;
        });

        var id = _uuid2.default.v4();
        var data = { name: name, args: args };

        if (pageBus) {
          pageBus.emit('addAction', { action: { data: data, id: id } });
        }
      };
    }
  }, {
    key: 'linkTo',
    value: function linkTo(kind, story) {
      var pageBus = this._pageBus;

      return function linkTo() {
        var resolvedKind = typeof kind === 'function' ? kind.apply(undefined, arguments) : kind;
        var resolvedStory = typeof story === 'function' ? story.apply(undefined, arguments) : story;
        var selection = { kind: resolvedKind, story: resolvedStory };

        if (pageBus) {
          pageBus.emit('selectStory', selection);
        }
      };
    }
  }, {
    key: 'getStorybook',
    value: function getStorybook() {
      var _this2 = this;

      return this._storyStore.getStoryKinds().map(function (kind) {
        var stories = _this2._storyStore.getStories(kind).map(function (name) {
          var render = _this2._storyStore.getStory(kind, name);
          return { name: name, render: render };
        });
        return { kind: kind, stories: stories };
      });
    }
  }]);
  return ClientApi;
}();

exports.default = ClientApi;