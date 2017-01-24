'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createStyles = require('../styles/createStyles');

var _createStyles2 = _interopRequireDefault(_createStyles);

var _shouldInline = require('./shouldInline');

var _shouldInline2 = _interopRequireDefault(_shouldInline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OpenTag = function OpenTag(_ref) {
  var tagName = _ref.tagName;
  var attributes = _ref.attributes;
  var styles = _ref.styles;

  return _react2.default.createElement(
    'span',
    { style: styles.base },
    '<',
    _react2.default.createElement(
      'span',
      { style: styles.tagName },
      tagName
    ),
    function () {
      var attributeNodes = [];
      if (attributes) {
        for (var i = 0; i < attributes.length; i++) {
          var attribute = attributes[i];
          attributeNodes.push(_react2.default.createElement(
            'span',
            { key: i },
            ' ',
            _react2.default.createElement(
              'span',
              { style: styles.htmlAttributeName },
              attribute.name
            ),
            '="',
            _react2.default.createElement(
              'span',
              { style: styles.htmlAttributeValue },
              attribute.value
            ),
            '"'
          ));
          return attributeNodes;
        }
      }
    }(),
    '>'
  );
};

// isChildNode style={{ marginLeft: -12 /* hack: offset placeholder */ }}
var CloseTag = function CloseTag(_ref2) {
  var tagName = _ref2.tagName;
  var _ref2$isChildNode = _ref2.isChildNode;
  var isChildNode = _ref2$isChildNode === undefined ? false : _ref2$isChildNode;
  var styles = _ref2.styles;
  return _react2.default.createElement(
    'span',
    { style: Object.assign({}, styles.base, isChildNode && styles.offsetLeft) },
    '</',
    _react2.default.createElement(
      'span',
      { style: styles.tagName },
      tagName
    ),
    '>'
  );
};

var nameByNodeType = {
  1: "ELEMENT_NODE",
  3: "TEXT_NODE",
  7: "PROCESSING_INSTRUCTION_NODE",
  8: "COMMENT_NODE",
  9: "DOCUMENT_NODE",
  10: "DOCUMENT_TYPE_NODE", // http://stackoverflow.com/questions/6088972/get-doctype-of-an-html-as-string-with-javascript
  11: "DOCUMENT_FRAGMENT_NODE"
};

var DOMNodePreview = function DOMNodePreview(_ref3, _ref4) {
  var isCloseTag = _ref3.isCloseTag;
  var name = _ref3.name;
  var data = _ref3.data;
  var expanded = _ref3.expanded;
  var theme = _ref4.theme;

  var styles = (0, _createStyles2.default)('DOMNodePreview', theme);

  if (isCloseTag) {
    return _react2.default.createElement(CloseTag, { styles: styles.htmlCloseTag, isChildNode: true, tagName: data.tagName });
  }

  switch (data.nodeType) {
    case Node.ELEMENT_NODE:
      return _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(OpenTag, { tagName: data.tagName, attributes: data.attributes, styles: styles.htmlOpenTag }),
        (0, _shouldInline2.default)(data) ? data.textContent : !expanded && "…",
        !expanded && _react2.default.createElement(CloseTag, { tagName: data.tagName, styles: styles.htmlCloseTag })
      );
    case Node.TEXT_NODE:
      return _react2.default.createElement(
        'span',
        null,
        data.textContent
      );
    case Node.COMMENT_NODE:
      return _react2.default.createElement(
        'span',
        { style: styles.htmlComment },
        '<!--',
        data.textContent,
        '-->'
      );
    case Node.PROCESSING_INSTRUCTION_NODE:
      return _react2.default.createElement(
        'span',
        null,
        data.nodeName
      );
    case Node.DOCUMENT_TYPE_NODE:
      return _react2.default.createElement(
        'span',
        { style: styles.htmlDoctype },
        '<!DOCTYPE ',
        data.name,
        data.publicId ? ' PUBLIC "' + data.publicId + '"' : '',
        !data.publicId && data.systemId ? ' SYSTEM' : '',
        data.systemId ? ' "' + data.systemId + '"' : '',
        '>'
      );
    case Node.DOCUMENT_NODE:
      return _react2.default.createElement(
        'span',
        null,
        data.nodeName
      );
    case Node.DOCUMENT_FRAGMENT_NODE:
      return _react2.default.createElement(
        'span',
        null,
        data.nodeName
      );
    default:
      return _react2.default.createElement(
        'span',
        null,
        nameByNodeType[data.nodeType]
      );
  }
};

DOMNodePreview.propTypes = {
  /** If true, just render a close tag */
  isCloseTag: _react.PropTypes.bool,
  /**  */
  name: _react.PropTypes.string,
  /** The DOM Node */
  data: _react.PropTypes.object.isRequired,
  /** Whether the DOM node has been expanded. */
  expanded: _react.PropTypes.bool.isRequired
};

DOMNodePreview.contextTypes = {
  theme: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]).isRequired
};

exports.default = DOMNodePreview;