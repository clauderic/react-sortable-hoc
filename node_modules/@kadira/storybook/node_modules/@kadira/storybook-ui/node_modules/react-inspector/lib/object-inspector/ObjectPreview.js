'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ObjectValue = require('../object/ObjectValue');

var _ObjectValue2 = _interopRequireDefault(_ObjectValue);

var _ObjectName = require('../object/ObjectName');

var _ObjectName2 = _interopRequireDefault(_ObjectName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* NOTE: Chrome console.log is italic */
var styles = {
  preview: {
    fontStyle: 'italic'
  }
};

/* intersperse arr with separator */
function intersperse(arr, sep) {
  if (arr.length === 0) {
    return [];
  }

  return arr.slice(1).reduce(function (xs, x) {
    return xs.concat([sep, x]);
  }, [arr[0]]);
}

/**
 * A preview of the object
 */
var ObjectPreview = function ObjectPreview(_ref) {
  var data = _ref.data;
  var maxProperties = _ref.maxProperties;

  var object = data;

  if ((typeof object === 'undefined' ? 'undefined' : (0, _typeof3.default)(object)) !== 'object' || object === null || object instanceof Date || object instanceof RegExp) {
    return _react2.default.createElement(_ObjectValue2.default, { object: object });
  }

  if (Array.isArray(object)) {
    return _react2.default.createElement(
      'span',
      { style: styles.preview },
      '[',
      intersperse(object.map(function (element, index) {
        return _react2.default.createElement(_ObjectValue2.default, { key: index, object: element });
      }), ", "),
      ']'
    );
  } else {
    var propertyNodes = [];
    for (var propertyName in object) {
      var propertyValue = object[propertyName];
      if (object.hasOwnProperty(propertyName)) {
        var ellipsis = void 0;
        if (propertyNodes.length === maxProperties - 1 && Object.keys(object).length > maxProperties) {
          ellipsis = _react2.default.createElement(
            'span',
            { key: 'ellipsis' },
            '…'
          );
        }
        propertyNodes.push(_react2.default.createElement(
          'span',
          { key: propertyName },
          _react2.default.createElement(_ObjectName2.default, { name: propertyName }),
          ': ',
          _react2.default.createElement(_ObjectValue2.default, { object: propertyValue }),
          ellipsis
        ));
        if (ellipsis) break;
      }
    }

    return _react2.default.createElement(
      'span',
      { style: styles.preview },
      object.constructor.name + ' {',
      intersperse(propertyNodes, ", "),
      '}'
    );
  }
};

ObjectPreview.propTypes = {
  /**
   * max number of properties shown in the property view
   */
  maxProperties: _react.PropTypes.number
};
ObjectPreview.defaultProps = {
  maxProperties: 5
};

exports.default = ObjectPreview;