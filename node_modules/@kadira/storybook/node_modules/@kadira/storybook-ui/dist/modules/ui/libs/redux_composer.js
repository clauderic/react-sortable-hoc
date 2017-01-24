'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseComposer = baseComposer;
exports.default = reduxComposer;

var _mantraCore = require('mantra-core');

function baseComposer(fn, props, onData) {
  var _props$context = props.context();

  var reduxStore = _props$context.reduxStore;


  var processState = function processState() {
    try {
      var state = reduxStore.getState();
      var data = fn(state, props);
      onData(null, data);
    } catch (ex) {
      onData(ex);
    }
  };

  processState();
  reduxStore.subscribe(processState);
}

function reduxComposer(fn) {
  return (0, _mantraCore.compose)(baseComposer.bind(null, fn));
}