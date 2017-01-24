'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setInitialStory = setInitialStory;
exports.setError = setError;
exports.clearError = clearError;
exports.selectStory = selectStory;
var types = exports.types = {
  SET_ERROR: 'PREVIEW_SET_ERROR',
  CLEAR_ERROR: 'PREVIEW_CLEAR_ERROR',
  SELECT_STORY: 'PREVIEW_SELECT_STORY',
  SET_INITIAL_STORY: 'PREVIEW_SET_INITIAL_STORY'
};

function setInitialStory(storyKindList) {
  return {
    type: types.SET_INITIAL_STORY,
    storyKindList: storyKindList
  };
}

function setError(error) {
  return {
    type: types.SET_ERROR,
    error: error
  };
}

function clearError() {
  return {
    type: types.CLEAR_ERROR
  };
}

function selectStory(kind, story) {
  return {
    type: types.SELECT_STORY,
    kind: kind,
    story: story
  };
}