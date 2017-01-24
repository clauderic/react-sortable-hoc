"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (provider, reduxStore, actions) {
  var providerApi = {
    onStory: function onStory(cb) {
      providerApi._onStoryCallback = cb;
    },


    addAction: actions.api.addAction,
    setStories: actions.api.setStories,
    selectStory: actions.api.selectStory,
    setOptions: actions.api.setOptions,
    handleShortcut: actions.shortcuts.handleEvent
  };

  provider.handleAPI(providerApi);

  // subscribe to redux store and trigger onStory's callback
  reduxStore.subscribe(function () {
    var _reduxStore$getState = reduxStore.getState();

    var api = _reduxStore$getState.api;

    if (!api) return;
    if (!providerApi._onStoryCallback) return;

    providerApi._onStoryCallback(api.selectedKind, api.selectedStory);
  });
};