"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (reduxStore, domNode, provider) {
  return {
    reduxStore: reduxStore,
    domNode: domNode,
    provider: provider
  };
};