'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

var _warnOnce = require('./warn-once');

var _warnOnce2 = _interopRequireDefault(_warnOnce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtRule = function (_Container) {
    _inherits(AtRule, _Container);

    function AtRule(defaults) {
        _classCallCheck(this, AtRule);

        var _this = _possibleConstructorReturn(this, _Container.call(this, defaults));

        _this.type = 'atrule';
        return _this;
    }

    AtRule.prototype.append = function append() {
        var _Container$prototype$;

        if (!this.nodes) this.nodes = [];

        for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
            children[_key] = arguments[_key];
        }

        return (_Container$prototype$ = _Container.prototype.append).call.apply(_Container$prototype$, [this].concat(children));
    };

    AtRule.prototype.prepend = function prepend() {
        var _Container$prototype$2;

        if (!this.nodes) this.nodes = [];

        for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            children[_key2] = arguments[_key2];
        }

        return (_Container$prototype$2 = _Container.prototype.prepend).call.apply(_Container$prototype$2, [this].concat(children));
    };

    /* istanbul ignore next */


    _createClass(AtRule, [{
        key: 'afterName',
        get: function get() {
            (0, _warnOnce2.default)('AtRule#afterName was deprecated. Use AtRule#raws.afterName');
            return this.raws.afterName;
        }

        /* istanbul ignore next */
        ,
        set: function set(val) {
            (0, _warnOnce2.default)('AtRule#afterName was deprecated. Use AtRule#raws.afterName');
            this.raws.afterName = val;
        }

        /* istanbul ignore next */

    }, {
        key: '_params',
        get: function get() {
            (0, _warnOnce2.default)('AtRule#_params was deprecated. Use AtRule#raws.params');
            return this.raws.params;
        }

        /* istanbul ignore next */
        ,
        set: function set(val) {
            (0, _warnOnce2.default)('AtRule#_params was deprecated. Use AtRule#raws.params');
            this.raws.params = val;
        }
    }]);

    return AtRule;
}(_container2.default);

exports.default = AtRule;
module.exports = exports['default'];