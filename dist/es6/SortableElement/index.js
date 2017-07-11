'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = sortableElement;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Export Higher Order Sortable Element Component
function sortableElement(WrappedComponent) {
  var _class, _temp;

  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { withRef: false };

  return _temp = _class = function (_Component) {
    (0, _inherits3.default)(_class, _Component);

    function _class() {
      (0, _classCallCheck3.default)(this, _class);
      return (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).apply(this, arguments));
    }

    (0, _createClass3.default)(_class, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _props = this.props,
            collection = _props.collection,
            disabled = _props.disabled,
            index = _props.index;


        if (!disabled) {
          this.setDraggable(collection, index);
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (this.props.index !== nextProps.index && this.node) {
          this.node.sortableInfo.index = nextProps.index;
        }
        if (this.props.disabled !== nextProps.disabled) {
          var collection = nextProps.collection,
              disabled = nextProps.disabled,
              index = nextProps.index;

          if (disabled) {
            this.removeDraggable(collection);
          } else {
            this.setDraggable(collection, index);
          }
        } else if (this.props.collection !== nextProps.collection) {
          this.removeDraggable(this.props.collection);
          this.setDraggable(nextProps.collection, nextProps.index);
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _props2 = this.props,
            collection = _props2.collection,
            disabled = _props2.disabled;


        if (!disabled) this.removeDraggable(collection);
      }
    }, {
      key: 'setDraggable',
      value: function setDraggable(collection, index) {
        var node = this.node = (0, _reactDom.findDOMNode)(this);

        node.sortableInfo = {
          index: index,
          collection: collection,
          manager: this.context.manager
        };

        this.ref = { node: node };
        this.context.manager.add(collection, this.ref);
      }
    }, {
      key: 'removeDraggable',
      value: function removeDraggable(collection) {
        this.context.manager.remove(collection, this.ref);
      }
    }, {
      key: 'getWrappedInstance',
      value: function getWrappedInstance() {
        (0, _invariant2.default)(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableElement() call');
        return this.refs.wrappedInstance;
      }
    }, {
      key: 'render',
      value: function render() {
        var ref = config.withRef ? 'wrappedInstance' : null;

        return _react2.default.createElement(WrappedComponent, (0, _extends3.default)({
          ref: ref
        }, (0, _utils.omit)(this.props, 'collection', 'disabled', 'index')));
      }
    }]);
    return _class;
  }(_react.Component), _class.displayName = (0, _utils.provideDisplayName)('sortableElement', WrappedComponent), _class.contextTypes = {
    manager: _propTypes2.default.object.isRequired
  }, _class.propTypes = {
    index: _propTypes2.default.number.isRequired,
    collection: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    disabled: _propTypes2.default.bool
  }, _class.defaultProps = {
    collection: 0
  }, _temp;
}