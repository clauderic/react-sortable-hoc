"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TEXT_NODE_MAX_INLINE_CHARS = 80;

var shouldInline = function shouldInline(data) {
  return data.childNodes.length === 0 || data.childNodes.length === 1 && data.childNodes[0].nodeType === Node.TEXT_NODE && data.textContent.length < TEXT_NODE_MAX_INLINE_CHARS;
};

exports.default = shouldInline;